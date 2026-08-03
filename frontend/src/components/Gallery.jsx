import React, { useState } from 'react'
import MediaCard from './MediaCard'
import { Search, Sparkles, FolderOpen } from 'lucide-react'

export default function Gallery({ items = [], onDeleteItem = () => {}, onRenameItem = () => {} }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      item.file_name.toLowerCase().includes(query) ||
      (item.media_type && item.media_type.toLowerCase().includes(query)) ||
      (item.provider && item.provider.toLowerCase().includes(query))
    )
  })

  return (
    <div class="space-y-6">
      
      {/* Gallery Search & Quick Control Header */}
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Media Vault</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-semibold border border-indigo-500/20">
              {filteredItems.length} Assets
            </span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Durable Cloud Storage Powered by Backblaze B2 S3 API
          </p>
        </div>

        {/* Search Input */}
        <div class="relative w-full sm:w-64">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets or providers..."
            class="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400"
          />
        </div>
      </div>

      {/* Grid Display */}
      {filteredItems.length > 0 ? (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MediaCard
              key={item.file_id || item.file_key}
              item={item}
              onDelete={onDeleteItem}
              onRename={onRenameItem}
            />
          ))}
        </div>

      ) : (
        <div class="glass-panel p-12 rounded-2xl text-center border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
            <FolderOpen class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-slate-700 dark:text-slate-200">No media assets found</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Generate new media using Genblaze SDK in the Studio workspace to store your first asset on Backblaze B2.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
