"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "./CartProvider";
import WhatsAppOrderForm from "./WhatsAppOrderForm";

export default function ProductDetails({
  product,
  storeSlug,
  storeId,
  primaryColor,
}: {
  product: Product;
  storeSlug: string;
  storeId: string;
  primaryColor: string;
}) {
  const { addToCart, buyNow } = useCart();
  const [showWhatsAppOrder, setShowWhatsAppOrder] = useState(false);

  const images = product.image_urls?.length
   ? product.image_urls
    : product.image_url
   ? [product.image_url]
    : [];

  const [selectedImage, setSelectedImage] = useState(images[0]?? "");

  const hasDiscount = product.old_price!== null && product.old_price > product.price;

  const discount = hasDiscount
   ? Math.round(((product.old_price! - product.price) / product.old_price!) * 100)
    : 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 40,
      }}
    >
      <div>
        <div
          style={{
            aspectRatio: "1 / 1",
            background: "#f3f4f6",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {selectedImage? (
            <img
              src={selectedImage}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                display: "grid",
                placeItems: "center",
                color: "#9ca3af",
              }}
            >
              No Image
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 12,
              overflowX: "auto",
            }}
          >
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                style={{
                  flex: "0 0 72px",
                  height: 72,
                  padding: 2,
                  border: selectedImage === image? "2px solid #16a34a" : "1px solid #d1d5db",
                  borderRadius: 8,
                  background: "#fff",
                }}
              >
                <img
                  src={image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 5,
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            display: "inline-flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {hasDiscount && (
            <span
              style={{
                background: "#dc2626",
                color: "#ffffff",
                padding: "5px 8px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {discount}% OFF
            </span>
          )}

          {product.stock > 0? (
            <span
              style={{
                color: "#15803d",
                fontWeight: 700,
              }}
            >
              In Stock
            </span>
          ) : (
            <span
              style={{
                color: "#b91c1c",
                fontWeight: 700,
              }}
            >
              Out of Stock
            </span>
          )}
        </div>

        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            margin: "14px 0",
          }}
        >
          {product.name}
        </h1>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <strong
            style={{
              fontSize: 30,
            }}
          >
            Rs. {product.price.toLocaleString()}
          </strong>

          {hasDiscount && (
            <span
              style={{
                textDecoration: "line-through",
                color: "#9ca3af",
              }}
            >
              Rs. {product.old_price!.toLocaleString()}
            </span>
          )}
        </div>

        {product.description && (
          <div
            style={{
              marginTop: 24,
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            {product.description}
          </div>
        )}

        {/* --- NEW 2 BUTTONS --- */}
        <div
          style={{
            marginTop: 28,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => buyNow(product)}
            style={{
              flex: "1 1 220px",
              padding: "14px 22px",
              border: 0,
              borderRadius: 10,
              background: product.stock > 0? primaryColor || "#16a34a" : "#9ca3af",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 15,
              cursor: product.stock > 0? "pointer" : "not-allowed",
            }}
          >
            🛒 Order on Website
          </button>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => setShowWhatsAppOrder(true)}
            style={{
              flex: "1 1 220px",
              padding: "14px 22px",
              border: 0,
              borderRadius: 10,
              background: "#25D366",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              cursor: product.stock > 0? "pointer" : "not-allowed",
            }}
          >
            💬 Order on WhatsApp
          </button>
        </div>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product)}
            style={{
              flex: "1 1 120px",
              padding: "12px 22px",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              background: "#fff",
              fontWeight: 700,
            }}
          >
            Add to Cart
          </button>

          <Link
            href={`/s/${storeSlug}/cart`}
            style={{
              flex: "1 1 120px",
              padding: "12px 22px",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            View Cart
          </Link>
        </div>

        {showWhatsAppOrder && (
          <WhatsAppOrderForm
            product={product}
            storeId={storeId}
            storeSlug={storeSlug}
            primaryColor={primaryColor}
            onClose={() => setShowWhatsAppOrder(false)}
          />
        )}
      </div>
    </div>
  );
}
