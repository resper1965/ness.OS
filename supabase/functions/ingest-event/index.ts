import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log("Hello from ingest-event!")

Deno.serve(async (req) => {
  // 1. Init Supabase Client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 2. Auth Check (Simple API Key for now, or use Supabase Auth)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 })
  }

  // 3. Parse Body
  let payload
  try {
    payload = await req.json()
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 })
  }

  const { source, event_type, data } = payload

  if (!source || !event_type) {
    return new Response(JSON.stringify({ error: 'Missing source or event_type' }), { status: 400 })
  }

  // 4. Insert into ness_data.raw_events
  const { error } = await supabase
    .from('raw_events')
    .insert({
      source,
      event_type,
      payload: data || payload, // Store specific data or full payload
    })
    .select()

  if (error) {
    console.error('Error inserting event:', error)
    return new Response(JSON.stringify({ error: 'Failed to ingest event' }), { status: 500 })
  }

  return new Response(
    JSON.stringify({ message: 'Event ingested successfully' }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
