// @ts-nocheck
"use client";

import { useMemo, useState, useEffect } from "react";
import type { BlockType, EditorBlock, PageData, DeviceType } from "@/types/page";
import { createDefaultBlock } from "./blockDefaults";
import DeviceSwitcher from "./DeviceSwitcher";
import StyleSettings from "./StyleSettings";
import BlockToolbar from "./BlockToolbar";

interface Props {
  storeId: string;
  storeName: string;
  initialData: PageData;
}

const blockTypes: BlockType[] = ["Header", "Hero", "Products", "Features", "WhatsAppOrder", "Contact", "Footer"];

export default function Editor({ storeId, storeName, initialData }: Props) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialData.content || []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [storeProducts, setStoreProducts] = useState<{ id: string; name: string; price: number; image_url: string | null }[]>([]);

  useEffect(() => {
    async function loadStoreProducts() {
      try {
        const response = await fetch(`/api/products?storeId=${encodeURIComponent(storeId)}`, { cache: "no-store" });
        const result = await response.json();
        if (response.ok) setStoreProducts(result.products || []);
      } catch (error) { console.error("PRODUCT_LOAD_ERROR:", error); }
    }
    if (storeId) loadStoreProducts();
  }, [storeId]);

  const selectedBlock = useMemo(() => blocks.find((b) => b.id === selectedId)?? null, [blocks, selectedId]);
  const selectedIndex = useMemo(() => blocks.findIndex(b => b.id === selectedId), [blocks, selectedId]);

  function addBlock(type: BlockType) {
    const block = createDefaultBlock(type);
    setBlocks((c) => [...c, block]);
    setSelectedId(block.id);
  }

  function deleteBlock(id: string) {
    setBlocks((c) => c.filter((b) => b.id!== id));
    if (selectedId === id) setSelectedId(null);
  }

  function moveBlock(index: number, direction: "up" | "down") {
    setBlocks((current) => {
      const newIndex = direction === "up"? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
      return copy;
    });
  }

  function duplicateBlock(index: number) {
    setBlocks(current => {
      const original = current[index];
      const duplicate: EditorBlock = {...original, id: crypto.randomUUID(), props: {...original.props }, style: {...original.style } };
      const next = [...current];
      next.splice(index + 1, 0, duplicate);
      return next;
    });
  }

  function toggleBlock(index: number) {
    setBlocks(current => current.map((b, i) => i === index? {...b, hidden:!b.hidden } : b));
  }

  function updateBlock(id: string, key: string, value: unknown) {
    setBlocks((c) => c.map((b) => (b.id === id? {...b, props: {...b.props, [key]: value } } : b)));
  }

  function updateBlockStyle(index: number, style: any) {
    setBlocks(current => current.map((b, i) => i === index? {...b, style } : b));
  }

  async function saveDesign() {
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/pages/save", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, pageData: { version: 1, content: blocks } })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save");
      setMessage("Design saved successfully.");
    } catch (error) { setMessage(error instanceof Error? error.message : "Unable to save design."); }
    finally { setSaving(false); }
  }

  const canvasWidth = device === "desktop"? "100%" : device === "tablet"? "768px" : "390px";

  return (
    <div style={{ minHeight: "100vh", background: "#eef1f0" }}>
      <header style={{ height: "64px", background: "#ffffff", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", position: "sticky", top: 0, zIndex: 20 }}>
        <div><strong>Editor — {storeName}</strong></div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <DeviceSwitcher device={device} onChange={setDevice} />
          {message && <span style={{ fontSize: "13px" }}>{message}</span>}
          <button onClick={saveDesign} disabled={saving} style={primaryButton}>{saving? "Saving..." : "Save Design"}</button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "230px minmax(0, 1fr) 320px", minHeight: "calc(100vh - 64px)" }}>
        <aside style={{ background: "#ffffff", borderRight: "1px solid #e5e7eb", padding: "18px" }}>
          <h3>Add Blocks</h3>
          <div style={{ display: "grid", gap: "9px" }}>
            {blockTypes.map((type) => (<button key={type} onClick={() => addBlock(type)} style={blockButton}>+ {type}</button>))}
          </div>
        </aside>

        <main style={{ padding: "25px", overflow: "auto", display: "flex", justifyContent: "center", background: "#e5e7eb" }}>
          <div style={{ width: canvasWidth, maxWidth: "100%", minHeight: "700px", background: "#ffffff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,.08)", transition: "width.25s ease" }}>
            {blocks.length === 0? (
              <div style={{ padding: "100px 20px", textAlign: "center", color: "#6b7280" }}><h2>Your page is empty</h2><p>Select a block from the left panel to start.</p></div>
            ) : (
              blocks.map((block, index) => {
                if (block.hidden) return null;
                return (
                  <div key={block.id} style={{ position: "relative", marginTop: block.style?.marginTop?? 0, marginBottom: block.style?.marginBottom?? 0 }}>
                    <BlockToolbar index={index} total={blocks.length} hidden={block.hidden} onUp={() => moveBlock(index, "up")} onDown={() => moveBlock(index, "down")} onDuplicate={() => duplicateBlock(index)} onDelete={() => deleteBlock(block.id)} onToggle={() => toggleBlock(index)} />
                    <div onClick={() => setSelectedId(block.id)} style={{ border: selectedId === block.id? "2px solid #2563eb" : "2px solid transparent", cursor: "pointer" }}>
                      <BlockPreview block={block} products={storeProducts} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        <aside style={{ background: "#ffffff", borderLeft: "1px solid #e5e7eb", padding: "18px", overflow: "auto" }}>
          <h3>Block Settings</h3>
          {!selectedBlock? <p style={{ color: "#6b7280" }}>Select a block to edit.</p> : (
            <>
              <BlockSettings block={selectedBlock} onChange={updateBlock} />
              <div style={{ margin: "25px 0", borderTop: "1px solid #e5e7eb" }} />
              <StyleSettings style={selectedBlock.style?? {}} onChange={(style) => updateBlockStyle(selectedIndex, style)} />
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function BlockPreview({ block, products }: { block: EditorBlock; products: { id: string; name: string; price: number; image_url: string | null }[] }) {
  const props = block.props as any;
  const style = block.style as any || {};
  const wrapperStyle: any = {
    backgroundColor: style.backgroundColor || (block.type === "Footer"? "#111827" : "#ffffff"),
    color: style.textColor || (block.type === "Footer"? "#ffffff" : "#111827"),
    paddingTop: style.paddingTop?? 40, paddingRight: style.paddingRight?? 20, paddingBottom: style.paddingBottom?? 40, paddingLeft: style.paddingLeft?? 20,
    textAlign: style.textAlign?? "center",
  };
  const innerStyle: any = { maxWidth: style.maxWidth?? 1200, margin: "0 auto" };

  if (block.type === "Header") return <div style={{...wrapperStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={innerStyle}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong>{String(props.logoText || "My Store")}</strong><div style={{ display: "flex", gap: "15px" }}><span>Home</span><span>Products</span><span>Contact</span>{props.showCart && <span>Cart</span>}</div></div></div></div>;
  if (block.type === "Hero") return <div style={{...wrapperStyle, paddingTop: style.paddingTop?? 90, paddingBottom: style.paddingBottom?? 90 }}><div style={innerStyle}><h1>{String(props.title || "Welcome")}</h1><p>{String(props.subtitle || "")}</p><button style={{...primaryButton, background: props.buttonColor || "#16a34a" }}>{String(props.buttonText || "Shop Now")}</button></div></div>;
  if (block.type === "Products") {
    const limit = Math.max(1, Number(props.limit || 8));
    const visibleProducts = products.slice(0, limit);
    return (
      <section style={wrapperStyle}><div style={innerStyle}>
        <h2 style={{ textAlign: style.textAlign }}>{String(props.title || "Featured Products")}</h2>
        {visibleProducts.length === 0? <div style={{ padding: "40px", textAlign: "center", background: "#f9fafb", borderRadius: "10px" }}><p>No products yet.</p></div> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px", textAlign: "left" }}>
            {visibleProducts.map((product) => (
              <div key={product.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden", background: "#fff" }}>
                {product.image_url? <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} /> : <div style={{ height: "150px", background: "#f3f4f6" }} />}
                <div style={{ padding: "12px" }}><h4 style={{ margin: "0 0 4px 0", fontSize: "14px" }}>{product.name}</h4><strong>Rs. {product.price.toLocaleString()}</strong></div>
              </div>
            ))}
          </div>
        )}</div></section>
    );
  }
  if (block.type === "Features") {
    const items = Array.isArray(props.items)? props.items : [];
    return <section style={wrapperStyle}><div style={innerStyle}><h2>{String(props.title || "Features")}</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", textAlign: "left" }}>{items.map((item: any, index) => (<div key={index} style={{ padding: "20px", border: "1px solid #e5e7eb", borderRadius: "10px", background: "#fff" }}><h3>{item.title}</h3><p>{item.text || item.description}</p></div>))}</div></div></section>;
  }
  if (block.type === "WhatsAppOrder") return <section style={wrapperStyle}><div style={innerStyle}><h2>{String(props.title || "Order on WhatsApp")}</h2><p>{String(props.description || "")}</p><button style={{...primaryButton, background: "#16a34a" }}>{String(props.buttonText || "Order on WhatsApp")}</button></div></section>;
  if (block.type === "Contact") return <section style={wrapperStyle}><div style={innerStyle}><h2>{String(props.title || "Contact Us")}</h2><p>Phone: {String(props.phone || "")}</p><p>Email: {String(props.email || "")}</p><p>Address: {String(props.address || "")}</p></div></section>;
  if (block.type === "Footer") return <footer style={wrapperStyle}><div style={innerStyle}>{String(props.text || "My Store")}</div></footer>;
  return null;
}

function BlockSettings({ block, onChange }: { block: EditorBlock; onChange: (id: string, key: string, value: unknown) => void; }) {
  const props = block.props as any;
  if (block.type === "Header") return <><Field label="Logo / Store Name" value={String(props.logoText || "")} onChange={(v) => onChange(block.id, "logoText", v)} /><Checkbox label="Show Search" checked={Boolean(props.showSearch)} onChange={(v) => onChange(block.id, "showSearch", v)} /><Checkbox label="Show Cart" checked={Boolean(props.showCart)} onChange={(v) => onChange(block.id, "showCart", v)} /></>;
  if (block.type === "Hero") return <><Field label="Title" value={String(props.title || "")} onChange={(v) => onChange(block.id, "title", v)} /><Field label="Subtitle" value={String(props.subtitle || "")} onChange={(v) => onChange(block.id, "subtitle", v)} /><Field label="Button Text" value={String(props.buttonText || "")} onChange={(v) => onChange(block.id, "buttonText", v)} /><Field label="Button Link" value={String(props.buttonLink || "")} onChange={(v) => onChange(block.id, "buttonLink", v)} /><Field label="Button Color" value={String(props.buttonColor || "#16a34a")} onChange={(v) => onChange(block.id, "buttonColor", v)} /></>;
  if (block.type === "Products") return <><Field label="Section Title" value={String(props.title || "")} onChange={(v) => onChange(block.id, "title", v)} /><Field label="Product Limit" type="number" value={String(props.limit || 8)} onChange={(v) => onChange(block.id, "limit", Number(v))} /></>;
  if (block.type === "WhatsAppOrder") return <><Field label="Title" value={String(props.title || "")} onChange={(v) => onChange(block.id, "title", v)} /><Field label="WhatsApp Number" value={String(props.phone || "")} onChange={(v) => onChange(block.id, "phone", v)} /><Field label="Button Text" value={String(props.buttonText || "")} onChange={(v) => onChange(block.id, "buttonText", v)} /></>;
  if (block.type === "Contact") return <><Field label="Title" value={String(props.title || "")} onChange={(v) => onChange(block.id, "title", v)} /><Field label="Phone" value={String(props.phone || "")} onChange={(v) => onChange(block.id, "phone", v)} /><Field label="Email" value={String(props.email || "")} onChange={(v) => onChange(block.id, "email", v)} /><Field label="Address" value={String(props.address || "")} onChange={(v) => onChange(block.id, "address", v)} /></>;
  if (block.type === "Footer") return <Field label="Footer Text" value={String(props.text || "")} onChange={(v) => onChange(block.id, "text", v)} />;
  if (block.type === "Features") return <Field label="Section Title" value={String(props.title || "")} onChange={(v) => onChange(block.id, "title", v)} />;
  return null;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <div style={{ marginBottom: "15px" }}><label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 700 }}>{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "8px" }} /></div>;
}
function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label style={{ display: "flex", gap: "8px", marginBottom: "15px", alignItems: "center" }}><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}</label>;
}
const primaryButton: any = { border: 0, borderRadius: "8px", padding: "11px 17px", background: "#16a34a", color: "#ffffff", fontWeight: 700 };
const blockButton: any = { width: "100%", padding: "11px", textAlign: "left" as const, border: "1px solid #e5e7eb", background: "#ffffff", borderRadius: "8px" };
