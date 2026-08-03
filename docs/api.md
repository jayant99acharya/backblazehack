# 📡 GenMedia App - REST API Specification

> **Base URL**: `http://localhost:8000/api/v1`

---

## 🟢 1. Health & System Telemetry

### `GET /health`
Returns system status, service responsiveness, and dependency health checks (Backblaze B2, Genblaze SDK).

**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-08-03T12:00:00Z",
  "services": {
    "backblaze_b2": "configured",
    "genblaze_sdk": "ready"
  }
}
```

---

## 🎨 2. Generation Endpoints (`/generate`)

### `POST /generate`
Submits a prompt to generate media via Genblaze SDK multi-provider pipelines.

**Request Body (`GenerationRequest`):**
```json
{
  "prompt": "A futuristic glowing cybernetic city at twilight with flying vehicles, octane render 8k",
  "media_type": "image",
  "provider": "gmi_cloud",
  "model": "flux-1-schnell",
  "aspect_ratio": "16:9",
  "quality": "high",
  "negative_prompt": "blurry, low quality, distorted"
}
```

**Response (202 Accepted):**
```json
{
  "task_id": "gen_task_8f93a12b",
  "status": "processing",
  "media_type": "image",
  "provider": "gmi_cloud",
  "model": "flux-1-schnell",
  "prompt": "A futuristic glowing cybernetic city at twilight...",
  "created_at": "2026-08-03T12:05:00Z",
  "estimated_time_seconds": 5
}
```

### `GET /generate/status/{task_id}`
Checks status of a media generation task.

**Response (200 OK):**
```json
{
  "task_id": "gen_task_8f93a12b",
  "status": "completed",
  "media_url": "https://f004.backblazeb2.com/file/genmedia-bucket/outputs/gen_task_8f93a12b.png",
  "b2_file_key": "outputs/gen_task_8f93a12b.png",
  "media_type": "image",
  "provider": "gmi_cloud",
  "completed_at": "2026-08-03T12:05:06Z"
}
```

### `GET /generate/providers`
Returns list of supported AI providers and models.

**Response (200 OK):**
```json
{
  "providers": [
    {
      "id": "gmi_cloud",
      "name": "GMI Cloud",
      "supported_types": ["image", "video", "multimodal"],
      "default_model": "flux-1-schnell"
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "supported_types": ["image"],
      "default_model": "dall-e-3"
    },
    {
      "id": "elevenlabs",
      "name": "ElevenLabs",
      "supported_types": ["audio"],
      "default_model": "eleven_multilingual_v2"
    }
  ]
}
```

---

## 📦 3. Storage Endpoints (`/storage`)

### `GET /storage/files`
Lists stored media assets in the Backblaze B2 bucket.

**Response (200 OK):**
```json
{
  "files": [
    {
      "file_id": "file_991823",
      "file_name": "outputs/gen_task_8f93a12b.png",
      "media_type": "image",
      "size_bytes": 2451920,
      "url": "https://f004.backblazeb2.com/file/genmedia-bucket/outputs/gen_task_8f93a12b.png",
      "created_at": "2026-08-03T12:05:06Z",
      "provider": "gmi_cloud"
    }
  ],
  "total_count": 1,
  "bucket_name": "genmedia-bucket"
}
```

### `POST /storage/upload`
Direct upload endpoint to store media assets in Backblaze B2.

**Request:** `multipart/form-data` with `file` field.

**Response (201 Created):**
```json
{
  "file_id": "file_991824",
  "file_name": "user_uploads/my_input.png",
  "url": "https://f004.backblazeb2.com/file/genmedia-bucket/user_uploads/my_input.png",
  "size_bytes": 1048576,
  "uploaded_at": "2026-08-03T12:10:00Z"
}
```

### `DELETE /storage/files/{file_id}`
Deletes an asset from the B2 bucket.

**Response (200 OK):**
```json
{
  "message": "File file_991824 deleted successfully from Backblaze B2."
}
```
