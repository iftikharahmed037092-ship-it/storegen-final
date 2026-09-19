"use client";

import {
  FormEvent,
  useEffect,
  useState
} from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

interface Props {
  storeId: string;
  storeName: string;
}

export default function ProductManager({
  storeId,
  storeName
}: Props) {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadProducts() {
    setLoading(true);

    try {
      const response =
        await fetch(
          `/api/products?storeId=${encodeURIComponent(
            storeId
          )}`,
          {
            cache: "no-store"
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to load products."
        );
      }

      setProducts(
        result.products || []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [storeId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!price) {
      setError(
        "Product price is required."
      );
      return;
    }

    setSaving(true);

    try {
      const response =
        await fetch(
          "/api/products",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              storeId,
              name: name.trim(),
              price: Number(price),
              imageUrl:
                imageUrl.trim()
            })
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to create product."
        );
      }

      setName("");
      setPrice("");
      setImageUrl("");

      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        border:
          "1px solid #e5e7eb"
      }}
    >
      <h2>
        Products — {storeName}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "12px",
          marginBottom: "30px"
        }}
      >
        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Product name"
          style={inputStyle}
        />

        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          placeholder="Price"
          style={inputStyle}
        />

        <input
          value={imageUrl}
          onChange={(e) =>
            setImageUrl(
              e.target.value
            )
          }
          placeholder="Product image URL"
          style={inputStyle}
        />

        {error && (
          <div
            style={{
              padding: "10px",
              borderRadius: "8px",
              background:
                "#fee2e2",
              color: "#991b1b"
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          style={buttonStyle}
        >
          {saving
            ? "Adding..."
            : "Add Product"}
        </button>
      </form>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>
          No products have been
          added yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px"
          }}
        >
          {products.map(
            (product) => (
              <div
                key={product.id}
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius:
                    "12px",
                  overflow:
                    "hidden"
                }}
              >
                {product.image_url ? (
                  <img
                    src={
                      product.image_url
                    }
                    alt={
                      product.name
                    }
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit:
                        "cover"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "180px",
                      background:
                        "#f3f4f6",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center"
                    }}
                  >
                    No Image
                  </div>
                )}

                <div
                  style={{
                    padding:
                      "15px"
                  }}
                >
                  <h3>
                    {
                      product.name
                    }
                  </h3>

                  <strong>
                    Rs.{" "}
                    {product.price.toLocaleString()}
                  </strong>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  border:
    "1px solid #d1d5db",
  borderRadius: "9px"
};

const buttonStyle = {
  padding: "12px",
  border: 0,
  borderRadius: "9px",
  background: "#16a34a",
  color: "#ffffff",
  fontWeight: 700
};
