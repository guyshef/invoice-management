'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { addYear } from './actions'

export function AddYearModal({ companyId }: { companyId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const year = formData.get('year') as string

    if (year && !isNaN(parseInt(year))) {
      await addYear(companyId, parseInt(year))
      router.push(`/company/${companyId}?year=${year}`)
      setIsOpen(false)
    }
  }

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-primary hover:bg-primary/5 transition-all flex items-center gap-1.5 border border-slate-200 shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" /> Add Year
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            />
            
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l border-slate-200 p-8 shadow-2xl flex flex-col gap-8 z-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-navy tracking-tight">Financial Year</h3>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full text-graytext hover:text-navy transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-graytext leading-relaxed">
                  Jump to a specific year to manage categories and invoices. 
                </p>
                <div className="h-1 w-12 bg-accent rounded-full"></div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-graytext ml-1">
                    Target Year
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      name="year"
                      type="number"
                      required
                      placeholder="e.g. 2025"
                      min="1990"
                      max="2100"
                      autoFocus
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <button
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-secondary/20 active:scale-[0.98]"
                >
                  Go to Year
                </button>

                <div className="mt-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-xs text-graytext leading-relaxed font-medium">
                    <strong className="text-navy">Note:</strong> Years are automatically indexed once they contain at least one folder. Navigating to a new year allows you to start creating its folder structure.
                  </p>
                </div>
              </form>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
