'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadInvoice(companyId: string, folderId: string, formData: FormData) {
  const supabase = await createClient()
  
  const file = formData.get('file') as File
  const vendor_name = formData.get('vendor_name') as string
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string

  if (!file || !vendor_name || isNaN(amount) || !folderId) {
    return { error: 'Missing required fields' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${companyId}/${folderId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(fileName, file)

  if (uploadError) {
    return { error: 'Failed to upload file to storage.' }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('invoices')
    .getPublicUrl(fileName)

  const { error: dbError } = await supabase
    .from('invoices')
    .insert([{
      company_id: companyId,
      folder_id: folderId,
      vendor_name,
      amount,
      date: date || new Date().toISOString().split('T')[0],
      file_url: publicUrl
    }])

  if (dbError) {
    await supabase.storage.from('invoices').remove([fileName])
    return { error: 'Failed to save invoice record' }
  }

  revalidatePath(`/company/${companyId}`)
  return { success: true }
}

export async function addFolder(companyId: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const year = parseInt(formData.get('year') as string)

  if (!name || isNaN(year)) {
    return { error: 'Missing folder name or year' }
  }

  const { error } = await supabase
    .from('folders')
    .insert([{ company_id: companyId, name, year }])

  if (error) {
    return { error: `DB Error: ${error.message}` }
  }

  revalidatePath(`/company/${companyId}`)
  return { success: true }
}

export async function renameFolder(companyId: string, folderId: string, formData: FormData) {
  const supabase = await createClient()
  const newName = formData.get('name') as string

  if (!newName) {
    return { error: 'Folder name is required' }
  }

  const { error } = await supabase
    .from('folders')
    .update({ name: newName })
    .eq('id', folderId)
    .eq('company_id', companyId)

  if (error) {
    return { error: `DB Error: ${error.message}` }
  }

  revalidatePath(`/company/${companyId}`)
  return { success: true }
}

export async function deleteFolder(companyId: string, folderId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', folderId)
    .eq('company_id', companyId)

  if (error) {
    return { error: `DB Error: ${error.message}` }
  }

  revalidatePath(`/company/${companyId}`)
  return { success: true }
}
