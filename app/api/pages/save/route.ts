import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const storeId = body.store_id || body.storeId
    const content = body.content || body.pagedata?.content || []

    if (!storeId) return NextResponse.json({ error: 'store_id missing' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('pages').upsert({
      store_id: storeId,
      slug: 'home',
      content: content,
      blocks: content,
      is_published: true
    }, { onConflict: 'store_id,slug' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
