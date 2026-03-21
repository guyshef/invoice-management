'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button 
      onClick={handleSignOut}
      title="Sign Out"
      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 p-2 rounded-full transition-colors"
    >
      <LogOut className="w-4 h-4" />
    </button>
  )
}
