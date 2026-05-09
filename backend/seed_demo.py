"""
Seeder de données de démonstration
Lance ce script si la collecte depuis les APIs échoue (pas d'internet)
ou pour tester rapidement l'application.
"""
import random
from datetime import datetime
from pymongo import MongoClient, UpdateOne
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

DOMAINS = [
    "Intelligence Artificielle / ML",
    "Traitement du Langage Naturel",
    "Bioinformatique",
    "Génomique",
    "Découverte de Médicaments",
    "Maladies Infectieuses",
    "Oncologie",
    "Cardiologie",
    "Imagerie Médicale",
    "Informatique de Santé",
    "Biomédecine Générale",
    "Endocrinologie",
    "Neurologie",
    "Biochimie / Protéomique"
]

JOURNALS = [
    "Nature Medicine", "The Lancet", "NEJM", "JAMA", "BMJ",
    "PLOS ONE", "Bioinformatics", "Nature Biotechnology",
    "Cell", "Science", "PLOS Medicine", "JAMIA",
    "Journal of Medical Internet Research", "npj Digital Medicine",
    "IEEE JBHI", "Artificial Intelligence in Medicine"
]

SOURCES = ["PubMed", "Semantic Scholar"]

TITLES = [
    "Deep Learning for Early Detection of Pancreatic Cancer Using CT Imaging",
    "A Transformer-Based Model for Clinical Named Entity Recognition",
    "BERT Fine-Tuning for Biomedical Text Classification",
    "Graph Neural Networks for Drug-Target Interaction Prediction",
    "COVID-19 Severity Prediction Using Machine Learning",
    "Multi-Modal Learning for Alzheimer's Disease Diagnosis",
    "Federated Learning for Privacy-Preserving EHR Analysis",
    "Automated Segmentation of Brain Tumors with U-Net",
    "Genome-Wide Association Studies with Deep Neural Networks",
    "Natural Language Processing for Adverse Drug Event Detection",
    "Contrastive Learning for Medical Image Analysis",
    "Reinforcement Learning for Personalized Treatment Recommendations",
    "Attention Mechanisms in Clinical Decision Support",
    "Large Language Models in Medical Question Answering",
    "Self-Supervised Learning for Chest X-Ray Classification",
    "Explainable AI for Sepsis Prediction in ICU",
    "Graph-Based Protein Structure Prediction",
    "Knowledge Graph Completion in Biomedicine",
    "Zero-Shot Learning for Rare Disease Classification",
    "Transfer Learning Approaches in Radiology",
    "Semi-Supervised Learning for Histopathology Images",
    "Biomarker Discovery Using Metabolomics and ML",
    "Predicting Drug Resistance in Tuberculosis",
    "EHR Phenotyping with Unsupervised Learning",
    "Multivariate Time Series for ICU Mortality Prediction",
    "CRISPR Target Prediction with Deep Learning",
    "Cell Type Deconvolution from Bulk RNA-Seq",
    "Single-Cell Transcriptomics Analysis Pipeline",
    "Automated Pathology Report Generation",
    "Survival Analysis with Neural Networks",
    "Mental Health Assessment Using NLP",
    "Retinal Image Analysis for Diabetic Retinopathy",
    "Automated ECG Interpretation with CNN",
    "mRNA Vaccine Efficacy Prediction Models",
    "Clinical Trial Outcome Prediction",
    "Patient Similarity Networks for Precision Medicine",
    "Ontology-Based Clinical Data Integration",
    "Active Learning for Medical Image Annotation",
    "Multimodal Fusion for Dementia Diagnosis",
    "AI-Assisted Colonoscopy for Polyp Detection",
]

AUTHORS_POOL = [
    "Zhang Y", "Li J", "Wang X", "Chen M", "Liu H",
    "Smith J", "Johnson A", "Brown K", "Davis R", "Miller S",
    "Müller K", "Schmidt H", "Fischer M", "Weber A", "Bauer T",
    "García J", "Martínez L", "López A", "Sánchez P", "González R",
    "Tanaka K", "Yamamoto H", "Suzuki T", "Nakamura Y", "Kobayashi S"
]

