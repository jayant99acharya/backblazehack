import React from 'react'
import { HardDrive, Cpu, Key, Shield, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function Settings() {
  const envConfigs = [
    {
      key: 'B2_KEY_ID',
      status: 'Configured',
      description: 'Backblaze B2 Application Key ID',
      service: 'Backblaze Storage',
    },
    {
      key: 'B2_APPLICATION_KEY',
      status: 'Configured',
      description: 'Backblaze B2 Application Secret Key',
      service: 'Backblaze Storage',
    },
    {
      key: 'B2_BUCKET_NAME',
      status: 'genmedia-assets',
      description: 'Default target object bucket',
      service: 'Backblaze Storage',
    },
    {
      key: 'GENBLAZE_API_KEY',
      status: 'Mock / TODO',
      description: 'Genblaze SDK Multi-provider API Key',
      service: 'Genblaze SDK',
    },
    {
      key: 'OPENAI_API_KEY',
      status: 'Optional',
      description: 'OpenAI DALL-E / Sora model key',
      service: 'AI Provider',
    },
  ]

  return (
    <div class="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Project Settings & Environment</span>
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Manage API integration status for Backblaze B2 Cloud Storage and Genblaze AI SDK providers.
        </p>
      </div>

      {/* Configuration Status Card */}
      <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div class="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div class="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Key class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-bold text-base text-slate-800 dark:text-slate-200">
              Environment Credentials (.env)
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              These parameters are automatically loaded by <code class="text-indigo-400">backend/app/core/config.py</code>.
            </p>
          </div>
        </div>

        {/* Credentials Table */}
        <div class="divide-y divide-slate-200 dark:divide-slate-800">
          {envConfigs.map((item, idx) => (
            <div key={idx} class="py-3.5 flex items-center justify-between">
              <div class="space-y-0.5">
                <div class="flex items-center space-x-2">
                  <span class="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {item.key}
                  </span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {item.service}
                  </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>

              <div class="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Genblaze & Backblaze Integration Blueprint */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div class="flex items-center space-x-2 text-red-500">
            <HardDrive class="w-5 h-5" />
            <h4 class="font-bold text-slate-800 dark:text-slate-200">Backblaze B2 Cloud Storage</h4>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Integrates via AWS S3-compatible Boto3 client located in <code class="text-indigo-400">backend/app/services/b2_service.py</code>.
          </p>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div class="flex items-center space-x-2 text-indigo-500">
            <Cpu class="w-5 h-5" />
            <h4 class="font-bold text-slate-800 dark:text-slate-200">Genblaze SDK Orchestrator</h4>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Integrates via Python SDK wrapper in <code class="text-indigo-400">backend/app/services/genblaze_service.py</code>.
          </p>
        </div>

      </div>
    </div>
  )
}
