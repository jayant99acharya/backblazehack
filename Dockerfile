# Multi-stage Dockerfile for Google Cloud Run deployment

# Stage 1: Build Frontend (Vite / React)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend (FastAPI + B2 SDK)
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code into app/backend
COPY backend/ ./app

# Copy built frontend assets into app/static for static serving
COPY --from=frontend-builder /app/frontend/dist ./static

# Set Environment Variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/app

EXPOSE 8080

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