ABSTRACTS = [
    "We present a novel deep learning approach for automated analysis of biomedical data. Our method achieves state-of-the-art performance on multiple benchmark datasets, demonstrating significant improvements over existing baselines. The proposed architecture incorporates attention mechanisms and transfer learning to handle the limited labeled data typical in clinical settings.",
    "This study investigates the application of natural language processing to extract structured information from unstructured clinical notes. We trained a BERT-based model on a large corpus of electronic health records and evaluated its performance on named entity recognition and relation extraction tasks.",
    "We developed a graph-based framework for predicting drug-target interactions using heterogeneous biological networks. The model integrates protein-protein interaction data, chemical fingerprints, and gene expression profiles to achieve high accuracy in virtual screening experiments.",
    "A large-scale retrospective cohort study was conducted to evaluate machine learning models for predicting patient outcomes in intensive care units. Our ensemble approach, combining gradient boosting with neural networks, significantly outperformed traditional scoring systems such as APACHE II.",
    "We propose a federated learning framework that enables collaborative model training across multiple hospitals without sharing sensitive patient data. The approach maintains data privacy while achieving model performance comparable to centralized training on the combined dataset.",
    "Genome-wide association analysis combined with deep learning identified novel genetic variants associated with cardiovascular disease risk. The integrative approach leveraged multi-omics data including genomics, transcriptomics, and proteomics from a diverse cohort.",
    "This systematic review and meta-analysis evaluates the diagnostic accuracy of AI-based tools for detecting COVID-19 from chest CT and X-ray images. We analyzed 150 studies and found that convolutional neural networks achieve sensitivity and specificity comparable to expert radiologists.",
    "We introduce a self-supervised pre-training strategy for medical image analysis that leverages large amounts of unlabeled data. The pre-trained model, when fine-tuned on small labeled datasets, achieves superior performance across multiple downstream tasks including classification, detection, and segmentation.",
]

def generate_articles(n=300):
    articles = []
    for i in range(n):
        source = random.choice(SOURCES)
        title = random.choice(TITLES) + f" — Study {i+1}"
        year = random.randint(2015, 2024)
        num_authors = random.randint(2, 6)
        authors = ", ".join(random.sample(AUTHORS_POOL, min(num_authors, len(AUTHORS_POOL))))
        domain = random.choice(DOMAINS)
        journal = random.choice(JOURNALS)
        has_doi = random.random() > 0.2
        doi = f"10.{random.randint(1000,9999)}/{''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=8))}" if has_doi else ""
        abstract = random.choice(ABSTRACTS)
        
        uid = f"demo_{source.replace(' ','_').lower()}_{i+1:04d}"
        articles.append({
            "id": uid,
            "title": title,
            "authors": authors,
            "abstract": abstract,
            "doi": doi,
            "journal": journal,
            "publication_date": str(year),
            "year": year,
            "domain": domain,
            "source": source,
            "url": f"https://pubmed.ncbi.nlm.nih.gov/{random.randint(30000000, 39999999)}/" if source == "PubMed" else f"https://www.semanticscholar.org/paper/{uid}",
            "collected_at": datetime.utcnow().isoformat()
        })
    return articles

def seed():
    print("🌱 Seeding demo data into MongoDB...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client["biomedical_corpus"]
    col = db.articles

    col.create_index("id", unique=True)
    col.create_index("year")
    col.create_index("domain")
    col.create_index("source")

    articles = generate_articles(300)
    ops = [UpdateOne({"id": a["id"]}, {"$set": a}, upsert=True) for a in articles]
    result = col.bulk_write(ops, ordered=False)
    total = col.count_documents({})
    
    print(f"✅ Done! {result.upserted_count} inserted, {result.modified_count} updated")
    print(f"📊 Total in MongoDB: {total} articles")
    client.close()

if __name__ == "__main__":
    seed()
