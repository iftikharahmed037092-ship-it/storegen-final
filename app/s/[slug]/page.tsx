import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/stores";
import { getPageByStoreId } from "@/lib/pages";
import type { EditorBlock } from "@/types/page";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StorePage({
  params
}: Props) {
  const { slug } = await params;

  const store =
    await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const page =
    await getPageByStoreId(store.id);

  const blocks =
    page?.page_data?.content || [];

  return (
    <main
      style={{
        minHeight: "100vh",
        "--primary":
          store.primary_color
      } as React.CSSProperties}
    >
      {blocks.map(
        (block: EditorBlock) => (
          <LiveBlock
            key={block.id}
            block={block}
            storeName={
              store.store_name
            }
          />
        )
      )}

      {blocks.length === 0 && (
        <div
          style={{
            padding: "100px 20px",
            textAlign: "center"
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
  storeName
}: {
  block: EditorBlock;
  storeName: string;
}) {
  const props = block.props;

  if (block.type === "Header") {
    return (
      <header
        style={{
          padding: "18px 25px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          borderBottom:
            "1px solid #e5e7eb"
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
            gap: "18px"
          }}
        >
          <a href="#">Home</a>
          <a href="#products">
            Products
          </a>
          <a href="#contact">
            Contact
          </a>

          {props.showCart && (
            <span>Cart</span>
          )}
        </nav>
      </header>
    );
  }

  if (block.type === "Hero") {
    return (
      <section
        style={{
          padding: "80px 25px",
          textAlign: "center",
          background:
            String(
              props.backgroundColor ||
                "#f3f4f6"
            ),
          backgroundImage:
            props.imageUrl
              ? `url(${String(
                  props.imageUrl
                )})`
              : undefined,
          backgroundSize: "cover",
          backgroundPosition:
            "center"
        }}
      >
        <h1>
          {String(
            props.title ||
              "Welcome"
          )}
        </h1>

        <p>
          {String(
            props.subtitle || ""
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
            marginTop: "15px",
            padding:
              "12px 20px",
            borderRadius:
              "8px",
            background:
              storePrimary(
                storeName
              ),
            color:
              "#ffffff",
            fontWeight: 700
          }}
        >
          {String(
            props.buttonText ||
              "Shop Now"
          )}
        </a>
      </section>
    );
  }

  if (block.type === "Products") {
    return (
      <section
        id="products"
        style={{
          padding: "50px 25px"
        }}
      >
        <h2>
          {String(
            props.title ||
              "Featured Products"
          )}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            gap: "18px"
          }}
        >
          {Array.from({
            length: Math.min(
              Number(
                props.limit || 4
              ),
              8
            )
          }).map(
            (_, index) => (
              <div
                key={index}
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius:
                    "12px",
                  padding:
                    "15px"
                }}
              >
                <div
                  style={{
                    height: "180px",
                    background:
                      "#f3f4f6",
                    borderRadius:
                      "8px"
                  }}
                />

                <h3>
                  Product{" "}
                  {index + 1}
                </h3>

                <strong>
                  Rs. 1,999
                </strong>
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  if (block.type === "Features") {
    const items =
      Array.isArray(
        props.items
      )
        ? props.items
        : [];

    return (
      <section
        style={{
          padding: "50px 25px"
        }}
      >
        <h2>
          {String(
            props.title ||
              "Why Shop With Us?"
          )}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            gap: "18px"
          }}
        >
          {items.map(
            (
              item: unknown,
              index
            ) => {
              const data =
                item as {
                  title?: string;
                  description?: string;
                };

              return (
                <div
                  key={index}
                  style={{
                    padding:
                      "20px",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      "12px"
                  }}
                >
                  <h3>
                    {data.title}
                  </h3>

                  <p>
                    {
                      data.description
                    }
                  </p>
                </div>
              );
            }
          )}
        </div>
      </section>
    );
  }

  if (
    block.type ===
    "WhatsAppOrder"
  ) {
    const phone =
      String(
        props.phone || ""
      ).replace(
        /[^0-9]/g,
        ""
      );

    const message =
      encodeURIComponent(
        `Hello, I want to place an order from ${storeName}.`
      );

    const whatsappUrl =
      phone
        ? `https://wa.me/${phone}?text=${message}`
        : "#";

    return (
      <section
        style={{
          padding: "55px 25px",
          textAlign:
            "center",
          background:
            "#ecfdf5"
        }}
      >
        <h2>
          {String(
            props.title ||
              "Order on WhatsApp"
          )}
        </h2>

        <p>
          {String(
            props.description ||
              ""
          )}
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display:
              "inline-block",
            padding:
              "12px 20px",
            borderRadius:
              "8px",
            background:
              "#16a34a",
            color:
              "#ffffff",
            fontWeight: 700
          }}
        >
          {String(
            props.buttonText ||
              "Order on WhatsApp"
          )}
        </a>
      </section>
    );
  }

  if (block.type === "Contact") {
    return (
      <section
        id="contact"
        style={{
          padding: "50px 25px"
        }}
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
            props.phone || ""
          )}
        </p>

        <p>
          Email:{" "}
          {String(
            props.email || ""
          )}
        </p>

        <p>
          Address:{" "}
          {String(
            props.address || ""
          )}
        </p>
      </section>
    );
  }

  if (block.type === "Footer") {
    return (
      <footer
        style={{
          padding: "25px",
          textAlign:
            "center",
          background:
            "#111827",
          color:
            "#ffffff"
        }}
      >
        {String(
          props.text ||
            "All rights reserved."
        )}
      </footer>
    );
  }

  return null;
}

function storePrimary(
  storeName: string
) {
  return "#16a34a";
}
