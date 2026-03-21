import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UploadInvoiceModal } from './UploadInvoiceModal'
import { AddFolderModal } from './AddFolderModal'
import { AddYearModal } from './AddYearModal'
import { FolderActions } from './FolderActions'
import { Building2, Receipt, Folder, ExternalLink, Calendar, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CompanyPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ year?: string, folder?: string }>
}) {
  const { id } = await params
  const resolvedParams = await searchParams
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch company details
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (companyError || !company) redirect('/dashboard')

  // Fetch folders for this company
  const { data: folders } = await supabase
    .from('folders')
    .select('*')
    .eq('company_id', id)
    .order('year', { ascending: false })

  // Determine unique years
  const availableYears = Array.from(new Set((folders || []).map(f => f.year))).sort((a, b) => b - a)
  
  const currentYear = new Date().getFullYear()
  
  // ALWAYS guarantee the current year exists as a baseline option
  if (!availableYears.includes(currentYear)) {
    availableYears.push(currentYear)
  }

  let activeYear = resolvedParams.year ? parseInt(resolvedParams.year) : (availableYears[0] || currentYear)
  
  if (!availableYears.includes(activeYear)) {
    availableYears.push(activeYear)
  }
  
  availableYears.sort((a, b) => b - a)

  const activeFolderId = resolvedParams.folder

  // Folders for the active year
  const yearFolders = (folders || []).filter(f => f.year === activeYear)
  const activeFolder = yearFolders.find(f => f.id === activeFolderId)

  // Fetch invoices if a folder is selected
  let invoices: any[] = []
  if (activeFolderId) {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('folder_id', activeFolderId)
      .order('created_at', { ascending: false })
    invoices = data || []
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4">
          <nav className="flex items-center text-sm font-medium text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
            <span className="text-white font-semibold">{company.name}</span>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
            <span className="text-slate-300">{activeYear}</span>
            {activeFolder && (
              <>
                <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
                <span className="text-white bg-slate-800 px-2 py-0.5 rounded-sm">{activeFolder.name}</span>
              </>
            )}
          </nav>

          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{company.name}</h1>
              {company.tax_id && (
                <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  Tax ID: {company.tax_id}
                </span>
              )}
            </div>
          </header>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* LEFT SIDEBAR */}
          <aside className="w-full md:w-[280px] shrink-0 flex flex-col gap-6">
            
            {/* SEGMENTED CONTROL: Filter by Year */}
            <div className="bg-slate-800/40 rounded-2xl p-5 shadow-lg border border-slate-700/50">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Filter by Year
              </h3>
              <div className="flex flex-wrap items-center bg-slate-900/50 p-1.5 rounded-xl shadow-inner gap-2">
                {availableYears.map(y => (
                  <Link 
                    key={y}
                    href={`/company/${id}?year=${y}`}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      y === activeYear 
                        ? 'bg-primary text-white shadow-md ring-1 ring-primary/50' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {y}
                  </Link>
                ))}
                <div className="pl-1 border-l border-slate-700/50">
                  <AddYearModal companyId={company.id} />
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-slate-800/40 rounded-2xl p-5 shadow-lg flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Folders ({activeYear})
                </h3>
              </div>
              
              <div className="flex flex-col gap-1 relative">
                {yearFolders.length === 0 ? (
                  <div className="text-sm text-slate-400 font-medium p-4 rounded-xl bg-slate-900/20 text-center">
                    No folders exist for {activeYear}.
                  </div>
                ) : (
                  yearFolders.map(f => (
                    <Link
                      key={f.id}
                      href={`/company/${id}?year=${activeYear}&folder=${f.id}`}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                        f.id === activeFolderId 
                          ? 'bg-primary/20 text-primary' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Folder className={`w-4 h-4 ${f.id === activeFolderId ? 'text-primary' : 'text-slate-500'}`} />
                      {f.name}
                    </Link>
                  ))
                )}
              </div>
              
              <div className="mt-6 pt-6 relative border-t border-slate-800/80">
                <AddFolderModal companyId={company.id} currentYear={activeYear} />
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT Area */}
          <main className="flex-1 w-full relative">
            <div className="bg-slate-800/30 rounded-3xl overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
              
              {!activeFolderId ? (
                // ACTIONABLE EMPTY STATE
                <div className="flex flex-col items-center justify-center p-12 text-center flex-1">
                  <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 shadow-inner">
                    <Folder className="w-8 h-8 text-slate-500 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Select a folder to manage invoices</h3>
                  <p className="text-sm text-slate-400 font-medium max-w-sm mb-6 leading-relaxed">
                    Choose a category folder from the left sidebar to view its contents, or create a brand new one to get started.
                  </p>
                  <AddFolderModal companyId={company.id} currentYear={activeYear} />
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  {/* FOLDER HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:px-8 bg-slate-800/40 gap-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <FolderActions companyId={company.id} folderId={activeFolderId} currentName={activeFolder?.name || ''} />
                      </div>
                      <UploadInvoiceModal companyId={company.id} folderId={activeFolderId} />
                    </div>
                  </div>

                  {/* INVOICES TABLE */}
                  <div className="overflow-x-auto flex-1 p-6 sm:px-8 bg-slate-900/10">
                    {invoices.length === 0 ? (
                      // ACTIONABLE EMPTY STATE - No Invoices in Folder
                      <div className="flex flex-col items-center justify-center text-slate-400 py-24 h-full bg-slate-800/20 rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-5">
                            <Receipt className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                        </div>
                        <h3 className="font-medium text-white mb-1">Folder is empty</h3>
                        <p className="text-sm font-medium max-w-sm mb-8 text-center text-slate-400">
                          Upload your first invoice to effectively track expenses for the {activeFolder?.name} category.
                        </p>
                        <UploadInvoiceModal companyId={company.id} folderId={activeFolderId} />
                      </div>
                    ) : (
                      <div className="rounded-2xl overflow-hidden bg-slate-800/50">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-slate-800/80 text-slate-400 text-xs font-semibold">
                              <th className="py-4 px-6 uppercase tracking-wider">Vendor Name</th>
                              <th className="py-4 px-6 uppercase tracking-wider">Billing Date</th>
                              <th className="py-4 px-6 uppercase tracking-wider text-right">Amount</th>
                              <th className="py-4 px-6 uppercase tracking-wider text-center">Document</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {invoices.map((invoice) => (
                              <tr key={invoice.id} className="hover:bg-slate-800/80 transition-colors group">
                                <td className="py-5 px-6 text-sm font-semibold text-white">
                                  {invoice.vendor_name}
                                </td>
                                <td className="py-5 px-6 text-sm text-slate-400">
                                  <div className="flex items-center gap-2 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                    {new Date(invoice.date).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                </td>
                                <td className="py-5 px-6 text-right">
                                  <div className="inline-flex items-center font-medium font-mono text-white justify-end">
                                    <span className="text-slate-500 mr-1.5 text-xs">$</span>
                                    {Number(invoice.amount).toFixed(2)}
                                  </div>
                                </td>
                                <td className="py-5 px-6 text-center">
                                  <a 
                                    href={invoice.file_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                                  >
                                    View File
                                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
