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
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-md shadow-primary/20"
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
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(3,33,71,0.15)] z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

              <div className="flex items-center justify-between mb-8 pt-4">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-navy">New Company</h3>
                  <p className="text-graytext text-sm font-medium mt-1">Register a new LLC to manage</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 hover:bg-slate-50 rounded-full text-graytext hover:text-navy transition-colors shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-graytext ml-1">Company Name <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      name="name"
                      required
                      autoFocus
                      placeholder="Acme Corp LLC"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-graytext ml-1">Tax ID / EIN</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      name="tax_id"
                      placeholder="Optional"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                <button
                  disabled={isPending}
                  className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 mt-6 transition-all active:scale-[0.98] shadow-xl shadow-secondary/20 rounded-2xl inline-flex items-center justify-center gap-2"
                >
                  {isPending ? 'Establishing...' : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Company
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
