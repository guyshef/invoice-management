import Link from 'next/link'
import { ArrowRight, Building2, Receipt } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[120px] opacity-70"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full mix-blend-screen filter blur-[120px] opacity-70"></div>

      <div className="relative z-10 max-w-3xl">
        <div className="flex justify-center mb-6">
          <div className="flex -space-x-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-xl z-20">
              <Building2 className="w-8 h-8 text-secondary" />
            </div>
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-xl z-10 transform translate-y-2">
              <Receipt className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Manage your LLCs & <br className="hidden md:block"/>
          <span className="text-primary relative inline-block">
            Invoices Seamlessly
            <span className="absolute bottom-1 left-0 w-full h-3 bg-accent/30 -z-10 rounded-full"></span>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-graytext mb-10 max-w-2xl mx-auto font-medium">
          The premium platform for founders to organize multiple businesses, track expenses securely, and manage files in one beautiful dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white hover:bg-primary/90 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 text-lg shadow-lg shadow-primary/30"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white hover:bg-white/20 border border-white/20 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 text-lg shadow-sm backdrop-blur-md"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
