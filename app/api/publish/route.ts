import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') || 'shoes'
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { error } = await supabase.from('stores').update({ is_published: true }).eq('slug', slug)
  if(error) return NextResponse.json({error: error.message}, {status:500})
  return NextResponse.json({success: true, message: `${slug} published`})
}
