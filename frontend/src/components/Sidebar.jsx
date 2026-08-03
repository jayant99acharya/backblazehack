import React from 'react'
import { Image, Video, Music, Layers, HardDrive, Filter, Sparkles } from 'lucide-react'

export default function Sidebar({ activeFilter = 'all', onFilterChange = () => {} }) {
  const categories = [
    { id: 'all', label: 'All Assets', icon: Layers, count: '3' },
    { id: 'image', label: 'Images', icon: Image, count: '1' },
    { id: 'video', label: 'Videos', icon: Video, count: '1' },
    { id: 'audio', label: 'Audio & Music', icon: Music, count: '1' },
  ]

  return (
    <aside class="w-full lg:w-64 flex-shrink-0 space-y-6">
      {/* Category Filter Navigation */}
      <div class="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div class="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
          <Filter class="w-4 h-4 text-indigo-500" />
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Media Filter
          </h3>
        </div>

        <nav class="space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isSelected = activeFilter === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange(cat.id)}
                class={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div class="flex items-center space-x-2.5">
                  <Icon class={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </div>
                <span
                  class={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Backblaze B2 Storage Status Badge */}
      <div class="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div class="flex items-center space-x-2">
          <HardDrive class="w-4 h-4 text-red-500" />
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Backblaze B2 Vault
          </h3>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between text-xs font-medium">
            <span class="text-slate-600 dark:text-slate-400">Free Tier Usage</span>
            <span class="text-indigo-600 dark:text-indigo-400">22.8 MB / 10 GB</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-red-500 to-indigo-500 h-full w-[2%]" />
          </div>
        </div>

        <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Assets are durably stored on S3-compatible Backblaze B2 Cloud Object Storage.
        </p>
      </div>
    </aside>
  )
}
