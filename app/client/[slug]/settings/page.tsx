"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SettingsPage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("stores").select("*").eq("slug", params.slug).single()
      setStore(data || {})
      setLoading(false)
    }
    load()
  }, [params.slug])

  const saveSettings = async () => {
    const { error } = await supabase.from("stores").update({
      name: store.name,
      whatsapp: store.whatsapp
    }).eq("id", store.id)
    if (error) alert(error.message)
    else alert("Settings Saved Successfully!")
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Store Settings</h1>
        <Link href={`/client/${params.slug}`} className="bg-black text-white px-3 py-1 rounded text-sm">Back to Dashboard</Link>
      </div>
      <label className="block text-sm mb-1">Store Name</label>
      <input className="border p-2 w-full rounded mb-4" value={store.name || ""} onChange={e => setStore({...store, name: e.target.value})} />
      
      <label className="block text-sm mb-1">WhatsApp Number</label>
      <input className="border p-2 w-full rounded mb-4" value={store.whatsapp || ""} onChange={e => setStore({...store, whatsapp: e.target.value})} />

      <button onClick={saveSettings} className="bg-black text-white w-full py-2 rounded">Save Settings</button>
    </div>
  )
}
