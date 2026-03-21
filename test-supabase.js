const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('folders').select('*').limit(1);
  console.log("Folders Check:", { error, data });
  const { data: invData, error: invError } = await supabase.from('invoices').select('*').limit(1);
  console.log("Invoices Check:", { error: invError, data: invData });
}
test();
