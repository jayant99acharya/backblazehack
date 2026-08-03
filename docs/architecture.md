# 📐 GenMedia App - Architecture Specification

> **Backblaze GenAI Media Hackathon Blueprint**

---

## 🔮 System Overview

The **GenMedia App** architecture connects user prompt inputs with generative AI providers and durable cloud storage on Backblaze B2.

```mermaid
graph TD
    User([User / Web Browser]) -->|HTTP / REST| ReactFrontend[React + Vite Frontend]
    ReactFrontend -->|Axios REST API| FastApiBackend[FastAPI Backend Server]
    
    subgraph FastAPI Core Backend
        FastApiBackend --> Router[API V1 Router]
        Router --> GenRoute[Generate Route /api/v1/generate]
        Router --> StoreRoute[Storage Route /api/v1/storage]
        Router --> HealthRoute[Health Route /api/v1/health]
        
        GenRoute --> GenblazeService[Genblaze Service Orchestrator]
        StoreRoute --> B2StorageService[B2 Storage Service Boto3]
        StoreRoute --> MetadataService[Metadata & Provenance Service]
    end

    subgraph AI Generation Providers via Genblaze SDK
        GenblazeService -->|Orchestrates| GMICloud[GMI Cloud Open Source Models]
        GenblazeService -->|Orchestrates| OpenAI[OpenAI DALL-E / Sora]
        GenblazeService -->|Orchestrates| Runway[Runway Video]
        GenblazeService -->|Orchestrates| ElevenLabs[ElevenLabs Audio / Voice]
    end

    subgraph Backblaze B2 Cloud Object Storage
        B2StorageService -->|S3 Protocol Boto3| B2Bucket[Backblaze B2 Bucket]
        B2Bucket --> MediaAssets[Generated Media Files .png, .mp4, .mp3]
        B2Bucket --> ProvenanceJSON[Provenance Records & Metadata]
    end
```

---

## 🛠️ Key Architectural Components

### 1. Frontend (React 18 + Vite)
- **State & Theme**: Dynamic light/dark theme switching stored in `localStorage` and managed via `ThemeContext`.
- **API Client**: Centralized Axios client (`services/api.js`) with request interceptors for base URL mapping, timeout handling, and unified error parsing.
- **Routing**: React Router DOM v6 managing navigation between `/` (Home), `/generate` (Studio), `/gallery` (Media Vault), and `/settings` (Configuration).

### 2. Backend (FastAPI + Pydantic v2)
- **Modular Routers**: Seperate endpoints for media generation, object storage, and health telemetry.
- **Data Validation**: Strict Pydantic models ensuring type safety across requests and responses.
- **Structured Logging**: Standardized JSON-capable logging module tracking API requests, task lifetimes, and error tracebacks.

### 3. Generative Orchestration (Genblaze SDK)
- **Unified Multi-Provider Interface**: Encapsulates model interactions across GMI Cloud, OpenAI, Runway, ElevenLabs, and Stability Audio.
- **Async Execution & Polling**: Task-based status monitoring for long-running video and image synthesis pipelines.

### 4. Durable Storage & Provenance (Backblaze B2)
- **S3 API Compatibility**: Utilizes `boto3` to communicate with Backblaze B2 S3 endpoints.
- **Media Asset Persistence**: Uploads generated images, video clips, and audio tracks directly to B2 buckets.
- **Provenance Tracking**: Preserves metadata (prompts, random seeds, provider version, timestamp, author) alongside assets in B2 for complete generation auditability.
