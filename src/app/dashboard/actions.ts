'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCompany(prevState: { error?: string, success?: boolean } | null, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const tax_id = formData.get('tax_id') as string

  if (!name) {
    return { error: 'Company name is required' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('companies')
    .insert([
      { name, tax_id, user_id: user.id }
    ])

  if (error) {
    console.error(error)
    return { error: 'Failed to add company' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
