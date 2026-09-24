import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const storeId = body.storeId || body.store_id
    const pageData = body.pageData || {}
    const content = pageData.content || body.content || []

    if (!storeId) return NextResponse.json({ error: 'storeId missing' }, { status: 400 })

    const { error } = await supabase.from('pages').upsert({
      store_id: storeId,
      slug: 'home',
      content: content,
      blocks: content,
      is_published: true,
      updated_at: new Date().toISOString()
    }, { onConflict: 'store_id,slug' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}



export async function GET() {
  return NextResponse.json({ ok: true, message: 'use POST to save' })
}
