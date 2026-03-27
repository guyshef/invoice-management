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
      <motion.button 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(true)}
        className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-secondary/10 flex items-center justify-center gap-2.5"
      >
        <UploadCloud className="w-4 h-4" />
        Upload Invoice
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
              className="relative w-full max-w-xl bg-white border border-slate-200 rounded-[2rem] p-8 shadow-2xl z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>

              <div className="flex items-center justify-between mb-8 pt-2">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-navy flex items-center gap-2.5">
                    <Receipt className="w-6 h-6 text-primary"/> New Invoice
                  </h3>
                  <p className="text-graytext text-sm font-medium mt-1">Upload and record your business expenses</p>
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
                <div 
                  className="w-full border-2 border-dashed border-slate-200 hover:border-primary/50 relative rounded-3xl p-10 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer overflow-hidden transition-all group"
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
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 border border-slate-100 group-hover:bg-primary/10 transition-colors shadow-sm">
                    <UploadCloud className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                  {fileName ? (
                    <span className="text-navy font-bold text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary"/> {fileName}
                    </span>
                  ) : (
                    <>
                      <span className="text-navy font-bold text-sm mb-1 group-hover:text-primary transition-colors">Click to upload or drag and drop</span>
                      <span className="text-graytext text-xs font-bold uppercase tracking-widest">PDF, PNG, JPG (max 5MB)</span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-graytext ml-1">Vendor / Client Name</label>
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input 
                        name="vendor_name"
                        required
                        placeholder="e.g. Google Cloud, AWS"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-graytext ml-1">Amount</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input 
                        name="amount"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-graytext ml-1">Billing Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input 
                        name="date"
                        type="date"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-navy font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={isPending}
                  className="w-full justify-center bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 mt-6 transition-all shadow-lg shadow-secondary/20 active:scale-[0.98]"
                >
                  {isPending ? 'Processing...' : 'Save Invoice'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
