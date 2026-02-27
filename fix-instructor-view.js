const { createClient } = require('@supabase/supabase-js')

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for SQL

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing environment variables. Please check .env.local")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sql = `
-- Drop existing view
drop view if exists public.instructor_stats;

-- Create updated view without course_reviews dependency
create view public.instructor_stats
  with (security_invoker = on) as
select
  i.id,
  i.name,
  i.slug,
  i.highlight,
  i.bio,
  i.image,
  i.cover_photo,
  i.is_featured,
  i.sort_order,
  i.created_at,

  -- Number of courses this instructor teaches
  count(distinct c.id)::int as total_courses,

  -- Placeholder for reviews until table exists
  0 as total_reviews,

  -- Placeholder for rating until table exists
  0 as average_rating

from public.instructors i
left join public.courses c
  on c.instructor_id = i.id
group by i.id;
`

async function main() {
    console.log("Updating instructor_stats view...")
    // Supabase JS doesn't have a direct raw SQL method reliably exposed unless using rpc
    // If rpc('exec_sql') isn't set up, we will just use psql / dashboard
    // Let's print the SQL for the user or if we can't run it
    console.log("Please run the following SQL in your Supabase Dashboard SQL Editor:")
    console.log("-----------------------------------------")
    console.log(sql)
    console.log("-----------------------------------------")
    console.log("Skipping direct execution as it usually requires pg module or RPC setup.")
}

main()
