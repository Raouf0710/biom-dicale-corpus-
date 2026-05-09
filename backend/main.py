from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from typing import Optional
from collections import Counter, defaultdict
import math

app = FastAPI(title="Biomedical Corpus API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "biomedical_corpus"

def get_db():
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    return client[DB_NAME]

@app.get("/")
def root():
    return {"message": "Biomedical Corpus API is running"}

@app.get("/api/stats")
def get_stats():
    """Global statistics of the corpus"""
    try:
        db = get_db()
        articles = db.articles
        total = articles.count_documents({})
        
        # Articles par année
        pipeline_year = [
            {"$match": {"publication_date": {"$ne": None, "$ne": ""}}},
            {"$group": {"_id": "$year", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}}
        ]
        by_year = list(articles.aggregate(pipeline_year))
        
        # Articles par domaine
        pipeline_domain = [
            {"$match": {"domain": {"$ne": None, "$ne": ""}}},
            {"$group": {"_id": "$domain", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 15}
        ]
        by_domain = list(articles.aggregate(pipeline_domain))
        
        # Articles par source
        pipeline_source = [
            {"$group": {"_id": "$source", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        by_source = list(articles.aggregate(pipeline_source))
        
        # Journaux les plus fréquents
        pipeline_journal = [
            {"$match": {"journal": {"$ne": None, "$ne": ""}}},
            {"$group": {"_id": "$journal", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        top_journals = list(articles.aggregate(pipeline_journal))
        
        # Articles avec DOI
        with_doi = articles.count_documents({"doi": {"$ne": None, "$ne": ""}})
        
        return {
            "total": total,
            "by_year": [{"year": d["_id"], "count": d["count"]} for d in by_year if d["_id"]],
            "by_domain": [{"domain": d["_id"], "count": d["count"]} for d in by_domain],
            "by_source": [{"source": d["_id"], "count": d["count"]} for d in by_source],
            "top_journals": [{"journal": d["_id"], "count": d["count"]} for d in top_journals],
            "with_doi": with_doi,
            "without_doi": total - with_doi
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/articles")
def get_articles(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    domain: Optional[str] = None,
    year: Optional[int] = None,
    source: Optional[str] = None
):
    """Get articles with filters and pagination"""
    try:
        db = get_db()
        articles = db.articles
        
        query = {}
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"abstract": {"$regex": search, "$options": "i"}},
                {"authors": {"$regex": search, "$options": "i"}}
            ]
        if domain:
            query["domain"] = {"$regex": domain, "$options": "i"}
        if year:
            query["year"] = year
        if source:
            query["source"] = source
        
        total = articles.count_documents(query)
        skip = (page - 1) * limit
        docs = list(articles.find(query, {"_id": 0}).skip(skip).limit(limit))
        
        return {
            "articles": docs,
            "total": total,
            "page": page,
            "pages": math.ceil(total / limit) if total > 0 else 1
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/domains")
def get_domains():
    """Get list of unique domains"""
    try:
        db = get_db()
        domains = db.articles.distinct("domain", {"domain": {"$ne": None, "$ne": ""}})
        return {"domains": sorted(domains)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/years")
def get_years():
    """Get list of unique years"""
    try:
        db = get_db()
        years = db.articles.distinct("year", {"year": {"$ne": None}})
        return {"years": sorted([y for y in years if y])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health():
    try:
        db = get_db()
        db.command("ping")
        count = db.articles.count_documents({})
        return {"status": "ok", "mongodb": "connected", "articles_count": count}
    except Exception as e:
        return {"status": "error", "mongodb": str(e)}
