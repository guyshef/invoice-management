import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { UploadInvoiceModal } from './UploadInvoiceModal'
import { AddFolderModal } from './AddFolderModal'
import { AddYearModal } from './AddYearModal'
import { FolderActions } from './FolderActions'
import { Receipt, Folder, ExternalLink, Calendar, ChevronRight } from 'lucide-react'

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

  // Determine unique years from existing folders
  const yearsWithFolders = Array.from(new Set((folders || []).map(f => f.year))).sort((a, b) => b - a)

  const currentYear = new Date().getFullYear()

  // Read explicitly added years from cookie
  const cookieStore = await cookies()
  const addedYearsCookie = cookieStore.get(`added_years_${id}`)?.value
  const cookieYears: number[] = addedYearsCookie ? JSON.parse(addedYearsCookie) : []

  // The years we show in the UI list
  const availableYears = Array.from(new Set([...yearsWithFolders, currentYear, ...cookieYears]))

  // Use requested year, or latest year with folders, or current year
  const activeYear = resolvedParams.year ? parseInt(resolvedParams.year) : (yearsWithFolders[0] || currentYear)

  if (!availableYears.includes(activeYear)) {
    availableYears.push(activeYear)
  }

  availableYears.sort((a, b) => b - a)

  const activeFolderId = resolvedParams.folder

  // Folders for the active year
  const yearFolders = (folders || []).filter(f => f.year === activeYear)
  const activeFolder = yearFolders.find(f => f.id === activeFolderId)

  // Fetch invoices if a folder is selected
  let invoices: Array<{ id: string, vendor_name: string, date: string, amount: number, file_url: string }> = []
  if (activeFolderId) {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('folder_id', activeFolderId)
      .order('created_at', { ascending: false })
    invoices = data || []
  }

  return (
    <div className="min-h-screen bg-slate-50 text-navy p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4">
          <nav className="flex items-center text-sm font-medium text-graytext">
            <Link href="/dashboard" className="hover:text-navy transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
            <span className="text-navy font-semibold">{company.name}</span>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
            <span className="text-graytext">{activeYear}</span>
            {activeFolder && (
              <>
                <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
                <span className="text-navy bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">{activeFolder.name}</span>
              </>
            )}
          </nav>

          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-navy tracking-tight">{company.name}</h1>
              {company.tax_id && (
                <span className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-graytext shadow-sm">
                  Tax ID: {company.tax_id}
                </span>
              )}
            </div>
          </header>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* LEFT SIDEBAR */}
          <aside className="w-full md:w-[300px] shrink-0 flex flex-col gap-6">
            
            {/* SEGMENTED CONTROL: Filter by Year */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-[11px] font-bold text-graytext uppercase tracking-widest mb-4">
                Financial Year
              </h3>
              <div className="flex flex-wrap items-center bg-slate-50 p-1 rounded-2xl border border-slate-100 gap-1">
                {availableYears.map(y => (
                  <Link 
                    key={y}
                    href={`/company/${id}?year=${y}`}
                    className={`flex-1 min-w-[70px] text-center px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                      y === activeYear 
                        ? 'bg-white text-primary shadow-md border border-slate-100 ring-1 ring-black/5' 
                        : 'text-graytext hover:text-navy hover:bg-white/50'
                    }`}
                  >
                    {y}
                  </Link>
                ))}
                <div className="pl-1 ml-1 border-l border-slate-200">
                  <AddYearModal companyId={company.id} />
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex-1">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-bold text-graytext uppercase tracking-widest">
                  Folders ({activeYear})
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-1.5">
                {yearFolders.length === 0 ? (
                  <div className="text-sm text-graytext font-medium p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center border-dashed">
                    No folders exist for {activeYear}.
                  </div>
                ) : (
                  yearFolders.map(f => (
                    <Link
                      key={f.id}
                      href={`/company/${id}?year=${activeYear}&folder=${f.id}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                        f.id === activeFolderId 
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                          : 'text-graytext hover:bg-slate-50 hover:text-navy border border-transparent'
                      }`}
                    >
                      <Folder className={`w-4 h-4 ${f.id === activeFolderId ? 'text-primary' : 'text-slate-400'}`} />
                      {f.name}
                    </Link>
                  ))
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <AddFolderModal companyId={company.id} currentYear={activeYear} />
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT Area */}
          <main className="flex-1 w-full">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
              
              {!activeFolderId ? (
                // ACTIONABLE EMPTY STATE
                <div className="flex flex-col items-center justify-center p-12 text-center flex-1">
                  <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                    <Folder className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-3">Select a folder</h3>
                  <p className="text-graytext font-medium max-w-sm mb-8 leading-relaxed">
                    Choose a category folder from the sidebar to manage invoices, or create a new one for {activeYear}.
                  </p>
                  <div className="w-full max-w-xs">
                    <AddFolderModal companyId={company.id} currentYear={activeYear} />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  {/* FOLDER HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:px-10 bg-slate-50/50 border-b border-slate-100 gap-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <h2 className="text-xl font-bold text-navy">{activeFolder?.name}</h2>
                        <FolderActions companyId={company.id} folderId={activeFolderId} currentName={activeFolder?.name || ''} />
                      </div>
                      <UploadInvoiceModal companyId={company.id} folderId={activeFolderId} />
                    </div>
                  </div>

                  {/* INVOICES TABLE */}
                  <div className="overflow-x-auto flex-1 p-6 sm:px-10">
                    {invoices.length === 0 ? (
                      // ACTIONABLE EMPTY STATE - No Invoices in Folder
                      <div className="flex flex-col items-center justify-center text-graytext py-24 h-full bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                            <Receipt className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                        </div>
                        <h3 className="text-xl font-bold text-navy mb-2">No invoices yet</h3>
                        <p className="font-medium max-w-xs mb-10 text-center">
                          Start tracking expenses for {activeFolder?.name} by uploading your first invoice.
                        </p>
                        <UploadInvoiceModal companyId={company.id} folderId={activeFolderId} />
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-slate-50/80 text-graytext text-[11px] font-bold">
                              <th className="py-5 px-8 uppercase tracking-widest border-b border-slate-100">Vendor Name</th>
                              <th className="py-5 px-8 uppercase tracking-widest border-b border-slate-100">Billing Date</th>
                              <th className="py-5 px-8 uppercase tracking-widest border-b border-slate-100 text-right">Amount</th>
                              <th className="py-5 px-8 uppercase tracking-widest border-b border-slate-100 text-center">Document</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {invoices.map((invoice) => (
                              <tr key={invoice.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="py-6 px-8 text-sm font-bold text-navy">
                                  {invoice.vendor_name}
                                </td>
                                <td className="py-6 px-8 text-sm text-graytext font-medium">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-300" />
                                    {new Date(invoice.date).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </div>
                                </td>
                                <td className="py-6 px-8 text-right">
                                  <div className="inline-flex items-center font-bold text-navy justify-end">
                                    <span className="text-graytext mr-1.5 text-xs font-medium">$</span>
                                    {Number(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </div>
                                </td>
                                <td className="py-6 px-8 text-center">
                                  <a 
                                    href={invoice.file_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs font-bold text-primary hover:text-white bg-primary/5 hover:bg-primary px-5 py-2.5 rounded-xl transition-all border border-primary/10"
                                  >
                                    View File
                                    <ExternalLink className="w-3.5 h-3.5 ml-2" />
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
