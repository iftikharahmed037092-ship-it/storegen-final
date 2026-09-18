import type { BlockType, EditorBlock } from "@/types/page";

export function createDefaultBlock(
  type: BlockType
): EditorBlock {
  const id = crypto.randomUUID();

  switch (type) {
    case "Header":
      return {
        id,
        type,
        props: {
          logoText: "My Store",
          showSearch: true,
          showCart: true,
          showMenu: true
        }
      };

    case "Hero":
      return {
        id,
        type,
        props: {
          title: "Welcome to Our Store",
          subtitle:
            "Discover amazing products at great prices.",
          buttonText: "Shop Now",
          buttonLink: "#products",
          imageUrl: "",
          backgroundColor: "#f3f4f6"
        }
      };

    case "Products":
      return {
        id,
        type,
        props: {
          title: "Featured Products",
          limit: 8,
          showPrice: true,
          showButton: true
        }
      };

    case "Features":
      return {
        id,
        type,
        props: {
          title: "Why Shop With Us?",
          items: [
            {
              title: "Fast Delivery",
              description: "Quick and reliable delivery."
            },
            {
              title: "Cash on Delivery",
              description: "Pay when your order arrives."
            },
            {
              title: "Quality Products",
              description: "Products selected with care."
            }
          ]
        }
      };

    case "WhatsAppOrder":
      return {
        id,
        type,
        props: {
          title: "Order on WhatsApp",
          description:
            "Contact us directly to place your order.",
          phone: "",
          buttonText: "Order on WhatsApp"
        }
      };

    case "Contact":
      return {
        id,
        type,
        props: {
          title: "Contact Us",
          phone: "",
          email: "",
          address: ""
        }
      };

    case "Footer":
      return {
        id,
        type,
        props: {
          text: "© 2026 My Store. All rights reserved."
        }
      };

    default:
      throw new Error(`Unsupported block: ${type}`);
  }
}
