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

  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 pointer-events-none"></div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-navy">Dashboard</h1>
            <p className="text-graytext mt-1 font-medium">Manage your companies and invoices</p>
          </div>
          <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-full pl-4 pr-1.5 py-1.5 shadow-sm">
            <span className="text-navy font-medium text-sm hidden sm:block">{user.email}</span>
            <SignOutButton />
          </div>
        </header>

        <main>
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-navy flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Your LLCs
            </h2>
            <AddCompanyModal />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!companies || companies.length === 0 ? (
              <div className="col-span-full border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-white/50">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 border border-slate-200 shadow-sm">
                  <Building2 className="w-8 h-8 text-graytext" />
                </div>
                <h3 className="text-navy font-bold mb-2 text-lg">No companies yet</h3>
                <p className="text-sm text-graytext font-medium max-w-sm">Add an LLC to start managing your associated invoices.</p>
              </div>
            ) : (
              companies.map((company) => (
                <Link 
                  href={`/company/${company.id}`} 
                  key={company.id}
                  className="group bg-white border border-slate-200 hover:border-primary/50 rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-primary/5 block relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 border border-slate-100 text-primary group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-1 tracking-tight">{company.name}</h3>
                  {company.tax_id && (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-graytext border border-slate-200/50">
                      Tax ID: {company.tax_id}
                    </span>
                  )}
                  <div className="mt-6 flex items-center text-primary text-sm font-semibold group-hover:text-secondary transition-colors">
                    Manage Folders & Invoices 
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
