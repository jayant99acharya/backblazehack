import React from 'react'
import { Sparkles } from 'lucide-react'

export default function Loader({ text = 'Orchestrating Generative AI Pipeline...' }) {
  return (
    <div class="flex flex-col items-center justify-center p-12 space-y-4">
      <div class="relative flex items-center justify-center">
        <div class="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
        <div class="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 animate-pulse flex items-center justify-center shadow-glow-indigo">
          <Sparkles class="w-5 h-5 text-white animate-bounce" />
        </div>
      </div>
      <div class="text-center space-y-1">
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">{text}</p>
        <p class="text-xs text-slate-400">Connecting to Backblaze B2 S3 storage</p>
      </div>
    </div>
  )
}
