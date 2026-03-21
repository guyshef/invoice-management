'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AddYearModal({ companyId }: { companyId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const year = formData.get('year') as string
    
    if (year && !isNaN(parseInt(year))) {
      router.push(`/company/${companyId}?year=${year}`)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-1"
      >
        <Plus className="w-3.5 h-3.5" /> Add Year
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full sm:w-80 bg-slate-800 border-l border-slate-700 p-6 shadow-2xl flex flex-col gap-6 z-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">View a Different Year</h3>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-400">
                Jump to a specific year to manage categories and invoices.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Target Year
                  </label>
                  <input 
                    name="year"
                    type="number"
                    required
                    placeholder="e.g. 2025"
                    min="1990"
                    max="2100"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Go to Year
                </button>

                <div className="mt-auto p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <p className="text-xs text-blue-300 leading-relaxed">
                    <strong>Note:</strong> Years are saved to the database once they contain at least one folder.
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
