"use client";

import {
  useState
} from "react";

import {
  useRouter
} from "next/navigation";

import type {
  Store
} from "@/types/store";


interface StoreSettingsProps {
  store: Store;
}


export default function StoreSettings({
  store
}: StoreSettingsProps) {

  const router =
    useRouter();

  const [storeName, setStoreName] =
    useState(store.store_name);

  const [slug, setSlug] =
    useState(store.slug);

  const [customDomain, setCustomDomain] =
    useState(
      store.custom_domain || ""
    );

  const [logoUrl, setLogoUrl] =
    useState(
      store.logo_url || ""
    );

  const [primaryColor, setPrimaryColor] =
    useState(
      store.primary_color ||
      "#000000"
    );

  const [whatsappNumber, setWhatsappNumber] =
    useState(
      store.whatsapp_number ||
      ""
    );

  const [shippingFee, setShippingFee] =
    useState(
      String(store.shipping_fee ?? 0)
    );

  const [isActive, setIsActive] =
    useState(
      store.is_active
    );

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState("");


  async function saveSettings(
    event: React.FormEvent
  ) {

    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {

      const response =
        await fetch(
          `/api/stores/${store.id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              store_name:
                storeName.trim(),

              slug:
                slug.trim(),

              custom_domain:
                customDomain.trim() ||
                null,

              logo_url:
                logoUrl.trim() ||
                null,

              primary_color:
                primaryColor,

              whatsapp_number:
                whatsappNumber.trim() ||
                null,

              shipping_fee:
                Number(shippingFee) || 0,

              is_active:
                isActive
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
          "Unable to save settings."
        );
      }

      setMessage(
        "Store settings saved successfully."
      );

      router.refresh();

    } catch (error) {

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save settings."
      );

    } finally {

      setSaving(false);

    }
  }


  async function deleteStore() {

    const confirmed =
      window.confirm(
        `Delete "${store.store_name}" permanently? This can also delete related products, pages and orders because of database cascade rules.`
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {

      const response =
        await fetch(
          `/api/stores/${store.id}`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
          "Unable to delete store."
        );
      }

      router.push(
        "/admin/stores"
      );

      router.refresh();

    } catch (error) {

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete store."
      );

      setDeleting(false);
    }
  }


  return (
    <div>

      <form
        onSubmit={saveSettings}
        style={{
          display: "grid",
          gap: 18
        }}
      >

        <Field
          label="Store Name"
          value={storeName}
          onChange={setStoreName}
        />

        <Field
          label="Store Slug"
          value={slug}
          onChange={setSlug}
        />

        <Field
          label="Custom Domain"
          value={customDomain}
          onChange={setCustomDomain}
          placeholder="example.com"
        />

        <Field
          label="Logo URL"
          value={logoUrl}
          onChange={setLogoUrl}
          placeholder="https://..."
        />

        <div>
          <label
            style={{
              display: "block",
              fontWeight: 700,
              marginBottom: 8
            }}
          >
            Primary Color
          </label>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center"
            }}
          >

            <input
              type="color"
              value={primaryColor}
              onChange={(event) =>
                setPrimaryColor(
                  event.target.value
                )
              }
              style={{
                width: 55,
                height: 42
              }}
            />

            <input
              value={primaryColor}
              onChange={(event) =>
                setPrimaryColor(
                  event.target.value
                )
              }
              style={inputStyle}
            />

          </div>
        </div>


        <Field
          label="WhatsApp Number"
          value={whatsappNumber}
          onChange={setWhatsappNumber}
          placeholder="923001234567"
        />


        <div>
          <label
            style={{
              display: "block",
              fontWeight: 700,
              marginBottom: 8
            }}
          >
            Shipping Fee
          </label>

          <input
            type="number"
            min="0"
            value={shippingFee}
            onChange={(event) =>
              setShippingFee(
                event.target.value
              )
            }
            style={inputStyle}
          />
        </div>


        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 700
          }}
        >

          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) =>
              setIsActive(
                event.target.checked
              )
            }
          />

          Store Active

        </label>


        <button
          type="submit"
          disabled={saving}
          style={{
            width: "fit-content",
            padding:
              "12px 20px",
            border: "none",
            borderRadius: 9,
            background: "#2563eb",
            color: "#fff",
            fontWeight: 800
          }}
        >
          {saving
            ? "Saving..."
            : "Save Store Settings"}
        </button>


        {message && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background:
                "#f3f4f6",
              fontWeight: 700
            }}
          >
            {message}
          </div>
        )}

      </form>


      <div
        style={{
          marginTop: 40,
          padding: 20,
          border:
            "1px solid #fecaca",
          borderRadius: 12,
          background:
            "#fff5f5"
        }}
      >

        <h2>
          Danger Zone
        </h2>

        <p
          style={{
            color: "#7f1d1d"
          }}
        >
          Permanently delete this store
          and its related data.
        </p>

        <button
          type="button"
          onClick={deleteStore}
          disabled={deleting}
          style={{
            padding:
              "11px 18px",
            border: "none",
            borderRadius: 8,
            background: "#dc2626",
            color: "#fff",
            fontWeight: 800
          }}
        >
          {deleting
            ? "Deleting..."
            : "Delete Store"}
        </button>

      </div>

    </div>
  );
}


function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
}) {

  return (
    <div>

      <label
        style={{
          display: "block",
          fontWeight: 700,
          marginBottom: 8
        }}
      >
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        style={inputStyle}
      />

    </div>
  );
}


const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  border:
    "1px solid #d1d5db",
  borderRadius: 8,
  background: "#fff"
};
