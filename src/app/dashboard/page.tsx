import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from './SignOutButton'
import { AddCompanyModal } from './AddCompanyModal'
import { Building2, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  // Fetch companies
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">Dashboard</h1>
            <p className="text-neutral-500 mt-1">Manage your companies and invoices</p>
          </div>
          <div className="flex items-center gap-4 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-full pl-4 pr-1.5 py-1.5">
            <span className="text-neutral-400 text-sm hidden sm:block">{user.email}</span>
            <SignOutButton />
          </div>
        </header>

        <main>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Your LLCs
            </h2>
            <AddCompanyModal />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!companies || companies.length === 0 ? (
              <div className="col-span-full border border-dashed border-neutral-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-neutral-900/20">
                <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-5 border border-neutral-800">
                  <Building2 className="w-8 h-8 text-neutral-500" />
                </div>
                <h3 className="text-neutral-300 font-medium mb-2 text-lg">No companies yet</h3>
                <p className="text-sm text-neutral-500 max-w-sm">Add an LLC to start managing your associated invoices.</p>
              </div>
            ) : (
              companies.map((company) => (
                <Link 
                  href={`/company/${company.id}`} 
                  key={company.id}
                  className="group bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-3xl p-6 transition-all hover:shadow-2xl hover:-translate-y-1 block relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 bg-neutral-950 rounded-xl flex items-center justify-center mb-4 border border-neutral-800 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1 tracking-tight">{company.name}</h3>
                  {company.tax_id && (
                    <span className="inline-flex items-center rounded-md bg-neutral-800/50 px-2 py-1 text-xs font-medium text-neutral-400 border border-neutral-700/50">
                      Tax ID: {company.tax_id}
                    </span>
                  )}
                  <div className="mt-6 flex items-center text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors">
                    Manage Invoices 
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
