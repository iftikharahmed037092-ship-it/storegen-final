import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get('store_id')
  if (!storeId) return NextResponse.json({ content: [] })
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase.from('pages').select('content').eq('store_id', storeId).eq('slug','home').single()
  return NextResponse.json({ content: data?.content || [], blocks: data?.content || [] })
}
