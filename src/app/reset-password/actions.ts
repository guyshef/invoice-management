'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!password || password.length < 6) {
    redirect('/reset-password?message=Password must be at least 6 characters')
  }

  if (password !== confirm) {
    redirect('/reset-password?message=Passwords do not match')
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/reset-password?message=Could not update password')
  }

  redirect('/login?message=Password updated — please sign in')
}
