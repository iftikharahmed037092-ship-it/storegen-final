"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function ProductsPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: store } = await supabase.from("stores").select("id").eq("slug", params.slug).single()
      if (!store) return
      const { data } = await supabase.from("products").select("*").eq("store_id", store.id).order("created_at", { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [params.slug])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    await supabase.from("products").delete().eq("id", id)
    setProducts(products.filter(p => p.id !== id))
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Products</h1>
        <Link href={`/client/${params.slug}`} className="bg-black text-white px-3 py-1 rounded text-sm">Back to Dashboard</Link>
      </div>
      {products.length === 0 ? <p>No products found</p> : products.map(p => (
        <div key={p.id} className="border p-3 rounded mb-2 flex justify-between items-center">
          <div>
            <p className="font-bold">{p.name}</p>
            <p className="text-sm">Rs. {p.price}</p>
          </div>
          <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
        </div>
      ))}
    </div>
  )
}
