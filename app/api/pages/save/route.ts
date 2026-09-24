import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: NextRequest) {
  try {
    const { store_id, storeId, slug, content, blocks, data } = await req.json()
    const finalStoreId = store_id || storeId
    const finalContent = content || blocks || data || []

    if (!finalStoreId) {
      return NextResponse.json({ error: 'store_id missing' }, { status: 400 })
    }

    const { error } = await supabase
      .from('pages')
      .upsert({
        store_id: finalStoreId,
        slug: slug || 'home',
        content: finalContent,
        blocks: finalContent,
        is_published: true,
        published: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'store_id,slug' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
