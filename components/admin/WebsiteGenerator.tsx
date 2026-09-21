"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  BusinessType,
  TemplateType
} from "@/types/store";

const businessOptions: Array<{
  value: BusinessType;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    value: "general",
    label: "General Store",
    icon: "🛍️",
    description: "Multi-purpose online store"
  },
  {
    value: "garments",
    label: "Garments",
    icon: "👕",
    description: "Clothing and fashion"
  },
  {
    value: "shoes",
    label: "Shoes",
    icon: "👟",
    description: "Footwear store"
  },
  {
    value: "watches",
    label: "Watches",
    icon: "⌚",
    description: "Watches and accessories"
  },
  {
    value: "electronics",
    label: "Electronics",
    icon: "📱",
    description: "Gadgets and electronics"
  }
];

const templateOptions: Array<{
  value: TemplateType;
  label: string;
  description: string;
}> = [
  {
    value: "classic",
    label: "Classic",
    description:
      "Clean and familiar shopping layout."
  },
  {
    value: "modern",
    label: "Modern",
    description:
      "Bold, spacious and modern storefront."
  },
  {
    value: "minimal",
    label: "Minimal",
    description:
      "Simple and product-focused design."
  }
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function WebsiteGenerator() {
  const router = useRouter();

  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");

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

  const [businessType, setBusinessType] =
    useState<BusinessType>("general");

  const [templateType, setTemplateType] =
    useState<TemplateType>("classic");

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const selectedBusiness = useMemo(
    () =>
      businessOptions.find(
        (item) => item.value === businessType
      ),
    [businessType]
  );

  function handleStoreNameChange(
    value: string
  ) {
    setStoreName(value);

    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(
    value: string
  ) {
    setSlugManuallyEdited(true);
    setSlug(slugify(value));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/website-generator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            store_name: storeName,
            slug,
            custom_domain: customDomain,
            logo_url: logoUrl,
            primary_color: primaryColor,
            whatsapp_number: whatsappNumber,
            shipping_fee: Number(shippingFee || 0),

            business_type: businessType,
            template_type: templateType
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Website generation failed."
        );
      }

      setMessage(
        "Client website successfully generated."
      );

      router.push(
        `/admin/stores/${data.website.slug}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "20px 0 50px"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 24
        }}
      >
        {/* Store Information */}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 22
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 6
            }}
          >
            Store Information
          </h2>

          <p
            style={{
              marginTop: 0,
              color: "#6b7280"
            }}
          >
            Basic information for the new client website.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16
            }}
          >
            <label>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Store Name
              </div>

              <input
                value={storeName}
                onChange={(event) =>
                  handleStoreNameChange(
                    event.target.value
                  )
                }
                placeholder="My Fashion Store"
                required
                style={inputStyle}
              />
            </label>

            <label>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Store Slug
              </div>

              <input
                value={slug}
                onChange={(event) =>
                  handleSlugChange(
                    event.target.value
                  )
                }
                placeholder="my-fashion-store"
                required
                style={inputStyle}
              />
            </label>

            <label>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Custom Domain
              </div>

              <input
                value={customDomain}
                onChange={(event) =>
                  setCustomDomain(
                    event.target.value
                  )
                }
                placeholder="www.example.com"
                style={inputStyle}
              />
            </label>

            <label>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Logo URL
              </div>

              <input
                value={logoUrl}
                onChange={(event) =>
                  setLogoUrl(event.target.value)
                }
                placeholder="https://..."
                style={inputStyle}
              />
            </label>

            <label>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                WhatsApp Number
              </div>

              <input
                value={whatsappNumber}
                onChange={(event) =>
                  setWhatsappNumber(
                    event.target.value
                  )
                }
                placeholder="923001234567"
                style={inputStyle}
              />
            </label>

            <label>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Shipping Fee
              </div>

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
            </label>

            <label>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Primary Color
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10
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
                    width: 52,
                    height: 44,
                    padding: 2,
                    border: "1px solid #d1d5db",
                    borderRadius: 8
                  }}
                />

                <input
                  value={primaryColor}
                  onChange={(event) =>
                    setPrimaryColor(
                      event.target.value
                    )
                  }
                  style={{
                    ...inputStyle,
                    flex: 1
                  }}
                />
              </div>
            </label>
          </div>
        </section>

        {/* Business Type */}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 22
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 6
            }}
          >
            Business Type
          </h2>

          <p
            style={{
              marginTop: 0,
              color: "#6b7280"
            }}
          >
            Choose the type of business. The generated
            homepage content will be customized automatically.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 12
            }}
          >
            {businessOptions.map((option) => {
              const selected =
                businessType === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setBusinessType(
                      option.value
                    )
                  }
                  style={{
                    textAlign: "left",
                    padding: 16,
                    borderRadius: 12,
                    border: selected
                      ? `2px solid ${primaryColor}`
                      : "1px solid #d1d5db",
                    background: selected
                      ? "#f0fdf4"
                      : "#fff",
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      fontSize: 30,
                      marginBottom: 8
                    }}
                  >
                    {option.icon}
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: 5
                    }}
                  >
                    {option.label}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#6b7280",
                      lineHeight: 1.4
                    }}
                  >
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedBusiness && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                background: "#f9fafb",
                borderRadius: 10,
                fontSize: 14
              }}
            >
              Selected:{" "}
              <strong>
                {selectedBusiness.label}
              </strong>
            </div>
          )}
        </section>

        {/* Template */}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 22
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 6
            }}
          >
            Website Template
          </h2>

          <p
            style={{
              marginTop: 0,
              color: "#6b7280"
            }}
          >
            Select the visual layout for this client website.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14
            }}
          >
            {templateOptions.map((option) => {
              const selected =
                templateType === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setTemplateType(
                      option.value
                    )
                  }
                  style={{
                    textAlign: "left",
                    padding: 18,
                    borderRadius: 12,
                    border: selected
                      ? `2px solid ${primaryColor}`
                      : "1px solid #d1d5db",
                    background: selected
                      ? "#f0fdf4"
                      : "#fff",
                    cursor: "pointer"
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      marginBottom: 7
                    }}
                  >
                    {option.label}
                  </div>

                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: 14,
                      lineHeight: 1.5
                    }}
                  >
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Generate */}

        <section
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 22
          }}
        >
          {error && (
            <div
              style={{
                marginBottom: 14,
                padding: 12,
                borderRadius: 8,
                background: "#fef2f2",
                color: "#b91c1c"
              }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              style={{
                marginBottom: 14,
                padding: 12,
                borderRadius: 8,
                background: "#f0fdf4",
                color: "#166534"
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 18px",
              border: 0,
              borderRadius: 10,
              background: primaryColor,
              color: "#fff",
              fontSize: 16,
              fontWeight: 800,
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading
              ? "Generating Website..."
              : "Generate Client Website"}
          </button>
        </section>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  outline: "none",
  background: "#fff"
};
