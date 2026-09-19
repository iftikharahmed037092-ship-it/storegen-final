"use client";

import Link from "next/link";
import {
  useEffect,
  useState
} from "react";

import {
  CartProvider,
  useCart
} from "@/components/storefront/CartProvider";

import StoreHeader
  from "@/components/storefront/StoreHeader";

import {
  getStoreBySlug
} from "@/lib/stores";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function CartPage({
  params
}: Props) {
  const [
    slug,
    setSlug
  ] = useState("");

  useEffect(() => {
    params.then(
      value =>
        setSlug(
          value.slug
        )
    );
  }, [params]);

  if (!slug) {
    return null;
  }

  return (
    <CartPageLoader
      slug={slug}
    />
  );
}

function CartPageLoader({
  slug
}: {
  slug: string;
}) {
  const [
    store,
    setStore
  ] = useState<any>(null);

  useEffect(() => {
    getStoreBySlug(
      slug
    ).then(setStore);
  }, [slug]);

  if (!store) {
    return (
      <div
        style={{
          padding: 40
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <CartProvider
      storeId={
        store.id
      }
    >
      <StoreHeader
        storeName={
          store.store_name
        }
        storeSlug={
          store.slug
        }
        logoUrl={
          store.logo_url
        }
        primaryColor={
          store.primary_color
        }
      />

      <CartContent
        slug={slug}
      />
    </CartProvider>
  );
}

function CartContent({
  slug
}: {
  slug: string;
}) {
  const {
    items,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  return (
    <main
      style={{
        maxWidth:
          1000,
        margin:
          "0 auto",
        padding:
          "40px 16px"
      }}
    >
      <h1>
        Shopping Cart
      </h1>

      {!items.length ? (
        <div
          style={{
            padding:
              "50px 0",
            textAlign:
              "center"
          }}
        >
          <p>
            Your cart is empty.
          </p>

          <Link
            href={`/s/${slug}/products`}
            style={{
              display:
                "inline-block",
              marginTop: 12,
              padding:
                "12px 18px",
              borderRadius:
                10,
              background:
                "#16a34a",
              color:
                "#ffffff",
              fontWeight:
                700
            }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div
            style={{
              display:
                "grid",
              gap: 12
            }}
          >
            {items.map(
              item => {
                const image =
                  item.product
                    .image_url ||
                  item.product
                    .image_urls?.[0];

                return (
                  <div
                    key={
                      item.product
                        .id
                    }
                    style={{
                      display:
                        "flex",
                      gap: 14,
                      alignItems:
                        "center",
                      padding:
                        14,
                      border:
                        "1px solid #e5e7eb",
                      borderRadius:
                        14,
                      background:
                        "#ffffff"
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        flex:
                          "0 0 80px",
                        background:
                          "#f3f4f6",
                        borderRadius:
                          10,
                        overflow:
                          "hidden"
                      }}
                    >
                      {image && (
                        <img
                          src={
                            image
                          }
                          alt=""
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "cover"
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1
                      }}
                    >
                      <strong>
                        {
                          item
                            .product
                            .name
                        }
                      </strong>

                      <div
                        style={{
                          marginTop: 5
                        }}
                      >
                        Rs.{" "}
                        {item
                          .product
                          .price
                          .toLocaleString()}
                      </div>
                    </div>

                    <input
                      type="number"
                      min="1"
                      max={
                        item
                          .product
                          .stock
                      }
                      value={
                        item.quantity
                      }
                      onChange={e =>
                        updateQuantity(
                          item
                            .product
                            .id,
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                      style={{
                        width: 65,
                        padding:
                          "8px",
                        border:
                          "1px solid #d1d5db",
                        borderRadius:
                          8
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(
                          item
                            .product
                            .id
                        )
                      }
                      style={{
                        border: 0,
                        background:
                          "transparent",
                        color:
                          "#dc2626",
                        fontWeight:
                          700
                      }}
                    >
                      Remove
                    </button>
                  </div>
                );
              }
            )}
          </div>

          <div
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius:
                14,
              background:
                "#f9fafb"
            }}
          >
            <h2>
              Total: Rs.{" "}
              {totalPrice.toLocaleString()}
            </h2>

            <div
              style={{
                display:
                  "flex",
                gap: 10,
                flexWrap:
                  "wrap"
              }}
            >
              <Link
                href={`/s/${slug}/checkout`}
                style={{
                  padding:
                    "13px 20px",
                  borderRadius:
                    10,
                  background:
                    "#16a34a",
                  color:
                    "#ffffff",
                  fontWeight:
                    800
                }}
              >
                Checkout
              </Link>

              <button
                type="button"
                onClick={
                  clearCart
                }
                style={{
                  padding:
                    "13px 20px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    10,
                  background:
                    "#ffffff",
                  fontWeight:
                    700
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
