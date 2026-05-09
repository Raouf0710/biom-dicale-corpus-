"""
Supprime toutes les données de la base MongoDB
et repart de zéro proprement.
"""
from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client["biomedical_corpus"]

before = db.articles.count_documents({})
print(f"Articles avant suppression : {before}")

db.articles.drop()
print("✅ Collection supprimée complètement.")

after = db.articles.count_documents({})
print(f"Articles après suppression : {after}")
client.close()
