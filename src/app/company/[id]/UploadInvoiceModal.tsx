'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, X, Receipt, DollarSign, Calendar, FileText, Building } from 'lucide-react'
import { uploadInvoice } from './actions'

export function UploadInvoiceModal({ companyId }: { companyId: string }) {
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
    // The file action requires companyId
    const result = await uploadInvoice(companyId, formData)
    
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
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-indigo-400"/> New Invoice
                </h3>
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
                {/* File Upload Area */}
                <div 
                  className="w-full border-2 border-dashed border-neutral-700 hover:border-indigo-500/50 rounded-2xl p-8 flex flex-col items-center justify-center bg-neutral-950/50 cursor-pointer transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    name="file" 
                    accept="image/*,.pdf" 
                    required 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-500/10 transition-colors">
                    <UploadCloud className="w-5 h-5 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  {fileName ? (
                    <span className="text-white font-medium text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400"/> {fileName}
                    </span>
                  ) : (
                    <>
                      <span className="text-white font-medium text-sm mb-1">Click to upload or drag and drop</span>
                      <span className="text-neutral-500 text-xs">PDF, PNG, JPG (max 5MB)</span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-sm font-medium text-neutral-300 ml-1">Vendor / Client Name *</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        name="vendor_name"
                        required
                        placeholder="Google Cloud"
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-300 ml-1">Amount ($) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-300 ml-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        name="date"
                        type="date"
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={isPending}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 mt-4 transition-all active:scale-[0.98]"
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
