// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import type {
  BlockType,
  EditorBlock,
  PageData
} from "@/types/page";
import { createDefaultBlock } from "./blockDefaults";

interface Props {
  storeId: string;
  storeName: string;
  initialData: PageData;
}

const blockTypes: BlockType[] = [
  "Header",
  "Hero",
  "Products",
  "Features",
  "WhatsAppOrder",
  "Contact",
  "Footer"
];

export default function Editor({
  storeId,
  storeName,
  initialData
}: Props) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(
    initialData.content || []
  );

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const selectedBlock = useMemo(
    () =>
      blocks.find(
        (block) => block.id === selectedId
      )?? null,
    [blocks, selectedId]
  );

  function addBlock(type: BlockType) {
    const block = createDefaultBlock(type);
    setBlocks((current) => [
     ...current,
      block
    ]);
    setSelectedId(block.id);
  }

  function deleteBlock(id: string) {
    setBlocks((current) =>
      current.filter(
        (block) => block.id!== id
      )
    );
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  function moveBlock(
    id: string,
    direction: "up" | "down"
  ) {
    setBlocks((current) => {
      const index = current.findIndex(
        (block) => block.id === id
      );
      if (index === -1) {
        return current;
      }
      const newIndex =
        direction === "up"
         ? index - 1
          : index + 1;
      if (
        newIndex < 0 ||
        newIndex >= current.length
      ) {
        return current;
      }
      const copy = [...current];
      const temp = copy[index];
      copy[index] = copy[newIndex];
      copy[newIndex] = temp;
      return copy;
    });
  }

  function updateBlock(
    id: string,
    key: string,
    value: unknown
  ) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id
         ? {
             ...block,
              props: {
               ...block.props,
                [key]: value
              }
            }
          : block
      )
    );
  }

  async function saveDesign() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(
        "/api/pages/save",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            storeId,
            pageData: {
              version: 1,
              content: blocks
            }
          })
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to save design."
        );
      }
      setMessage("Design saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
         ? error.message
          : "Unable to save design."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef1f0"
      }}
    >
      <header
        style={{
          height: "64px",
          background: "#ffffff",
          borderBottom:
            "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          position: "sticky",
          top: 0,
          zIndex: 20
        }}
      >
        <div>
          <strong>
            Editor — {storeName}
          </strong>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center"
          }}
        >
          {message && (
            <span
              style={{
                fontSize: "13px"
              }}
            >
              {message}
            </span>
          )}
          <button
            onClick={saveDesign}
            disabled={saving}
            style={primaryButton}
          >
            {saving
             ? "Saving..."
              : "Save Design"}
          </button>
        </div>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "230px minmax(0, 1fr) 280px",
          minHeight:
            "calc(100vh - 64px)"
        }}
      >
        <aside
          style={{
            background: "#ffffff",
            borderRight:
              "1px solid #e5e7eb",
            padding: "18px"
          }}
        >
          <h3>Add Blocks</h3>
          <div
            style={{
              display: "grid",
              gap: "9px"
            }}
          >
            {blockTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  addBlock(type)
                }
                style={blockButton}
              >
                + {type}
              </button>
            ))}
          </div>
        </aside>
        <main
          style={{
            padding: "25px",
            overflow: "auto"
          }}
        >
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              background: "#ffffff",
              minHeight: "700px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow:
                "0 8px 30px rgba(0,0,0,.08)"
            }}
          >
            {blocks.length === 0? (
              <div
                style={{
                  padding: "100px 20px",
                  textAlign: "center",
                  color: "#6b7280"
                }}
              >
                <h2>
                  Your page is empty
                </h2>
                <p>
                  Select a block from the
                  left panel to start.
                </p>
              </div>
            ) : (
              blocks.map(
                (block, index) => (
                  <div
                    key={block.id}
                    onClick={() =>
                      setSelectedId(
                        block.id
                      )
                    }
                    style={{
                      position:
                        "relative",
                      border:
                        selectedId ===
                        block.id
                         ? "2px solid #16a34a"
                          : "2px solid transparent",
                      cursor: "pointer"
                    }}
                  >
                    <BlockPreview
                      block={block}
                    />
                    {selectedId ===
                      block.id && (
                      <div
                        style={{
                          position:
                            "absolute",
                          top: "6px",
                          right: "6px",
                          display:
                            "flex",
                          gap: "5px"
                        }}
                      >
                        <button
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();
                            moveBlock(
                              block.id,
                              "up"
                            );
                          }}
                          style={
                            smallButton
                          }
                        >
                          ↑
                        </button>
                        <button
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();
                            moveBlock(
                              block.id,
                              "down"
                            );
                          }}
                          style={
                            smallButton
                          }
                        >
                          ↓
                        </button>
                        <button
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();
                            deleteBlock(
                              block.id
                            );
                          }}
                          style={{
                           ...smallButton,
                            background:
                              "#dc2626",
                            color:
                              "#ffffff"
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    <div
                      style={{
                        position:
                          "absolute",
                        bottom: "5px",
                        left: "7px",
                        fontSize: "10px",
                        color:
                          "#6b7280",
                        pointerEvents:
                          "none"
                      }}
                    >
                      Block {index + 1}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </main>
        <aside
          style={{
            background: "#ffffff",
            borderLeft:
              "1px solid #e5e7eb",
            padding: "18px",
            overflow: "auto"
          }}
        >
          <h3>Block Settings</h3>
          {!selectedBlock? (
            <p
              style={{
                color: "#6b7280"
              }}
            >
              Select a block to edit
              its settings.
            </p>
          ) : (
            <BlockSettings
              block={selectedBlock}
              onChange={updateBlock}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

function BlockPreview({
  block
}: {
  block: EditorBlock;
}) {
  const props = block.props as any;

  if (block.type === "Header") {
    return (
      <div
        style={{
          padding: "18px 25px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          borderBottom:
            "1px solid #eeeeee"
        }}
      >
        <strong>
          {String(
            props.logoText ||
              "My Store"
          )}
        </strong>
        <div
          style={{
            display: "flex",
            gap: "15px"
          }}
        >
          <span>Home</span>
          <span>Products</span>
          <span>Contact</span>
          {props.showCart && (
            <span>Cart</span>
          )}
        </div>
      </div>
    );
  }

  if (block.type === "Hero") {
    return (
      <div
        style={{
          padding: "70px 35px",
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
        <button
          style={primaryButton}
        >
          {String(
            props.buttonText ||
              "Shop Now"
          )}
        </button>
      </div>
    );
  }

  if (block.type === "Products") {
    return (
      <section
        style={{
          padding: "45px 25px"
        }}
      >
        <h2>
          {String(
            props.title ||
              "Products"
          )}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, 1fr)",
            gap: "15px"
          }}
        >
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "15px"
                }}
              >
                <div
                  style={{
                    height: "130px",
                    background:
                      "#f3f4f6",
                    borderRadius:
                      "8px"
                  }}
                />
                <h4>
                  Product {item}
                </h4>
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
    const items = Array.isArray(
      props.items
    )
     ? props.items
      : [];
    return (
      <section
        style={{
          padding: "45px 25px"
        }}
      >
        <h2>
          {String(
            props.title ||
              "Features"
          )}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "15px"
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
                    padding: "20px",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      "10px"
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
    return (
      <section
        style={{
          padding: "45px 25px",
          textAlign: "center",
          background: "#ecfdf5"
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
        <button
          style={{
           ...primaryButton,
            background:
              "#16a34a"
          }}
        >
          {String(
            props.buttonText ||
              "Order on WhatsApp"
          )}
        </button>
      </section>
    );
  }

  if (block.type === "Contact") {
    return (
      <section
        style={{
          padding: "45px 25px"
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
          textAlign: "center",
          background:
            "#111827",
          color: "#ffffff"
        }}
      >
        {String(
          props.text ||
            "My Store"
        )}
      </footer>
    );
  }
  return null;
}

function BlockSettings({
  block,
  onChange
}: {
  block: EditorBlock;
  onChange: (
    id: string,
    key: string,
    value: unknown
  ) => void;
}) {
  const props = block.props as any;

  if (block.type === "Header") {
    return (
      <>
        <Field
          label="Logo / Store Name"
          value={String(
            props.logoText || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "logoText",
              value
            )
          }
        />
        <Checkbox
          label="Show Search"
          checked={
            Boolean(
              props.showSearch
            )
          }
          onChange={(value) =>
            onChange(
              block.id,
              "showSearch",
              value
            )
          }
        />
        <Checkbox
          label="Show Cart"
          checked={
            Boolean(
              props.showCart
            )
          }
          onChange={(value) =>
            onChange(
              block.id,
              "showCart",
              value
            )
          }
        />
      </>
    );
  }

  if (block.type === "Hero") {
    return (
      <>
        <Field
          label="Title"
          value={String(
            props.title || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "title",
              value
            )
          }
        />
        <Field
          label="Subtitle"
          value={String(
            props.subtitle || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "subtitle",
              value
            )
          }
        />
        <Field
          label="Button Text"
          value={String(
            props.buttonText || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "buttonText",
              value
            )
          }
        />
        <Field
          label="Button Link"
          value={String(
            props.buttonLink || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "buttonLink",
              value
            )
          }
        />
        <Field
          label="Image URL"
          value={String(
            props.imageUrl || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "imageUrl",
              value
            )
          }
        />
        <Field
          label="Background Color"
          value={String(
            props.backgroundColor ||
              "#f3f4f6"
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "backgroundColor",
              value
            )
          }
        />
      </>
    );
  }

  if (block.type === "Products") {
    return (
      <>
        <Field
          label="Section Title"
          value={String(
            props.title || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "title",
              value
            )
          }
        />
        <Field
          label="Product Limit"
          type="number"
          value={String(
            props.limit || 8
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "limit",
              Number(value)
            )
          }
        />
      </>
    );
  }

  if (
    block.type ===
    "WhatsAppOrder"
  ) {
    return (
      <>
        <Field
          label="Title"
          value={String(
            props.title || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "title",
              value
            )
          }
        />
        <Field
          label="Description"
          value={String(
            props.description ||
              ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "description",
              value
            )
          }
        />
        <Field
          label="WhatsApp Number"
          value={String(
            props.phone || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "phone",
              value
            )
          }
        />
        <Field
          label="Button Text"
          value={String(
            props.buttonText ||
              ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "buttonText",
              value
            )
          }
        />
      </>
    );
  }

  if (block.type === "Contact") {
    return (
      <>
        <Field
          label="Title"
          value={String(
            props.title || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "title",
              value
            )
          }
        />
        <Field
          label="Phone"
          value={String(
            props.phone || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "phone",
              value
            )
          }
        />
        <Field
          label="Email"
          value={String(
            props.email || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "email",
              value
            )
          }
        />
        <Field
          label="Address"
          value={String(
            props.address || ""
          )}
          onChange={(value) =>
            onChange(
              block.id,
              "address",
              value
            )
          }
        />
      </>
    );
  }

  if (block.type === "Footer") {
    return (
      <Field
        label="Footer Text"
        value={String(
          props.text || ""
        )}
        onChange={(value) =>
          onChange(
            block.id,
            "text",
            value
          )
        }
      />
    );
  }

  if (block.type === "Features") {
    return (
      <Field
        label="Section Title"
        value={String(
          props.title || ""
        )}
        onChange={(value) =>
          onChange(
            block.id,
            "title",
            value
          )
        }
      />
    );
  }
  return null;
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div
      style={{
        marginBottom: "15px"
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: 700
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          border:
            "1px solid #d1d5db",
          borderRadius: "8px"
        }}
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "15px",
        alignItems: "center"
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
      />
      {label}
    </label>
  );
}

const primaryButton: any = {
  border: 0,
  borderRadius: "8px",
  padding: "11px 17px",
  background: "#16a34a",
  color: "#ffffff",
  fontWeight: 700
};

const blockButton: any = {
  width: "100%",
  padding: "11px",
  textAlign: "left" as const,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  borderRadius: "8px"
};

const smallButton: any = {
  border: 0,
  borderRadius: "6px",
  padding: "5px 8px",
  background: "#ffffff",
  boxShadow:
    "0 1px 4px rgba(0,0,0,.15)"
};
