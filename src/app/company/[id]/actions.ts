'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadInvoice(companyId: string, formData: FormData) {
  const supabase = await createClient()
  
  const file = formData.get('file') as File
  const vendor_name = formData.get('vendor_name') as string
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string

  if (!file || !vendor_name || isNaN(amount)) {
    return { error: 'Missing required fields' }
  }

  // Upload file to Supabase Storage bucket 'invoices'
  const fileExt = file.name.split('.').pop()
  const fileName = `${companyId}/${crypto.randomUUID()}.${fileExt}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(fileName, file)

  if (uploadError) {
    console.error(uploadError)
    return { error: 'Failed to upload file to storage. Did you create the storage bucket?' }
  }

  // Get public URL based on the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('invoices')
    .getPublicUrl(fileName)

  // Insert record into invoices table
  const { error: dbError } = await supabase
    .from('invoices')
    .insert([{
      company_id: companyId,
      vendor_name,
      amount,
      date: date || new Date().toISOString().split('T')[0],
      file_url: publicUrl
    }])

  if (dbError) {
    console.error(dbError)
    // Attempt to rollback file upload if DB insert fails
    await supabase.storage.from('invoices').remove([fileName])
    return { error: 'Failed to save invoice record' }
  }

  revalidatePath(`/company/${companyId}`)
  return { success: true }
}
