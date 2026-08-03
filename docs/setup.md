# 🛠️ GenMedia App - Setup & Deployment Guide

> Complete step-by-step walkthrough to get the full-stack scaffold running locally and deploying to Vercel and Render.

---

## 💻 1. Local Environment Setup

### Prerequisites

| Component | Minimum Version | Recommended |
| :--- | :--- | :--- |
| **Python** | 3.11+ | 3.11.9 |
| **Node.js** | 18.0+ | 22.19.0 |
| **npm** | 9.0+ | 10.9.3 |
| **Git** | 2.30+ | Latest |

---

### Backend Setup Steps

1. Navigate to the backend directory:
   ```bash
   cd genmedia-app/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell)**: `.\venv\Scripts\Activate.ps1`
   - **Linux/macOS**: `source venv/bin/activate`

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

6. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

---

### Frontend Setup Steps

1. Open a separate terminal and navigate to the frontend directory:
   ```bash
   cd genmedia-app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Launch Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`.

---

## 🚀 2. Deployment Instructions

### Deploying Frontend to Vercel

1. Push your code to GitHub.
2. Log in to [Vercel Dashboard](https://vercel.com).
3. Select **Import Project** and point to your repository.
4. Set **Root Directory** to `frontend`.
5. Framework Preset: **Vite**.
6. Set Environment Variables:
   - `VITE_API_URL`: `https://your-backend-render-url.onrender.com`
7. Click **Deploy**.

---

### Deploying Backend to Render

1. Log in to [Render Dashboard](https://render.com).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Set **Root Directory** to `backend`.
5. Environment: **Python 3**.
6. Build Command: `pip install -r requirements.txt`
7. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
8. Add Environment Variables:
   - `B2_KEY_ID`
   - `B2_APPLICATION_KEY`
   - `B2_BUCKET_NAME`
   - `B2_ENDPOINT`
   - `GENBLAZE_API_KEY`
   - `OPENAI_API_KEY`
9. Deploy Web Service.
