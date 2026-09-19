import type {
  BlockType,
  EditorBlock
} from "@/types/page";

function createId() {
  return crypto.randomUUID();
}

export function createDefaultBlock(
  type: BlockType
): EditorBlock {
  const baseStyle = {
    backgroundColor: "#ffffff",
    textColor: "#111827",

    paddingTop: 40,
    paddingRight: 20,
    paddingBottom: 40,
    paddingLeft: 20,

    marginTop: 0,
    marginBottom: 0,

    maxWidth: 1200,

    textAlign: "center" as const
  };

  switch (type) {
    case "Header":
      return {
        id: createId(),
        type,
        props: {
          logoText: "My Store",
          showCart: true,
          showSearch: true
        },
        style: {
          ...baseStyle,
          paddingTop: 16,
          paddingBottom: 16
        }
      };

    case "Hero":
      return {
        id: createId(),
        type,
        props: {
          title:
            "Welcome to Our Store",
          subtitle:
            "Discover our latest products",
          buttonText:
            "Shop Now",
          buttonLink:
            "#products",
          backgroundImage: "",
          buttonColor:
            "#16a34a"
        },
        style: {
          ...baseStyle,
          paddingTop: 90,
          paddingBottom: 90
        }
      };

    case "Products":
      return {
        id: createId(),
        type,
        props: {
          title:
            "Featured Products",
          limit: 8,
          columns: 4,
          showOldPrice: true,
          showButton: true
        },
        style: {
          ...baseStyle,
          paddingTop: 60,
          paddingBottom: 60
        }
      };

    case "Features":
      return {
        id: createId(),
        type,
        props: {
          title:
            "Why Shop With Us",
          items: [
            {
              title:
                "Fast Delivery",
              text:
                "Quick delivery to your doorstep."
            },
            {
              title:
                "Secure Shopping",
              text:
                "Your information stays protected."
            },
            {
              title:
                "Quality Products",
              text:
                "Carefully selected products."
            }
          ]
        },
        style: {
          ...baseStyle,
          paddingTop: 50,
          paddingBottom: 50
        }
      };

    case "WhatsAppOrder":
      return {
        id: createId(),
        type,
        props: {
          title:
            "Order on WhatsApp",
          phone:
            "923000000000",
          buttonText:
            "Order Now",
          message:
            "Hello, I want to place an order."
        },
        style: {
          ...baseStyle,
          paddingTop: 50,
          paddingBottom: 50
        }
      };

    case "Contact":
      return {
        id: createId(),
        type,
        props: {
          title:
            "Contact Us",
          phone:
            "+92 300 0000000",
          email:
            "info@example.com",
          address:
            "Pakistan"
        },
        style: {
          ...baseStyle,
          paddingTop: 50,
          paddingBottom: 50
        }
      };

    case "Footer":
      return {
        id: createId(),
        type,
        props: {
          text:
            "© 2026 My Store. All rights reserved."
        },
        style: {
          ...baseStyle,
          backgroundColor:
            "#111827",
          textColor:
            "#ffffff",
          paddingTop: 30,
          paddingBottom: 30
        }
      };
  }
}
