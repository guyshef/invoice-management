'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Building, Tag } from 'lucide-react'
import { addCompany } from './actions'

export function AddCompanyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const result = await addCompany(null, formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setIsOpen(false)
    }
    setIsPending(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Company
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold tracking-tight text-white">New Company</h3>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-300 ml-1">Company Name *</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      name="name"
                      required
                      placeholder="Acme Corp LLC"
                      className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-300 ml-1">Tax ID / EIN</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      name="tax_id"
                      placeholder="Optional"
                      className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <button
                  disabled={isPending}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-2.5 mt-2 transition-all active:scale-[0.98]"
                >
                  {isPending ? 'Creating...' : 'Create Company'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
