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
        className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-md shadow-secondary/20"
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
              className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[2rem] p-6 shadow-2xl z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>

              <div className="flex items-center justify-between mb-6 pt-2">
                <h3 className="text-xl font-extrabold tracking-tight text-navy flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary"/> New Invoice
                </h3>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-graytext hover:text-navy transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div 
                  className="w-full border-2 border-dashed border-slate-300 hover:border-primary/50 relative rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 cursor-pointer transition-colors group"
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
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 border border-slate-200 group-hover:bg-primary/5 transition-colors shadow-sm">
                    <UploadCloud className="w-5 h-5 text-graytext group-hover:text-primary transition-colors" />
                  </div>
                  {fileName ? (
                    <span className="text-navy font-bold text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary"/> {fileName}
                    </span>
                  ) : (
                    <>
                      <span className="text-navy font-bold text-sm mb-1">Click to upload or drag and drop</span>
                      <span className="text-graytext text-xs font-semibold">PDF, PNG, JPG (max 5MB)</span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-sm font-bold text-navy ml-1">Vendor / Client Name *</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                        name="vendor_name"
                        required
                        placeholder="Google Cloud"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-navy ml-1">Amount ($) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-graytext" />
                      <input 
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-navy ml-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-graytext" />
                      <input 
                        name="date"
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={isPending}
                  className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 mt-4 transition-all active:scale-[0.98] shadow-lg shadow-secondary/20"
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
