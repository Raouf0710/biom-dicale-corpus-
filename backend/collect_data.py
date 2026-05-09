"""
Script de collecte des données biomédicales - CORRIGÉ
Sources: PubMed, Semantic Scholar
URLs Semantic Scholar correctes
"""

import requests
import time
import re
from datetime import datetime
from pymongo import MongoClient, UpdateOne
from pymongo.errors import BulkWriteError
import xml.etree.ElementTree as ET
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "biomedical_corpus"

SEARCH_TERMS = [
    "machine learning cancer diagnosis",
    "deep learning medical imaging",
    "natural language processing clinical notes",
    "bioinformatics genome sequencing",
    "drug discovery artificial intelligence",
    "COVID-19 treatment clinical trial",
    "diabetes mellitus biomarkers",
    "cardiovascular disease prediction",
    "neural network protein structure",
    "electronic health records mining"
]

DOMAINS = {
    "machine learning": "Intelligence Artificielle / ML",
    "deep learning": "Intelligence Artificielle / ML",
    "neural network": "Intelligence Artificielle / ML",
    "natural language processing": "Traitement du Langage Naturel",
    "bioinformatics": "Bioinformatique",
    "genome": "Génomique",
    "drug discovery": "Découverte de Médicaments",
    "COVID": "Maladies Infectieuses",
    "cancer": "Oncologie",
    "diabetes": "Endocrinologie",
    "cardiovascular": "Cardiologie",
    "clinical": "Médecine Clinique",
    "protein": "Biochimie / Protéomique",
    "imaging": "Imagerie Médicale",
    "electronic health": "Informatique de Santé"
}

def detect_domain(text):
    text_lower = text.lower()
    for keyword, domain in DOMAINS.items():
        if keyword.lower() in text_lower:
            return domain
    return "Biomédecine Générale"

def extract_year(date_str):
    if not date_str:
        return None
    match = re.search(r'\b(19|20)\d{2}\b', str(date_str))
    return int(match.group()) if match else None

def search_pubmed(term, max_results=50):
    base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
    params = {"db": "pubmed", "term": term, "retmax": max_results, "retmode": "json", "sort": "relevance"}
    try:
        r = requests.get(base + "esearch.fcgi", params=params, timeout=15)
        r.raise_for_status()
        ids = r.json().get("esearchresult", {}).get("idlist", [])
        print(f"  PubMed: {len(ids)} IDs pour '{term}'")
        return ids
    except Exception as e:
        print(f"  Erreur PubMed search: {e}")
        return []

def fetch_pubmed_details(pmids):
    if not pmids:
        return []
    base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
    params = {"db": "pubmed", "id": ",".join(pmids), "retmode": "xml"}
    articles = []
    try:
        r = requests.get(base + "efetch.fcgi", params=params, timeout=30)
        r.raise_for_status()
        root = ET.fromstring(r.text)
        for article_el in root.findall(".//PubmedArticle"):
            try:
                medline = article_el.find("MedlineCitation")
                article = medline.find("Article")
                title_el = article.find("ArticleTitle")
                title = "".join(title_el.itertext()) if title_el is not None else ""
                abstract_parts = article.findall(".//AbstractText")
                abstract = " ".join("".join(p.itertext()) for p in abstract_parts)
                authors = []
                for auth in article.findall(".//Author"):
                    last = auth.findtext("LastName", "")
                    fore = auth.findtext("ForeName", "")
                    name = f"{fore} {last}".strip()
                    if name:
                        authors.append(name)
                journal = article.findtext(".//Journal/Title", "")
                doi = ""
                for id_el in article_el.findall(".//ArticleId"):
                    if id_el.get("IdType") == "doi":
                        doi = id_el.text or ""
                pmid = medline.findtext("PMID", "")
                pub_date = article.find(".//PubDate")
                year_text = ""
                if pub_date is not None:
                    year_text = pub_date.findtext("Year", "") or pub_date.findtext("MedlineDate", "")
                year = extract_year(year_text)
                domain = detect_domain(title + " " + abstract)
                if title and pmid:
                    articles.append({
                        "id": f"pubmed_{pmid}",
                        "title": title.strip(),
                        "authors": ", ".join(authors[:5]),
                        "abstract": abstract[:1500] if abstract else "",
                        "doi": doi,
                        "journal": journal,
                        "publication_date": year_text,
                        "year": year,
                        "domain": domain,
                        "source": "PubMed",
                        "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                        "collected_at": datetime.utcnow().isoformat()
                    })
            except Exception:
                continue
    except Exception as e:
        print(f"  Erreur PubMed fetch: {e}")
    return articles

