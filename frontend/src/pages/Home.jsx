import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, HardDrive, Cpu, ShieldCheck, ArrowRight, Layers, Zap } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Cpu,
      title: 'Genblaze Multi-Provider Orchestration',
      description:
        'Unified Python SDK interface across GMI Cloud, OpenAI, Runway, ElevenLabs, and Stability Audio models.',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: HardDrive,
      title: 'Durable Backblaze B2 Storage',
      description:
        'S3-compatible object storage designed for generated media assets, thumbnails, logs, and metadata pipelines.',
      color: 'text-red-500 bg-red-500/10 border-red-500/20',
    },
    {
      icon: ShieldCheck,
      title: 'Provenance & Auditability',
      description:
        'Complete tracking of generation prompts, random seeds, provider versions, and media creation lineage.',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Layers,
      title: 'Multimodal Media Workflows',
      description:
        'Supports rich image synthesis, short-form video generation, and voice/audio synthesis in one unified hub.',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div class="space-y-16 py-8">
      
      {/* Hero Section */}
      <section class="relative text-center space-y-6 max-w-4xl mx-auto px-4">
        {/* Glow backdrop decorative light */}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 to-red-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Hackathon Header Badge */}
        <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
          <Sparkles class="w-3.5 h-3.5 text-indigo-500" />
          <span>Backblaze GenAI Media Hackathon Starter Scaffold</span>
        </div>

        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
          Next-Gen AI Media. <br />
          <span class="gradient-text">Generated & Stored on B2.</span>
        </h1>

        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Build generative video, image, audio, and multimodal pipelines using the open-source{' '}
          <strong class="text-indigo-500 font-semibold">Genblaze SDK</strong> and durable cloud storage on{' '}
          <strong class="text-red-500 font-semibold">Backblaze B2</strong>.
        </p>

        {/* Call to Action Buttons */}
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/generate"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Open Studio Workspace</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/gallery"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-center space-x-2"
          >
            <HardDrive class="w-4 h-4 text-red-500" />
            <span>Explore B2 Vault</span>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12 space-y-2">
          <h2 class="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Production-Minded Media Architecture
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Modular components designed for seamless hackathon prototyping and real-world deployment.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon
            return (
              <div
                key={idx}
                class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
              >
                <div class={`w-10 h-10 rounded-xl flex items-center justify-center border ${f.color}`}>
                  <Icon class="w-5 h-5" />
                </div>
                <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100">{f.title}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Tech Stack Stats Summary */}
      <section class="max-w-5xl mx-auto px-4">
        <div class="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div class="space-y-1 text-center md:text-left">
            <h3 class="text-xl font-bold">Ready to Start Building?</h3>
            <p class="text-xs text-slate-300">
              Frontend Vercel ready • Backend Render ready • Dockerized environment
            </p>
          </div>
          <Link
            to="/generate"
            class="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-md"
          >
            Launch Prompt Studio
          </Link>
        </div>
      </section>

    </div>
  )
}
