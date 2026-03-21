'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Folder, Calendar } from 'lucide-react'
import { addFolder } from './actions'

export function AddFolderModal({ companyId, currentYear }: { companyId: string, currentYear: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const result = await addFolder(companyId, formData)
    
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
        className="w-full justify-center bg-gradient-to-b from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex items-center gap-2 ring-1 ring-primary/50"
      >
        <Folder className="w-4 h-4" />
        New Folder
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>

              <div className="flex items-center justify-between mb-6 pt-2">
                <h3 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                  <Folder className="w-4 h-4 text-primary"/> Add Folder
                </h3>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="mb-4 text-sm text-red-300 bg-red-500/10 p-3 rounded-md border border-red-500/20 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Folder Name</label>
                  <div className="relative">
                    <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="name"
                      required
                      placeholder="e.g. Tax, Insurance"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="year"
                      type="number"
                      required
                      defaultValue={currentYear}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  disabled={isPending}
                  className="w-full justify-center bg-gradient-to-b from-secondary/90 to-secondary hover:from-secondary hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md py-2 mt-4 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1)] ring-1 ring-secondary/50 text-sm"
                >
                  {isPending ? 'Creating...' : 'Create Folder'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
