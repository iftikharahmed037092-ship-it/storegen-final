"use client";

import {
  useState
} from "react";

import {
  useRouter
} from "next/navigation";


export default function WebsiteGenerator() {

  const router =
    useRouter();


  const [storeName, setStoreName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [customDomain, setCustomDomain] =
    useState("");

  const [logoUrl, setLogoUrl] =
    useState("");

  const [primaryColor, setPrimaryColor] =
    useState("#16a34a");

  const [whatsappNumber, setWhatsappNumber] =
    useState("");

  const [shippingFee, setShippingFee] =
    useState("0");


  const [generating, setGenerating] =
    useState(false);

  const [message, setMessage] =
    useState("");


  function createSlug(
    value: string
  ) {

    const generated =
      value
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        );

    setSlug(
      generated
    );
  }


  async function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault();

    setGenerating(true);
    setMessage("");


    try {

      const response =
        await fetch(
          "/api/website-generator",
          {
            method: "POST",

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
                customDomain.trim(),

              logo_url:
                logoUrl.trim(),

              primary_color:
                primaryColor,

              whatsapp_number:
                whatsappNumber.trim(),

              shipping_fee:
                Number(
                  shippingFee
                ) || 0

            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ||
          "Website generation failed."
        );
      }


      setMessage(
        "Website generated successfully."
      );


      const generatedSlug =
        data.website.slug;


      router.push(
        `/admin/stores/${generatedSlug}`
      );


    } catch (error) {

      setMessage(
        error instanceof Error
          ? error.message
          : "Website generation failed."
      );

    } finally {

      setGenerating(false);
    }
  }


  return (
    <div
      style={{
        maxWidth: 800,
        background: "#fff",
        border:
          "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 25
      }}
    >

      <h1>
        Create Client Website
      </h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Generate a new client store
        from the master template.
      </p>


      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 17,
          marginTop: 25
        }}
      >

        <Field
          label="Store Name"
          value={storeName}
          onChange={(value) => {
            setStoreName(value);

            if (!slug) {
              createSlug(value);
            }
          }}
          required
          placeholder="Ali Garments"
        />


        <Field
          label="Store Slug"
          value={slug}
          onChange={setSlug}
          required
          placeholder="ali-garments"
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
            style={labelStyle}
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


        <Field
          label="Shipping Fee"
          value={shippingFee}
          onChange={setShippingFee}
          type="number"
          placeholder="0"
        />


        <button
          type="submit"
          disabled={generating}
          style={{
            padding:
              "13px 20px",
            border: "none",
            borderRadius: 9,
            background:
              primaryColor,
            color: "#fff",
            fontWeight: 900,
            fontSize: 15
          }}
        >
          {generating
            ? "Generating Website..."
            : "Generate Client Website"}
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

    </div>
  );
}


function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {

  return (
    <div>

      <label
        style={labelStyle}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
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


const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 800,
  marginBottom: 7
};


const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  border:
    "1px solid #d1d5db",
  borderRadius: 8,
  background: "#fff"
};
