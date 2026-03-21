'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Building2 } from 'lucide-react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-[2rem] p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-5 ring-1 ring-indigo-500/30">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-neutral-400 text-sm text-center">
            {isLogin ? 'Manage your LLCs and invoices intuitively.' : 'Join to start managing your LLCs in seconds.'}
          </p>
        </div>

        <form className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                name="email"
                type="email" 
                required
                placeholder="you@example.com"
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                name="password"
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <button
            formAction={isLogin ? login : signup}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl py-3 mt-6 flex items-center justify-center group transition-all active:scale-[0.98]"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            className="text-neutral-400 hover:text-white text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
