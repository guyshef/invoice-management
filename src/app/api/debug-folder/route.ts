import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Step 1: Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ step: 'auth', error: 'Not authenticated', authError })
  }

  // Step 2: Fetch companies for this user
  const { data: companies, error: compError } = await supabase
    .from('companies')
    .select('id, name')

  if (!companies || companies.length === 0) {
    return NextResponse.json({ step: 'companies', error: 'No companies found', compError })
  }

  // Step 3: Try inserting a test folder for the first company
  const testCompany = companies[0]
  const { data: insertData, error: insertError } = await supabase
    .from('folders')
    .insert([{ company_id: testCompany.id, name: '__debug_test__', year: 2026 }])
    .select()

  if (insertError) {
    return NextResponse.json({
      step: 'insert',
      error: insertError.message,
      code: insertError.code,
      details: insertError.details,
      hint: insertError.hint,
      user_id: user.id,
      company: testCompany,
    })
  }

  // Step 4: Clean up - delete the test folder
  if (insertData && insertData.length > 0) {
    await supabase.from('folders').delete().eq('id', insertData[0].id)
  }

  return NextResponse.json({
    step: 'success',
    message: 'Folder insert and cleanup worked!',
    user_id: user.id,
    company: testCompany,
    inserted: insertData,
  })
}
