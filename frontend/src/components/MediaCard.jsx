import React, { useState } from 'react'
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Music as MusicIcon,
  HardDrive,
  Info,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  X,
} from 'lucide-react'
import { formatBytes, formatDate } from '../utils/formatters'
import { renameStorageFile } from '../services/api'

export default function MediaCard({ item, onDelete = () => {}, onRename = () => {} }) {
  const [showMetadata, setShowMetadata] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Asset renaming states
  const [isEditing, setIsEditing] = useState(false)
  const [fileName, setFileName] = useState(item.file_name)
  const [isRenaming, setIsRenaming] = useState(false)

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video':
        return <VideoIcon class="w-4 h-4 text-purple-400" />
      case 'audio':
        return <MusicIcon class="w-4 h-4 text-emerald-400" />
      default:
        return <ImageIcon class="w-4 h-4 text-indigo-400" />
    }
  }

  const handleSaveRename = async () => {
    if (!fileName.trim() || fileName === item.file_name) {
      setIsEditing(false)
      return
    }

    setIsRenaming(true)
    try {
      await renameStorageFile(item.file_key, fileName.trim())
      setIsEditing(false)
      onRename(item.file_key, fileName.trim())
    } catch (err) {
      alert(`Failed to rename asset on Backblaze B2: ${err.message}`)
      setFileName(item.file_name)
      setIsEditing(false)
    } finally {
      setIsRenaming(false)
    }
  }

  return (
    <div class="group glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl">
      
      {/* Media Preview Box */}
      <div class="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
        {item.media_type === 'image' && !imgError && (
          <img
            src={item.url || item.thumbnail_url}
            alt={item.file_name}
            onError={() => setImgError(true)}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {(item.media_type === 'image' && imgError) && (
          <div class="w-full h-full p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-center text-white space-y-2">
            <div class="p-3 rounded-full bg-indigo-500/20 text-indigo-400 animate-pulse">
              <ImageIcon class="w-8 h-8" />
            </div>
            <p class="font-bold text-xs text-indigo-200 truncate max-w-[200px]">{fileName}</p>
            <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-indigo-300">B2 Cloud Storage Asset</span>
          </div>
        )}

        {item.media_type === 'video' && (
          <video
            src={item.url}
            poster={item.thumbnail_url}
            controls
            class="w-full h-full object-cover"
          />
        )}

        {item.media_type === 'audio' && (
          <div class="w-full h-full p-4 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3">
            <div class="p-3 rounded-full bg-emerald-500/20 text-emerald-400 animate-pulse">
              <MusicIcon class="w-8 h-8" />
            </div>
            <audio src={item.url} controls class="w-full h-8 max-w-[220px]" />
          </div>
        )}

        {/* Media Type & Provider Overlay Badges */}
        <div class="absolute top-3 left-3 flex items-center space-x-2">
          <span class="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center space-x-1.5 border border-white/10">
            {getMediaIcon(item.media_type)}
            <span class="capitalize">{item.media_type}</span>
          </span>
          <span class="px-2.5 py-1 rounded-lg bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center space-x-1 uppercase tracking-wider shadow-sm">
            <HardDrive class="w-3 h-3" />
            <span>B2 Stored</span>
          </span>
        </div>

        {/* Action Controls Overlay */}
        <div class="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            title="Inspect Provenance Metadata"
            class="p-2 rounded-lg bg-slate-900/80 backdrop-blur-md text-white hover:bg-indigo-600 transition-colors"
          >
            <Info class="w-4 h-4" />
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open B2 Public URL"
            class="p-2 rounded-lg bg-slate-900/80 backdrop-blur-md text-white hover:bg-indigo-600 transition-colors"
          >
            <ExternalLink class="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Media Details Footer & Asset Renaming */}
      <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {isEditing ? (
            <div class="flex items-center space-x-1.5">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                class="w-full px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100 border border-indigo-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveRename}
                disabled={isRenaming}
                class="p-1 text-emerald-500 hover:text-emerald-400"
                title="Save Name"
              >
                <Check class="w-4 h-4" />
              </button>
              <button
                onClick={() => { setFileName(item.file_name); setIsEditing(false); }}
                class="p-1 text-slate-400 hover:text-slate-200"
                title="Cancel"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div class="flex items-center justify-between group/title">
              <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100 truncate flex-1" title={fileName}>
                {fileName}
              </h4>
              <button
                onClick={() => setIsEditing(true)}
                class="opacity-0 group-hover/title:opacity-100 text-slate-400 hover:text-indigo-500 transition-opacity ml-1.5"
                title="Rename File on B2"
              >
                <Edit2 class="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div class="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Provider: <strong class="text-indigo-500">{item.provider || 'GMI Cloud'}</strong></span>
            <span>{formatBytes(item.size_bytes)}</span>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{formatDate(item.created_at)}</span>
          <button
            onClick={() => onDelete(item.file_key || item.file_id)}
            class="text-red-400 hover:text-red-600 transition-colors"
            title="Delete from B2"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Provenance Metadata Modal Drawer */}
      {showMetadata && (
        <div class="p-4 bg-slate-900 text-slate-100 text-xs border-t border-slate-800 space-y-2">
          <div class="flex justify-between items-center font-bold border-b border-slate-800 pb-1 text-indigo-400">
            <span>Provenance & Pipeline Details</span>
            <button onClick={() => setShowMetadata(false)} class="text-slate-400 hover:text-white">✕</button>
          </div>
          <p><strong>B2 Key:</strong> {item.file_key}</p>
          <p><strong>Bucket:</strong> satvik-genblaze-ai-media</p>
          <p><strong>AI Provider:</strong> {item.provider || 'GMI Cloud'}</p>
          <p><strong>Created:</strong> {formatDate(item.created_at)}</p>
        </div>
      )}

    </div>
  )
}
