# 🧬 BioCorpus — Corpus Biomédical

Application web complète pour l'exploration et la visualisation d'un corpus d'articles scientifiques biomédicaux.

> **Projet 6 · Déploiement sur le cloud · Faculté d'Informatique USTHB · Mars 2026**

---

## 🗂️ Structure du Projet

```
biomedical-corpus/
├── backend/
│   ├── main.py            ← API FastAPI (Python)
│   ├── collect_data.py    ← Collecte PubMed + Semantic Scholar
│   ├── seed_demo.py       ← Données de démo (test rapide)
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/    ← ParticleBg, Navbar, StatCard
    │   ├── pages/         ← HomePage, CorpusPage
    │   ├── hooks/         ← useApi.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Prérequis

- **Python 3.10+**
- **Node.js 18+**
- **MongoDB** (local ou Atlas)

---

## 🚀 Installation & Lancement

### Étape 1 — MongoDB

**Option A : MongoDB local**
```bash
# Ubuntu/Debian
sudo apt install mongodb
sudo systemctl start mongodb

# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows : télécharger depuis https://www.mongodb.com/try/download/community
```

**Option B : MongoDB Atlas (cloud, gratuit)**
1. Créez un compte sur https://cloud.mongodb.com
2. Créez un cluster gratuit (M0)
3. Obtenez l'URI de connexion : `mongodb+srv://user:pass@cluster.mongodb.net/`

---

### Étape 2 — Backend (Python / FastAPI)

```bash
cd biomedical-corpus/backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement
# Linux/Mac :
source venv/bin/activate
# Windows :
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer MongoDB (optionnel si local)
cp .env.example .env
# Éditez .env si vous utilisez Atlas :
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
```

---

### Étape 3 — Collecter les données

**Option A : Collecte réelle depuis PubMed & Semantic Scholar**
```bash
# Dans backend/ avec venv activé :
python collect_data.py
# ⏱️ Durée : ~5-10 minutes (respecte les rate limits des APIs)
# 📦 Résultat : ~400-600 articles dans MongoDB
```

**Option B : Données de démo (immédiat, pour tester)**
```bash
python seed_demo.py
# ⚡ Durée : <5 secondes
# 📦 Résultat : 300 articles de démonstration
```

---

### Étape 4 — Lancer le Backend

```bash
# Dans backend/ avec venv activé :
uvicorn main:app --reload --port 8000
```

✅ API disponible sur : http://localhost:8000  
✅ Documentation Swagger : http://localhost:8000/docs  
✅ Health check : http://localhost:8000/api/health

---

### Étape 5 — Frontend (React / Vite)

```bash
cd biomedical-corpus/frontend

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

✅ Application disponible sur : **http://localhost:5173**

---

## 🖥️ Pages de l'Application

### Page d'Accueil (`/`)
- Introduction au projet avec animation de particules
- Statistiques globales (total articles, domaines, sources)
- Bouton central **"Visualiser le Corpus"** → transition fluide vers `/corpus`
- Section fonctionnalités et sources de données

### Tableau de Bord (`/corpus`)
- **4 cartes statistiques** animées (total, domaines, DOI, journaux)
- **Graphique évolution temporelle** : articles par année (Area Chart)
- **Graphique domaines** : répartition en camembert (Pie Chart)
- **Graphique journaux** : top journaux (Bar Chart horizontal)
- **Graphique sources** : barres de progression animées
- **Tableau interactif** avec :
  - Recherche full-text (titre, auteurs, résumé)
  - Filtres par domaine, année, source
  - Lignes expandables avec résumé complet
  - Pagination
  - Liens DOI et URL vers articles

---

## 🔌 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Statut MongoDB + nombre d'articles |
| GET | `/api/stats` | Statistiques globales (années, domaines, sources) |
| GET | `/api/articles` | Articles paginés + filtres |
| GET | `/api/domains` | Liste des domaines uniques |
| GET | `/api/years` | Liste des années uniques |

**Paramètres `/api/articles` :**
- `page` (int, défaut: 1)
- `limit` (int, défaut: 20, max: 100)
- `search` (string) — recherche dans titre/résumé/auteurs
- `domain` (string)
- `year` (int)
- `source` (string: "PubMed" ou "Semantic Scholar")

---

## 🐞 Résolution de Problèmes

**MongoDB ne démarre pas :**
```bash
sudo systemctl status mongodb
sudo systemctl start mongodb
```

**Erreur de connexion MongoDB dans FastAPI :**
```bash
# Vérifiez le health endpoint :
curl http://localhost:8000/api/health
```

**Erreur CORS :**
Le proxy Vite `/api → http://localhost:8000` est configuré dans `vite.config.js`. Assurez-vous que le backend tourne sur le port 8000.

**Pas de données affichées :**
```bash
cd backend && python seed_demo.py
```

**Rate limit Semantic Scholar (erreur 429) :**
Le script `collect_data.py` gère automatiquement les rate limits avec des délais. Attendez simplement.

---

## 🛠️ Technologies

| Composant | Technologie |
|-----------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Animations | Framer Motion |
| Graphiques | Recharts |
| Backend | Python, FastAPI |
| Base de données | MongoDB (pymongo) |
| Collecte données | PubMed E-utilities API, Semantic Scholar API |

---

## 📊 Sources de Données

- **PubMed** (NCBI) — https://pubmed.ncbi.nlm.nih.gov
- **Semantic Scholar** (Allen AI) — https://www.semanticscholar.org

Les deux APIs sont **gratuites et sans clé** pour un usage raisonnable.

---

## 🏗️ Schéma MongoDB

Chaque article stocké contient :
```json
{
  "id":               "pubmed_12345678",
  "title":            "Titre de l'article",
  "authors":          "Dupont A, Martin B, ...",
  "abstract":         "Résumé de l'article...",
  "doi":              "10.1234/example",
  "journal":          "Nature Medicine",
  "publication_date": "2023",
  "year":             2023,
  "domain":           "Intelligence Artificielle / ML",
  "source":           "PubMed",
  "url":              "https://pubmed.ncbi.nlm.nih.gov/12345678/",
  "collected_at":     "2026-03-01T10:00:00"
}
```
