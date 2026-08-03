import React, { useState } from 'react'
import { Sparkles, Wand2, Image, Video, Music, Layers, Cpu, Compass } from 'lucide-react'

export default function PromptForm({ onSubmit = () => {}, isLoading = false }) {
  const [prompt, setPrompt] = useState('')
  const [mediaType, setMediaType] = useState('image')
  const [provider, setProvider] = useState('gmi_cloud')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [negativePrompt, setNegativePrompt] = useState('')

  const mediaTypes = [
    { id: 'image', label: 'Image', icon: Image },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'multimodal', label: 'Multimodal', icon: Layers },
  ]

  const providers = [
    { id: 'gmi_cloud', name: 'GMI Cloud (Open Source)' },
    { id: 'openai', name: 'OpenAI (DALL-E 3)' },
    { id: 'runway', name: 'Runway (Gen-2 / Gen-3)' },
    { id: 'elevenlabs', name: 'ElevenLabs (Voice / Audio)' },
  ]

  const samplePrompts = [
    'A cinematic futuristic cyberpunk city at twilight with glowing neon billboards and flying vehicles, Octane render 8k',
    'Soothing lo-fi ambient background music with gentle rain sounds and warm synth pads',
    'A majestic eagle soaring over snow-capped mountain peaks during golden hour sunrise, hyper-realistic',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    onSubmit({
      prompt: prompt.trim(),
      media_type: mediaType,
      provider: provider,
      aspect_ratio: aspectRatio,
      negative_prompt: negativePrompt.trim() || undefined,
    })
  }

  return (
    <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center space-x-2">
          <div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Wand2 class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-800 dark:text-slate-100">
              Generative Media Studio
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Orchestrated by Genblaze SDK • Saved to Backblaze B2
            </p>
          </div>
        </div>

        {/* Media Type Selector Tabs */}
        <div class="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {mediaTypes.map((type) => {
            const Icon = type.icon
            const isSelected = mediaType === type.id
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setMediaType(type.id)}
                class={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon class="w-3.5 h-3.5" />
                <span>{type.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} class="space-y-4">
        {/* Main Prompt Textarea */}
        <div class="space-y-1.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Generation Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the media asset you want to generate in rich detail..."
            rows={3}
            required
            class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          />
        </div>

        {/* Preset Sample Prompts */}
        <div class="flex items-start space-x-2">
          <Compass class="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div class="flex flex-wrap gap-1.5">
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(sample)}
                class="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors border border-slate-200/60 dark:border-slate-800"
              >
                "{sample.slice(0, 32)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Provider & Parameter Options */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          {/* AI Provider */}
          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
              <Cpu class="w-3.5 h-3.5 text-purple-500" />
              <span>AI Provider (Genblaze SDK)</span>
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              class="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio */}
          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              class="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="16:9">16:9 Landscape</option>
              <option value="1:1">1:1 Square</option>
              <option value="9:16">9:16 Portrait / Story</option>
              <option value="4:3">4:3 Standard</option>
            </select>
          </div>

        </div>

        {/* Submit Action Button */}
        <div class="pt-3">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Orchestrating via Genblaze...</span>
              </>
            ) : (
              <>
                <Sparkles class="w-4 h-4" />
                <span>Generate & Store to Backblaze B2</span>
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  )
}
