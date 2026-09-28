// @ts-nocheck

import { notFound } from "next/navigation";

import { getStoreBySlug } from "@/lib/stores";
import { getPageByStoreId } from "@/lib/pages";
import { getProductsByStoreId } from "@/lib/products";

import type { EditorBlock } from "@/types/page";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StorePage({
  params,
}: Props) {
  const { slug } = await params;

  const store =
    await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const page =
    await getPageByStoreId(store.id);

  const products =
    await getProductsByStoreId(store.id);

  let blocks: EditorBlock[] = [];

  if (page?.page_data?.content) {
    blocks =
      page.page_data.content;
  }

  /*
   * صرف published products live store پر دکھائیں۔
   */

  const publishedProducts =
    products.filter(
      (product: any) =>
        product.published !== false
    );

  return (
    <main
      style={
        {
          minHeight: "100vh",
          "--primary":
            store.primary_color ||
            "#16a34a",
        } as React.CSSProperties
      }
    >
      {blocks.map(
        (block: EditorBlock) => (
          <LiveBlock
            key={block.id}
            block={block}
            storeName={
              store.store_name
            }
            storeSlug={store.slug}
            primary={
              store.primary_color ||
              "#16a34a"
            }
            whatsappNumber={
              store.whatsapp_number
            }
            products={
              publishedProducts
            }
          />
        )
      )}

      {blocks.length === 0 && (
        <div
          style={{
            padding: "100px 20px",
            textAlign: "center",
          }}
        >
          <h1>
            {store.store_name}
          </h1>

          <p>
            This store has not been
            published yet.
          </p>
        </div>
      )}
    </main>
  );
}

