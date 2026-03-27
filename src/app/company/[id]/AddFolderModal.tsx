'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Folder, Calendar } from 'lucide-react'
import { addFolder } from './actions'

export function AddFolderModal({ companyId, currentYear }: { companyId: string, currentYear: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const openModal = () => {
    setIsPending(false)
    setError('')
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      const result = await addFolder(companyId, formData)

      if (result?.error) {
        setError(result.error)
      } else {
        setIsOpen(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={openModal}
        className="w-full justify-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2.5"
      >
        <Folder className="w-4 h-4" />
        New Folder
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-[2rem] p-8 shadow-2xl z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>

              <div className="flex items-center justify-between mb-8 pt-2">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-navy flex items-center gap-2.5">
                    <Folder className="w-6 h-6 text-primary"/> Add Folder
                  </h3>
                  <p className="text-graytext text-sm font-medium mt-1">Organize your invoices by category</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full text-graytext hover:text-navy transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-graytext ml-1">Folder Name</label>
                  <div className="relative group">
                    <Folder className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      name="name"
                      required
                      autoFocus
                      placeholder="e.g. Tax, Insurance"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-graytext ml-1">Financial Year</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      name="year"
                      type="number"
                      required
                      defaultValue={currentYear}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full justify-center bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 mt-4 transition-all shadow-lg shadow-secondary/20 active:scale-[0.98]"
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
