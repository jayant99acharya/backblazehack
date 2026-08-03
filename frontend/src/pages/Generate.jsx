import React, { useState } from 'react'
import PromptForm from '../components/PromptForm'
import MediaCard from '../components/MediaCard'
import Loader from '../components/Loader'
import { generateMedia } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Generate() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [resultMedia, setResultMedia] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleGenerateSubmit = async (payload) => {
    setIsLoading(true)
    setErrorMessage(null)
    setResultMedia(null)

    try {
      // 1. Submit generation request & stream to Backblaze B2 under user_id
      const payloadWithUser = {
        ...payload,
        user_id: user?.user_id || 'default_user',
      }
      const response = await generateMedia(payloadWithUser)

      if (response && response.media_url) {
        setResultMedia({
          file_id: response.task_id,
          file_name: response.b2_file_key ? response.b2_file_key.replace('outputs/', '') : `${payload.provider}_${response.task_id}.png`,
          file_key: response.b2_file_key || `outputs/${response.task_id}.png`,
          media_type: response.media_type || payload.media_type,
          size_bytes: 2451920,
          url: response.media_url,
          provider: response.provider || payload.provider,
          created_at: new Date().toISOString(),
        })
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete media generation task.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div class="space-y-8 py-4">
      {/* Studio Banner Header */}
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>AI Media Studio</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-500 font-semibold border border-red-500/20">
            Genblaze + Backblaze B2 Live
          </span>
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Craft multi-modal AI media with Genblaze orchestration and persist outputs directly to Backblaze B2 S3 storage.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Prompt Builder Form */}
        <div class="lg:col-span-7">
          <PromptForm onSubmit={handleGenerateSubmit} isLoading={isLoading} />
        </div>

        {/* Right Column: Output Preview & Live Feed */}
        <div class="lg:col-span-5 space-y-4">
          <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 min-h-[380px] flex flex-col justify-between">
            <h3 class="font-bold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
              <span>Studio Output Monitor</span>
              {resultMedia && (
                <span class="text-emerald-500 text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 class="w-3.5 h-3.5" /> Stored in Backblaze B2
                </span>
              )}
            </h3>

            {isLoading && (
              <Loader text="Generating AI asset & streaming to Backblaze B2..." />
            )}

            {errorMessage && (
              <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start space-x-2">
                <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!isLoading && !resultMedia && !errorMessage && (
              <div class="my-auto text-center py-12 space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
                  <Sparkles class="w-6 h-6" />
                </div>
                <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ready for Generation
                </p>
                <p class="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Submit your prompt on the left to trigger Genblaze multi-provider workflow.
                </p>
              </div>
            )}

            {resultMedia && !isLoading && (
              <div class="space-y-3">
                <MediaCard item={resultMedia} />
              </div>
            )}

            <div class="text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3 flex items-center justify-between">
              <span>Backblaze B2 S3 API</span>
              <span class="text-red-500 font-medium">satvik-genblaze-ai-media</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