function LiveBlock({
  block,
  storeName,
  storeSlug,
  primary,
  whatsappNumber,
  products,
}: {
  block: EditorBlock;
  storeName: string;
  storeSlug: string;
  primary: string;
  whatsappNumber: string | null;
  products: any[];
}) {
  const props =
    (block.props || {}) as any;

  const style =
    (block.style || {}) as any;

  /*
   * Editor Style Settings
   *
   * یہی وہ حصہ ہے جو پہلے Live Site پر
   * apply نہیں ہو رہا تھا۔
   */

  const sectionStyle: any = {
    backgroundColor:
      style.backgroundColor ||
      "#ffffff",

    color:
      style.textColor ||
      "#111827",

    paddingTop:
      style.paddingTop ?? 40,

    paddingRight:
      style.paddingRight ?? 20,

    paddingBottom:
      style.paddingBottom ?? 40,

    paddingLeft:
      style.paddingLeft ?? 20,

    marginTop:
      style.marginTop ?? 0,

    marginBottom:
      style.marginBottom ?? 0,

    textAlign:
      style.textAlign ||
      "center",

    boxSizing: "border-box",
  };

  const innerStyle: any = {
    width: "100%",
    maxWidth:
      style.maxWidth || 1200,

    margin:
      "0 auto",

    boxSizing:
      "border-box",
  };

  /*
   * HEADER
   */

  if (block.type === "Header") {
    return (
      <header
        style={{
          ...sectionStyle,
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            ...innerStyle,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 20,
          }}
        >
          <strong>
            {String(
              props.logoText ||
                storeName
            )}
          </strong>

          <nav
            style={{
              display: "flex",
              gap: 18,
              alignItems:
                "center",
              flexWrap:
                "wrap",
            }}
          >
            <a href="#">
              Home
            </a>

            <a href="#products">
              Products
            </a>

            <a href="#contact">
              Contact
            </a>

            {props.showCart && (
              <a href="#cart">
                Cart
              </a>
            )}
          </nav>
        </div>
      </header>
    );
  }

  /*
   * HERO
   */

  if (block.type === "Hero") {
    return (
      <section
        style={{
          ...sectionStyle,
          paddingTop:
            style.paddingTop ??
            90,
          paddingBottom:
            style.paddingBottom ??
            90,

          backgroundImage:
            props.backgroundImage
              ? `url(${props.backgroundImage})`
              : undefined,

          backgroundSize:
            "cover",

          backgroundPosition:
            "center",
        }}
      >
        <div
          style={innerStyle}
        >
          <h1>
            {String(
              props.title ||
                "Welcome"
            )}
          </h1>

          <p>
            {String(
              props.subtitle ||
                ""
            )}
          </p>

          <a
            href={String(
              props.buttonLink ||
                "#products"
            )}
            style={{
              display:
                "inline-block",

              marginTop: 15,

              padding:
                "12px 20px",

              borderRadius: 8,

              background:
                props.buttonColor ||
                primary,

              color: "#ffffff",

              fontWeight: 700,

              textDecoration:
                "none",
            }}
          >
            {String(
              props.buttonText ||
                "Shop Now"
            )}
          </a>
        </div>
      </section>
    );
  }

  /*
   * PRODUCTS
   */

  if (block.type === "Products") {
    const limit =
      Math.max(
        1,
        Number(
          props.limit || 8
        )
      );

    const visibleProducts =
      products.slice(
        0,
        limit
      );

    return (
      <section
        id="products"
        style={sectionStyle}
      >
        <div
          style={innerStyle}
        >
          <h2>
            {String(
              props.title ||
                "Featured Products"
            )}
          </h2>

          {visibleProducts.length ===
          0 ? (
            <div
              style={{
                padding: 40,
                border:
                  "1px solid #e5e7eb",
                borderRadius: 12,
                background:
                  "#f9fafb",
              }}
            >
              <p>
                No products
                available yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",

                gap: 18,

                textAlign:
                  "left",
              }}
            >
              {visibleProducts.map(
                (product: any) => (
                  <a
                    key={
                      product.id
                    }
                    href={`/s/${storeSlug}/product/${product.id}`}
                    style={{
                      display:
                        "block",

                      textDecoration:
                        "none",

                      color:
                        "inherit",

                      border:
                        "1px solid #e5e7eb",

                      borderRadius: 12,

                      overflow:
                        "hidden",

                      background:
                        "#ffffff",
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
                          width:
                            "100%",

                          height: 200,

                          objectFit:
                            "cover",

                          display:
                            "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 200,
                          background:
                            "#f3f4f6",
                          display:
                            "grid",
                          placeItems:
                            "center",
                          color:
                            "#6b7280",
                        }}
                      >
                        No Image
                      </div>
                    )}

                    <div
                      style={{
                        padding: 15,
                      }}
                    >
                      <h3
                        style={{
                          margin:
                            "0 0 8px",
                          fontSize: 16,
                        }}
                      >
                        {product.name}
                      </h3>

                      <strong>
                        Rs.{" "}
                        {Number(
                          product.price ||
                            0
                        ).toLocaleString()}
                      </strong>

                      {props.showOldPrice &&
                        product.old_price && (
                          <span
                            style={{
                              marginLeft: 8,
                              color:
                                "#9ca3af",
                              textDecoration:
                                "line-through",
                              fontSize: 13,
                            }}
                          >
                            Rs.{" "}
                            {Number(
                              product.old_price
                            ).toLocaleString()}
                          </span>
                        )}
                    </div>
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  /*
   * FEATURES
   */

  if (block.type === "Features") {
    const items =
      Array.isArray(
        props.items
      )
        ? props.items
        : [];

    return (
      <section
        style={sectionStyle}
      >
        <div
          style={innerStyle}
        >
          <h2>
            {String(
              props.title ||
                "Why Shop With Us?"
            )}
          </h2>

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(200px,1fr))",

              gap: 18,

              textAlign:
                "left",
            }}
          >
            {items.map(
              (
                item: any,
                index: number
              ) => (
                <div
                  key={index}
                  style={{
                    padding: 20,
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      12,
                    background:
                      "#ffffff",
                  }}
                >
                  <h3>
                    {String(
                      item.title ||
                        ""
                    )}
                  </h3>

                  <p>
                    {String(
                      item.text ||
                        item.description ||
                        ""
                    )}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  /*
   * WHATSAPP ORDER
   */

  if (
    block.type ===
    "WhatsAppOrder"
  ) {
    const phone =
      String(
        props.phone ||
          whatsappNumber ||
          ""
      )
        .replace(
          /[^0-9]/g,
          ""
        );

    const message =
      String(
        props.message ||
          "Hello, I want to place an order."
      );

    const whatsappUrl =
      phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(
            message
          )}`
        : "#";

    return (
      <section
        style={sectionStyle}
      >
        <div
          style={innerStyle}
        >
          <h2>
            {String(
              props.title ||
                "Order on WhatsApp"
            )}
          </h2>

          {props.description && (
            <p>
              {String(
                props.description
              )}
            </p>
          )}

          <a
            href={
              whatsappUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:
                "inline-block",

              marginTop: 15,

              padding:
                "12px 20px",

              borderRadius: 8,

              background:
                "#16a34a",

              color:
                "#ffffff",

              fontWeight: 700,

              textDecoration:
                "none",
            }}
          >
            {String(
              props.buttonText ||
                "Order on WhatsApp"
            )}
          </a>
        </div>
      </section>
    );
  }

  /*
   * CONTACT
   */

  if (
    block.type ===
    "Contact"
  ) {
    return (
      <section
        id="contact"
        style={sectionStyle}
      >
        <div
          style={innerStyle}
        >
          <h2>
            {String(
              props.title ||
                "Contact Us"
            )}
          </h2>

          <p>
            Phone:{" "}
            {String(
              props.phone ||
                ""
            )}
          </p>

          <p>
            Email:{" "}
            {String(
              props.email ||
                ""
            )}
          </p>

          <p>
            Address:{" "}
            {String(
              props.address ||
                ""
            )}
          </p>
        </div>
      </section>
    );
  }

  /*
   * FOOTER
   */

  if (
    block.type ===
    "Footer"
  ) {
    return (
      <footer
        style={sectionStyle}
      >
        <div
          style={innerStyle}
        >
          {String(
            props.text ||
              "All rights reserved."
          )}
        </div>
      </footer>
    );
  }

  return null;
}
