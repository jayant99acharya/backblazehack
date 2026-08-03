import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.DEV ? 'http://localhost:8000' : '')

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.detail || error.message || 'An unexpected API error occurred.',
      status: error.response?.status,
    }
    return Promise.reject(customError)
  }
)

/**
 * Registers a new user account.
 */
export const registerUser = async (email, password, fullName) => {
  return apiClient.post('/auth/register', {
    email,
    password,
    full_name: fullName,
  })
}

/**
 * Log in existing user.
 */
export const loginUser = async (email, password) => {
  return apiClient.post('/auth/login', {
    email,
    password,
  })
}

/**
 * Checks system telemetry and dependency connectivity.
 */
export const checkHealth = async () => {
  return apiClient.get('/health')
}

/**
 * Initiates an AI media generation request via Genblaze SDK orchestrator.
 */
export const generateMedia = async (generationPayload) => {
  return apiClient.post('/generate', generationPayload)
}

/**
 * Polls the status of an ongoing generation task.
 */
export const getTaskStatus = async (taskId) => {
  return apiClient.get(`/generate/status/${taskId}`)
}

/**
 * Fetches available AI providers and model options.
 */
export const listProviders = async () => {
  return apiClient.get('/generate/providers')
}

/**
 * Fetches stored media assets from Backblaze B2 bucket, optionally filtered by userId.
 */
export const fetchMediaGallery = async (userId = null) => {
  const url = userId ? `/storage/files?user_id=${encodeURIComponent(userId)}` : '/storage/files'
  return apiClient.get(url)
}

/**
 * Direct file upload to Backblaze B2 storage bucket.
 */
export const uploadToStorage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient.post('/storage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * Renames an asset in Backblaze B2.
 */
export const renameStorageFile = async (oldFileKey, newFileName) => {
  return apiClient.post('/storage/rename', {
    old_file_key: oldFileKey,
    new_file_name: newFileName,
  })
}

/**
 * Deletes a file asset from Backblaze B2.
 */
export const deleteFromStorage = async (fileKey) => {
  return apiClient.delete(`/storage/files/${encodeURIComponent(fileKey)}`)
}

export default apiClient
