import React from 'react'
import { Database, Cpu, ExternalLink, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer class="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Hackathon Attribution */}
        <div class="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Built for the</span>
          <strong class="text-slate-800 dark:text-slate-200 font-bold">Backblaze GenAI Media Hackathon</strong>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span class="flex items-center gap-1">
            Powered by <Database class="w-3.5 h-3.5 text-red-500 inline" /> Backblaze B2 & <Cpu class="w-3.5 h-3.5 text-indigo-500 inline" /> Genblaze SDK
          </span>
        </div>

        {/* Resources & Links */}
        <div class="flex items-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
          <a
            href="https://github.com/b2genblaze"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-indigo-500 transition-colors flex items-center space-x-1"
          >
            <span>Genblaze GitHub</span>
            <ExternalLink class="w-3 h-3" />
          </a>
          <a
            href="https://www.backblaze.com/b2/cloud-storage.html"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-red-500 transition-colors flex items-center space-x-1"
          >
            <span>Backblaze B2 Docs</span>
            <ExternalLink class="w-3 h-3" />
          </a>
        </div>

      </div>
    </footer>
  )
}
