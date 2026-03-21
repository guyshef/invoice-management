import Link from 'next/link'
import { ArrowRight, Building2, Receipt } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-70"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-70"></div>

      <div className="relative z-10 max-w-3xl">
        <div className="flex justify-center mb-6">
          <div className="flex -space-x-4">
            <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center shadow-xl z-20">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center shadow-xl z-10 transform translate-y-2">
              <Receipt className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Manage your LLCs & <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Invoices Seamlessly</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto font-medium">
          The premium platform for founders to organize multiple businesses, track expenses securely, and manage files in one beautiful dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-neutral-200 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 text-lg"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-800 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 text-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
