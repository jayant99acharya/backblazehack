# 🚀 GenMedia App - Generative AI Media Pipeline

> **Backblaze GenAI Media Hackathon Scaffold**  
> Build the next generation of AI media applications. Generate with Genblaze SDK. Store on Backblaze B2 S3-Compatible Cloud Storage.

---

## 📌 Project Overview

**GenMedia App** is a scalable, production-ready full-stack scaffold designed for generative media workflows across video, image, audio, and multimodal AI pipelines.

* **Frontend**: Modern React (Vite) + Tailwind CSS + React Router + Axios
* **Backend**: FastAPI + Uvicorn + Pydantic v2 + Boto3 (Backblaze B2 S3 API)
* **Storage**: Backblaze B2 Cloud Object Storage (10GB Free Tier, S3 Compatible)
* **AI Orchestration**: Genblaze SDK (Open Source Python SDK by Backblaze for GMI Cloud, OpenAI, Runway, ElevenLabs, etc.)

---

## 📁 Repository Directory Structure

```text
genmedia-app/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── generate.py      # Generation endpoints (stubs + TODOs)
│   │   │   │   ├── storage.py       # Backblaze B2 storage endpoints (stubs + TODOs)
│   │   │   │   └── health.py        # System health & dependency checks
│   │   │   └── router.py            # API V1 Master Router
│   │   │
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic environment configuration
│   │   │   ├── logger.py            # Structured logging system
│   │   │   └── constants.py         # Media types & status constants
│   │   │
│   │   ├── services/
│   │   │   ├── genblaze_service.py # Genblaze SDK orchestration wrapper
│   │   │   ├── b2_service.py        # Backblaze B2 boto3 S3 client
│   │   │   └── metadata_service.py  # Provenance & metadata tracker
│   │   │
│   │   ├── models/
│   │   │   ├── media.py             # Domain data models & enums
│   │   │   └── request_models.py   # Pydantic API schemas
│   │   │
│   │   ├── utils/
│   │   │   ├── helpers.py           # Helper utilities
│   │   │   └── validators.py        # Request & prompt sanitization
│   │   │
│   │   ├── main.py                  # FastAPI application entrypoint
│   │   └── __init__.py
│   │
│   ├── uploads/                     # Temporary local file buffer
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Backend environment template
│   ├── .gitignore
│   ├── README.md                    # Backend documentation
│   └── Dockerfile                   # Container configuration
│
├── frontend/
│   ├── src/
│   │   ├── assets/                  # Static media assets
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Global navigation bar with theme toggle
│   │   │   ├── Sidebar.jsx          # Media type filter sidebar
│   │   │   ├── PromptForm.jsx       # Interactive AI prompt builder
│   │   │   ├── Gallery.jsx          # Responsive media grid view
│   │   │   ├── MediaCard.jsx        # Asset card with provenance drawer
│   │   │   ├── Loader.jsx           # Glowing AI pulse loader
│   │   │   └── Footer.jsx           # Footer with hackathon links
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing overview & showcase
│   │   │   ├── Generate.jsx         # AI Media Studio workspace
│   │   │   ├── GalleryPage.jsx      # Vault for stored generated media
│   │   │   └── Settings.jsx         # B2 & Genblaze settings manager
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios API client
│   │   │
│   │   ├── hooks/                   # Custom React hooks (e.g., useTheme)
│   │   ├── context/                 # React Context providers (e.g., ThemeContext)
│   │   ├── utils/                   # Formatter & helper functions
│   │   ├── App.jsx                  # Main Application Component & Routes
│   │   ├── main.jsx                 # Vite Entrypoint
│   │   └── index.css                # Tailwind directives & CSS design system
│   │
│   ├── public/                      # Static public files
│   ├── .env.example                 # Frontend environment template
│   ├── package.json                 # Node dependencies & scripts
│   ├── vite.config.js               # Vite build configuration & server proxy
│   ├── tailwind.config.js           # Tailwind CSS design system config
│   ├── postcss.config.js            # PostCSS configuration
│   └── README.md                    # Frontend documentation
│
├── docs/
│   ├── architecture.md              # System design & pipeline workflow
│   ├── api.md                       # API Endpoint specs
│   └── setup.md                     # Comprehensive setup guide
│
├── .gitignore
├── README.md                        # Project root documentation
└── LICENSE                          # MIT License
```

---

## ⚡ Quick Start

### 1. Prerequisites

* **Python**: 3.11 or higher
* **Node.js**: v18.0.0 or higher (v22 recommended)
* **npm**: 9.0.0 or higher

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd genmedia-app/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables template
cp .env.example .env

# Run FastAPI server with Uvicorn auto-reload
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`  
Interactive API Docs (Swagger UI): `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd genmedia-app/frontend

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Start Vite development server
npm run dev
```

Frontend application will be live at: `http://localhost:5173`

---

## 🔑 Environment Variables Configuration

### Backend (`genmedia-app/backend/.env`)

```env
# Backblaze B2 Cloud Storage Configuration
B2_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_application_key
B2_BUCKET_NAME=your_b2_bucket_name
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com

# Generative AI Provider API Keys
GENBLAZE_API_KEY=your_genblaze_api_key
OPENAI_API_KEY=your_openai_api_key

# Server Host & Port
HOST=0.0.0.0
PORT=8000
```

### Frontend (`genmedia-app/frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

---

## 📄 Documentation

Check out the [`docs/`](./docs) directory for in-depth specs:
* [Architecture Overview](./docs/architecture.md)
* [API Endpoint Reference](./docs/api.md)
* [Developer Setup & Deployment Guide](./docs/setup.md)

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
