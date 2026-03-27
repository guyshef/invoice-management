import Link from 'next/link'
import { ArrowRight, Building2, Receipt } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-center bg-slate-50">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-30"></div>

      <div className="relative z-10 max-w-4xl">
        <div className="flex justify-center mb-8">
          <div className="flex -space-x-4">
            <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center shadow-2xl z-20 transform -rotate-6">
              <Building2 className="w-10 h-10 text-secondary" />
            </div>
            <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center shadow-2xl z-10 transform translate-y-4 rotate-6">
              <Receipt className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-navy mb-8 tracking-tighter leading-[0.9]">
          LLC Invoice <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary relative inline-block">
            Management
            <span className="absolute -bottom-2 left-0 w-full h-4 bg-accent/20 -z-10 rounded-full blur-sm"></span>
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-graytext mb-12 max-w-2xl mx-auto font-bold tracking-tight">
          The elite platform for modern founders to orchestrate multiple businesses and track expenses with surgical precision.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-10 py-5 bg-navy text-white hover:bg-navy/90 font-black rounded-[2rem] transition-all flex items-center justify-center gap-3 active:scale-95 text-xl shadow-2xl shadow-navy/20"
          >
            Get Started <ArrowRight className="w-6 h-6" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-10 py-5 bg-white text-navy hover:bg-slate-50 border-2 border-slate-200 font-extrabold rounded-[2rem] transition-all flex items-center justify-center gap-3 active:scale-95 text-xl shadow-lg shadow-black/5"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-20 pt-10 border-t border-slate-200/50 flex flex-wrap justify-center gap-12 grayscale opacity-40">
           <div className="flex items-center gap-2 font-black text-navy/40">
              <Building2 className="w-5 h-5" />
              MULTI-CORP
           </div>
           <div className="flex items-center gap-2 font-black text-navy/40">
              <Receipt className="w-5 h-5" />
              INVOICE-AI
           </div>
           <div className="flex items-center gap-2 font-black text-navy/40">
              <div className="w-5 h-5 bg-navy/40 rounded-sm"></div>
              SECURE-VAULT
           </div>
        </div>
      </div>
    </div>
  )
}
