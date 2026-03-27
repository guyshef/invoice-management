'use client'

import { Suspense } from 'react'
import { updatePassword } from './actions'
import { motion } from 'framer-motion'
import { Lock, Building2, ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function ResetForm() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative bg-slate-50">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(3,33,71,0.1)] relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-navy mb-2 tracking-tight">New Password</h1>
          <p className="text-graytext text-sm text-center font-bold tracking-tight">
            Choose a strong password for your account
          </p>
        </div>

        {message && (
          <div className="mb-6 text-sm text-center font-bold px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-navy">
            {message}
          </div>
        )}

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-graytext ml-1 text-xs">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input
                name="password"
                type="password"
                required
                minLength={6}
                autoFocus
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-graytext ml-1 text-xs">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input
                name="confirm"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            formAction={updatePassword}
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-black rounded-2xl py-4 mt-8 flex items-center justify-center group transition-all active:scale-[0.98] shadow-xl shadow-secondary/20 text-lg"
          >
            Update Password
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}
