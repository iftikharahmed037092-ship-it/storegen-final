"use client";

import {
  useState
} from "react";

import type {
  Product
} from "@/types/product";

interface ProductEditorProps {
  storeId: string;

  product?: Product | null;

  onSaved: (
    product: Product
  ) => void;

  onCancel: () => void;
}

export default function ProductEditor({
  storeId,
  product,
  onSaved,
  onCancel
}: ProductEditorProps) {
  const [name, setName] =
    useState(
      product?.name ?? ""
    );

  const [price, setPrice] =
    useState(
      product?.price?.toString() ?? ""
    );

  const [oldPrice, setOldPrice] =
    useState(
      product?.old_price?.toString() ?? ""
    );

  const [images, setImages] =
    useState<string[]>(
      product?.image_urls?.length
        ? product.image_urls
        : product?.image_url
          ? [product.image_url]
          : []
    );

  const [description, setDescription] =
    useState(
      product?.description ?? ""
    );

  const [stock, setStock] =
    useState(
      product?.stock?.toString() ?? "0"
    );

  const [sku, setSku] =
    useState(
      product?.sku ?? ""
    );

  const [published, setPublished] =
    useState(
      product?.published ?? true
    );

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function uploadImages(
    files: FileList | null
  ) {
    if (!files?.length) {
      return;
    }

    setError("");
    setUploading(true);

    try {
      const selectedFiles =
        Array.from(files);

      for (const file of selectedFiles) {
        if (
          !file.type.startsWith(
            "image/"
          )
        ) {
          throw new Error(
            `${file.name} is not an image.`
          );
        }

        if (
          file.size >
          5 * 1024 * 1024
        ) {
          throw new Error(
            `${file.name} is larger than 5MB.`
          );
        }

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "storeId",
          storeId
        );

        const response =
          await fetch(
            "/api/products/upload",
            {
              method: "POST",
              body: formData
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Upload failed"
          );
        }

        setImages(
          current => [
            ...current,
            data.url
          ]
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(
    index: number
  ) {
    setImages(
      current =>
        current.filter(
          (_, i) =>
            i !== index
        )
    );
  }

  function setMainImage(
    index: number
  ) {
    setImages(
      current => {
        const copy = [
          ...current
        ];

        const [
          selected
        ] = copy.splice(
          index,
          1
        );

        return [
          selected,
          ...copy
        ];
      }
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (
      !price ||
      Number(price) < 0
    ) {
      setError(
        "Please enter a valid price."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        store_id: storeId,

        name:
          name.trim(),

        price:
          Number(price),

        old_price:
          oldPrice.trim() === ""
            ? null
            : Number(oldPrice),

        image_url:
          images[0] ?? null,

        image_urls:
          images,

        description:
          description.trim() === ""
            ? null
            : description.trim(),

        stock:
          Number(stock || 0),

        sku:
          sku.trim() === ""
            ? null
            : sku.trim(),

        published
      };

      const response =
        await fetch(
          product
            ? `/api/products/${product.id}`
            : "/api/products",
          {
            method:
              product
                ? "PATCH"
                : "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                payload
              )
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save product"
        );
      }

      onSaved(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={formStyle}
    >
      <h2
        style={{
          marginTop: 0
        }}
      >
        {product
          ? "Edit Product"
          : "Add Product"}
      </h2>

      {error && (
        <div
          style={{
            background:
              "#fee2e2",
            color:
              "#991b1b",
            padding: 12,
            borderRadius: 10,
            marginBottom: 16
          }}
        >
          {error}
        </div>
      )}

      <label style={labelStyle}>
        Product Name

        <input
          value={name}
          onChange={e =>
            setName(
              e.target.value
            )
          }
          placeholder="Product name"
          style={inputStyle}
        />
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16
        }}
      >
        <label style={labelStyle}>
          Price

          <input
            type="number"
            min="0"
            value={price}
            onChange={e =>
              setPrice(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Old Price

          <input
            type="number"
            min="0"
            value={oldPrice}
            onChange={e =>
              setOldPrice(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </label>
      </div>

      <div>
        <div
          style={{
            fontWeight: 700,
            marginBottom: 8
          }}
        >
          Product Images
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e =>
            uploadImages(
              e.target.files
            )
          }
        />

        <div
          style={{
            fontSize: 13,
            color: "#6b7280",
            marginTop: 6
          }}
        >
          Maximum 5MB per image.
          First image is the
          main product image.
        </div>

        {uploading && (
          <div
            style={{
              marginTop: 12,
              fontWeight: 700
            }}
          >
            Uploading images...
          </div>
        )}

        {images.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(130px, 1fr))",
              gap: 12,
              marginTop: 16
            }}
          >
            {images.map(
              (image, index) => (
                <div
                  key={`${image}-${index}`}
                  style={{
                    border:
                      index === 0
                        ? "3px solid #16a34a"
                        : "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 6
                  }}
                >
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit:
                        "cover",
                      borderRadius: 8
                    }}
                  />

                  <div
                    style={{
                      display:
                        "flex",
                      gap: 6,
                      marginTop: 6,
                      flexWrap:
                        "wrap"
                    }}
                  >
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setMainImage(
                            index
                          )
                        }
                        style={
                          smallButtonStyle
                        }
                      >
                        Main
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          index
                        )
                      }
                      style={{
                        ...smallButtonStyle,
                        color:
                          "#b91c1c"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <label style={labelStyle}>
        Description

        <textarea
          value={description}
          onChange={e =>
            setDescription(
              e.target.value
            )
          }
          rows={5}
          placeholder="Product description..."
          style={{
            ...inputStyle,
            resize: "vertical"
          }}
        />
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16
        }}
      >
        <label style={labelStyle}>
          Stock

          <input
            type="number"
            min="0"
            value={stock}
            onChange={e =>
              setStock(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          SKU

          <input
            value={sku}
            onChange={e =>
              setSku(
                e.target.value
              )
            }
            placeholder="SKU-001"
            style={inputStyle}
          />
        </label>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18
        }}
      >
        <input
          type="checkbox"
          checked={published}
          onChange={e =>
            setPublished(
              e.target.checked
            )
          }
        />

        Publish product
      </label>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap"
        }}
      >
        <button
          type="submit"
          disabled={
            saving ||
            uploading
          }
          style={{
            padding:
              "12px 20px",
            border: 0,
            borderRadius: 10,
            background:
              "#16a34a",
            color: "#fff",
            fontWeight: 700
          }}
        >
          {saving
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={{
            padding:
              "12px 20px",
            border:
              "1px solid #d1d5db",
            borderRadius: 10,
            background:
              "#fff"
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const formStyle:
  React.CSSProperties = {
    background: "#fff",
    border:
      "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24
  };

const labelStyle:
  React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    marginBottom: 16
  };

const inputStyle:
  React.CSSProperties = {
    display: "block",
    width: "100%",
    marginTop: 7,
    padding:
      "12px 14px",
    border:
      "1px solid #d1d5db",
    borderRadius: 10,
    background: "#fff"
  };

const smallButtonStyle:
  React.CSSProperties = {
    padding:
      "6px 9px",
    border:
      "1px solid #d1d5db",
    borderRadius: 7,
    background: "#fff",
    fontSize: 12,
    fontWeight: 600
  };
