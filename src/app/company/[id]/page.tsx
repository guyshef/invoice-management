import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UploadInvoiceModal } from './UploadInvoiceModal'
import { ArrowLeft, Building2, Receipt, FileText, Calendar, DollarSign, ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch company details
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (companyError || !company) {
    redirect('/dashboard')
  }

  // Fetch invoices for this company
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('company_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12 relative flex flex-col items-center">
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none"></div>

      <div className="max-w-6xl w-full relative z-10">
        <header className="mb-10">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm font-medium text-neutral-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{company.name}</h1>
                <div className="mt-1 text-sm text-neutral-500 font-medium">
                  {company.tax_id ? `Tax ID: ${company.tax_id}` : 'No Tax ID provided'}
                </div>
              </div>
            </div>
            
            <UploadInvoiceModal companyId={company.id} />
          </div>
        </header>

        <main>
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-semibold text-white">Invoices</h2>
            <span className="ml-2 bg-neutral-900 text-neutral-400 py-0.5 px-2.5 rounded-full text-xs font-semibold border border-neutral-800">
              {invoices?.length || 0}
            </span>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400 text-sm">
                    <th className="py-4 px-6 font-medium">Vendor</th>
                    <th className="py-4 px-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium text-right">Amount</th>
                    <th className="py-4 px-6 font-medium text-center">Attachment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {!invoices || invoices.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-neutral-500">
                          <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex flex-col items-center justify-center mb-4 border border-neutral-800">
                            <FileText className="w-6 h-6 text-neutral-600" />
                          </div>
                          <p className="font-medium text-neutral-300">No invoices uploaded yet</p>
                          <p className="text-sm mt-1 max-w-sm mx-auto">Upload your first invoice to trace expenses for this LLC.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-neutral-800/30 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-neutral-200">
                            {invoice.vendor_name}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-neutral-400">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-neutral-500" />
                            {new Date(invoice.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center font-medium font-mono text-indigo-300 justify-end">
                            <DollarSign className="w-4 h-4 text-indigo-500" />
                            {Number(invoice.amount).toFixed(2)}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <a 
                            href={invoice.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg transition-colors border border-purple-500/20"
                          >
                            View File
                            <ExternalLink className="w-4 h-4 ml-1.5 opacity-70" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
