# 🐍 GenMedia Backend Service

FastAPI-powered REST microservice orchestrating generative media tasks via **Genblaze SDK** and storing assets on **Backblaze B2**.

## 🚀 Quick Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Unix/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env

# Run FastAPI app
uvicorn app.main:app --reload --port 8000
```

Swagger UI documentation will be available at: `http://localhost:8000/docs`
