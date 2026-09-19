"use client";

import { useState } from "react";
import type { Product } from "@/types/product";

interface ProductEditorProps {
  storeId: string;
  product?: Product | null;
  onSaved: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductEditor({
  storeId,
  product,
  onSaved,
  onCancel
}: ProductEditorProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [oldPrice, setOldPrice] = useState(product?.old_price?.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [published, setPublished] = useState(product?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!name.trim()) { setError("Product name is required."); return; }
    if (!price || Number(price) < 0) { setError("Please enter a valid price."); return; }
    setSaving(true);
    try {
      const payload = {
        store_id: storeId,
        name: name.trim(),
        price: Number(price),
        old_price: oldPrice.trim() === "" ? null : Number(oldPrice),
        image_url: imageUrl.trim() === "" ? null : imageUrl.trim(),
        description: description.trim() === "" ? null : description.trim(),
        stock: Number(stock || 0),
        sku: sku.trim() === "" ? null : sku.trim(),
        published
      };
      const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save product");
      onSaved(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, marginBottom: 24 }}>
      <h2 style={{ marginTop: 0 }}>{product ? "Edit Product" : "Add Product"}</h2>
      {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: 12, borderRadius: 10, marginBottom: 16 }}>{error}</div>}
      <div style={{ display: "grid", gap: 16 }}>
        <label><div style={{ marginBottom: 6 }}>Product Name</div><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. M10 Airbuds Pro Max" style={inputStyle} /></label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <label><div style={{ marginBottom: 6 }}>Price</div><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1500" style={inputStyle} /></label>
          <label><div style={{ marginBottom: 6 }}>Old Price</div><input type="number" min="0" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} placeholder="2500" style={inputStyle} /></label>
        </div>
        <label><div style={{ marginBottom: 6 }}>Product Image URL</div><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." style={inputStyle} /></label>
        {imageUrl && <div><img src={imageUrl} alt={name || "Product preview"} style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }} /></div>}
        <label><div style={{ marginBottom: 6 }}>Description</div><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." rows={5} style={{ ...inputStyle, resize: "vertical" }} /></label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <label><div style={{ marginBottom: 6 }}>Stock</div><input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} style={inputStyle} /></label>
          <label><div style={{ marginBottom: 6 }}>SKU</div><input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-001" style={inputStyle} /></label>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /><span>Publish product</span></label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="submit" disabled={saving} style={{ padding: "12px 18px", border: 0, borderRadius: 10, background: "#16a34a", color: "#fff", fontWeight: 700 }}>{saving ? "Saving..." : product ? "Update Product" : "Create Product"}</button>
          <button type="button" onClick={onCancel} style={{ padding: "12px 18px", border: "1px solid #d1d5db", borderRadius: 10, background: "#fff" }}>Cancel</button>
        </div>
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: 10, outline: "none", background: "#fff"
};
