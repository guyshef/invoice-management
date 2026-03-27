/**
 * Test: Nested Folder Feature
 * Run: node test-nested-folders.mjs
 *
 * Verifies:
 * 1. Can create a top-level folder
 * 2. Can create a subfolder inside it (parent_id set)
 * 3. Subfolder is returned with correct parent_id
 * 4. Subfolder cascade-deletes with parent
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ahhfpisxxnfnifmunmwn.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaGZwaXN4eG5mbmlmbXVubXduIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyNTc4OCwiZXhwIjoyMDg5NjAxNzg4fQ.UBgPJ6Fnk89q54aCsxWQaGqxdA_0-dcEoaNCoxOSvcw'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

function pass(msg) { console.log(`  ✓ ${msg}`) }
function fail(msg) { console.error(`  ✗ ${msg}`); process.exit(1) }

async function run() {
  console.log('\nNested Folder Feature Test\n' + '─'.repeat(40))

  // ── 1. Get a test company (first one available) ─────────────────────────
  const { data: companies } = await supabase.from('companies').select('id, name').limit(1)
  if (!companies?.length) fail('No companies found — create one first via the app')
  const company = companies[0]
  console.log(`\nUsing company: "${company.name}" (${company.id})\n`)

  // ── 2. Create top-level folder ───────────────────────────────────────────
  const { data: parent, error: e1 } = await supabase
    .from('folders')
    .insert({ company_id: company.id, name: '__TEST_Parent__', year: 2025, parent_id: null })
    .select()
    .single()

  if (e1) fail(`Create top-level folder: ${e1.message}`)
  pass(`Created top-level folder "${parent.name}" (${parent.id})`)
  if (parent.parent_id !== null) fail('parent_id should be null for top-level folder')
  pass('parent_id is null ✓')

  // ── 3. Create subfolder inside parent ────────────────────────────────────
  const { data: child, error: e2 } = await supabase
    .from('folders')
    .insert({ company_id: company.id, name: '__TEST_Child__', year: 2025, parent_id: parent.id })
    .select()
    .single()

  if (e2) fail(`Create subfolder: ${e2.message}`)
  pass(`Created subfolder "${child.name}" (${child.id})`)
  if (child.parent_id !== parent.id) fail(`parent_id mismatch: expected ${parent.id}, got ${child.parent_id}`)
  pass(`parent_id correctly set to parent folder ✓`)

  // ── 4. Create sub-subfolder (3rd level) ──────────────────────────────────
  const { data: grandchild, error: e3 } = await supabase
    .from('folders')
    .insert({ company_id: company.id, name: '__TEST_Grandchild__', year: 2025, parent_id: child.id })
    .select()
    .single()

  if (e3) fail(`Create sub-subfolder: ${e3.message}`)
  pass(`Created sub-subfolder "${grandchild.name}" (${grandchild.id})`)
  pass(`parent_id set to child folder ✓`)

  // ── 5. Fetch and verify tree structure ───────────────────────────────────
  const { data: allFolders } = await supabase
    .from('folders')
    .select('id, name, parent_id')
    .in('id', [parent.id, child.id, grandchild.id])

  const fetched = Object.fromEntries(allFolders.map(f => [f.id, f]))
  if (fetched[parent.id].parent_id !== null) fail('Parent should have null parent_id')
  if (fetched[child.id].parent_id !== parent.id) fail('Child parent_id mismatch')
  if (fetched[grandchild.id].parent_id !== child.id) fail('Grandchild parent_id mismatch')
  pass('Tree structure verified: Parent → Child → Grandchild ✓')

  // ── 6. Cascade delete: deleting parent removes all descendants ───────────
  const { error: delErr } = await supabase.from('folders').delete().eq('id', parent.id)
  if (delErr) fail(`Delete parent folder: ${delErr.message}`)

  const { data: remaining } = await supabase
    .from('folders')
    .select('id')
    .in('id', [parent.id, child.id, grandchild.id])

  if (remaining?.length !== 0) fail(`Cascade delete failed — ${remaining.length} folders still exist`)
  pass('Cascade delete: all descendants removed with parent ✓')

  console.log('\n' + '─'.repeat(40))
  console.log('All tests passed! Nested folders are working.\n')
}

run().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
