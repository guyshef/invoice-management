'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, X, Receipt, DollarSign, Calendar, FileText, Building } from 'lucide-react'
import { uploadInvoice } from './actions'

export function UploadInvoiceModal({ companyId, folderId }: { companyId: string, folderId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const result = await uploadInvoice(companyId, folderId, formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setIsOpen(false)
      setFileName('')
    }
    setIsPending(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-b from-secondary/90 to-secondary hover:from-secondary hover:to-secondary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 ring-1 ring-secondary/50"
      >
        <UploadCloud className="w-4 h-4" />
        Upload Invoice
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
              className="relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>

              <div className="flex items-center justify-between mb-6 pt-2">
                <h3 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary"/> New Invoice
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
                <div 
                  className="w-full border border-dashed border-slate-600 hover:border-primary/50 relative rounded-xl p-8 flex flex-col items-center justify-center bg-slate-900/30 cursor-pointer overflow-hidden transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

                  <input 
                    ref={fileInputRef}
                    type="file" 
                    name="file" 
                    accept="image/*,.pdf" 
                    required 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mb-3 border border-slate-700 group-hover:bg-primary/20 transition-colors shadow-sm">
                    <UploadCloud className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  {fileName ? (
                    <span className="text-white font-medium text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary"/> {fileName}
                    </span>
                  ) : (
                    <>
                      <span className="text-white font-medium text-sm mb-1">Click to upload or drag and drop</span>
                      <span className="text-slate-500 text-xs font-medium">PDF, PNG, JPG (max 5MB)</span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-medium text-slate-300">Vendor / Client Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        name="vendor_name"
                        required
                        placeholder="Google Cloud"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Amount ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        name="date"
                        type="date"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={isPending}
                  className="w-full justify-center bg-gradient-to-b from-secondary/90 to-secondary hover:from-secondary hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md py-2 mt-4 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1)] ring-1 ring-secondary/50 text-sm"
                >
                  {isPending ? 'Uploading...' : 'Save Invoice'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