def search_semantic_scholar(term, max_results=25):
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {
        "query": term,
        "limit": max_results,
        "fields": "paperId,title,authors,abstract,year,journal,externalIds,publicationDate,fieldsOfStudy"
    }
    headers = {"User-Agent": "BiomedicalCorpusCollector/1.0"}
    articles = []
    try:
        r = requests.get(url, params=params, headers=headers, timeout=20)
        if r.status_code == 429:
            print("  Rate limit S2, attente 60s...")
            time.sleep(60)
            r = requests.get(url, params=params, headers=headers, timeout=20)
        r.raise_for_status()
        data = r.json().get("data", [])
        print(f"  Semantic Scholar: {len(data)} articles pour '{term}'")
        for paper in data:
            paper_id = paper.get("paperId", "")
            if not paper_id:
                continue
            ext_ids = paper.get("externalIds") or {}
            doi = ext_ids.get("DOI", "")
            pmid = ext_ids.get("PubMed", "")
            authors = [a.get("name", "") for a in (paper.get("authors") or [])[:5]]
            year = paper.get("year")
            journal_info = paper.get("journal") or {}
            journal = journal_info.get("name", "")
            title = paper.get("title", "") or ""
            abstract = paper.get("abstract", "") or ""
            domain = detect_domain(title + " " + abstract)
            # URL correcte : PubMed si PMID dispo, sinon Semantic Scholar avec le vrai paperId
            if pmid:
                article_url = f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
            else:
                article_url = f"https://www.semanticscholar.org/paper/{paper_id}"
            if title:
                articles.append({
                    "id": f"ss_{paper_id}",
                    "title": title.strip(),
                    "authors": ", ".join(authors),
                    "abstract": abstract[:1500],
                    "doi": doi,
                    "journal": journal,
                    "publication_date": str(year) if year else "",
                    "year": year,
                    "domain": domain,
                    "source": "Semantic Scholar",
                    "url": article_url,
                    "collected_at": datetime.utcnow().isoformat()
                })
    except Exception as e:
        print(f"  Erreur Semantic Scholar: {e}")
    return articles

def save_to_mongodb(articles):
    if not articles:
        return
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[DB_NAME]
    col = db.articles
    col.create_index("id", unique=True)
    col.create_index("title")
    col.create_index("year")
    col.create_index("domain")
    col.create_index("source")
    ops = [UpdateOne({"id": a["id"]}, {"$set": a}, upsert=True) for a in articles]
    try:
        result = col.bulk_write(ops, ordered=False)
        print(f"  MongoDB: {result.upserted_count} nouveaux, {result.modified_count} mis à jour")
    except BulkWriteError:
        print("  MongoDB: écriture partielle")
    finally:
        client.close()

def collect_all():
    print("=" * 60)
    print("COLLECTE DU CORPUS BIOMÉDICAL")
    print("=" * 60)
    all_articles = []
    for i, term in enumerate(SEARCH_TERMS, 1):
        print(f"\n[{i}/{len(SEARCH_TERMS)}] Terme: '{term}'")
        print("  → PubMed...")
        pmids = search_pubmed(term, max_results=40)
        if pmids:
            time.sleep(0.4)
            pubmed_articles = fetch_pubmed_details(pmids)
            all_articles.extend(pubmed_articles)
            print(f"     {len(pubmed_articles)} articles extraits")
        time.sleep(1)
        print("  → Semantic Scholar...")
        ss_articles = search_semantic_scholar(term, max_results=25)
        all_articles.extend(ss_articles)
        time.sleep(3)

    print(f"\n{'=' * 60}")
    print(f"Total collecté: {len(all_articles)} (avant dédup)")
    seen = set()
    unique = []
    for a in all_articles:
        key = a["title"].lower().strip()[:80]
        if key not in seen:
            seen.add(key)
            unique.append(a)
    print(f"Après déduplication: {len(unique)} articles uniques")
    print("\nSauvegarde dans MongoDB...")
    save_to_mongodb(unique)
    print("\n✅ Collecte terminée!")
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    total = db.articles.count_documents({})
    print(f"📊 Total dans MongoDB: {total} articles")
    for s in db.articles.aggregate([{"$group": {"_id": "$source", "count": {"$sum": 1}}}]):
        print(f"   - {s['_id']}: {s['count']}")
    client.close()

if __name__ == "__main__":
    collect_all()
