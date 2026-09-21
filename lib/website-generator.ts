import {
  createStore
} from "@/lib/stores";

import {
  savePage
} from "@/lib/pages";

import type {
  CreateStoreInput
} from "@/types/store";

import type {
  PageData
} from "@/types/page";


export interface GenerateWebsiteInput
  extends CreateStoreInput {}


export interface GeneratedWebsite {
  storeId: string;
  slug: string;
  storeName: string;
}


function createDefaultHomepage(
  storeName: string,
  primaryColor: string
): PageData {

  return {
    version: 1,

    content: [

      {
        id: crypto.randomUUID(),

        type: "Header",

        props: {
          logoText: storeName,
          showCart: true,
          showSearch: true
        },

        style: {
          backgroundColor: "#ffffff",
          textColor: "#111827",
          paddingTop: 16,
          paddingRight: 20,
          paddingBottom: 16,
          paddingLeft: 20,
          marginTop: 0,
          marginBottom: 0,
          maxWidth: 1200,
          textAlign: "left"
        }
      },


      {
        id: crypto.randomUUID(),

        type: "Hero",

        props: {
          title:
            `Welcome to ${storeName}`,

          subtitle:
            "Discover our latest products and special offers.",

          buttonText:
            "Shop Now",

          buttonLink:
            "#products",

          backgroundImage:
            "",

          buttonColor:
            primaryColor
        },

        style: {
          backgroundColor: "#f3f4f6",
          textColor: "#111827",
          paddingTop: 70,
          paddingRight: 25,
          paddingBottom: 70,
          paddingLeft: 25,
          marginTop: 0,
          marginBottom: 20,
          maxWidth: 1200,
          textAlign: "center"
        }
      },


      {
        id: crypto.randomUUID(),

        type: "Products",

        props: {
          title:
            "Featured Products",

          limit: 8,

          columns: 4,

          showOldPrice: true,

          showButton: true
        },

        style: {
          backgroundColor: "#ffffff",
          textColor: "#111827",
          paddingTop: 40,
          paddingRight: 20,
          paddingBottom: 40,
          paddingLeft: 20,
          marginTop: 0,
          marginBottom: 20,
          maxWidth: 1200,
          textAlign: "center"
        }
      },


      {
        id: crypto.randomUUID(),

        type: "Features",

        props: {
          title:
            "Why Shop With Us?",

          items: [
            {
              title:
                "Quality Products",

              description:
                "Carefully selected products for our customers."
            },

            {
              title:
                "Fast Delivery",

              description:
                "Reliable delivery to your doorstep."
            },

            {
              title:
                "Customer Support",

              description:
                "We're here to help with your orders."
            }
          ]
        },

        style: {
          backgroundColor: "#f9fafb",
          textColor: "#111827",
          paddingTop: 40,
          paddingRight: 20,
          paddingBottom: 40,
          paddingLeft: 20,
          marginTop: 0,
          marginBottom: 20,
          maxWidth: 1200,
          textAlign: "center"
        }
      },


      {
        id: crypto.randomUUID(),

        type: "Contact",

        props: {
          title:
            "Contact Us",

          phone:
            "",

          email:
            "",

          address:
            ""
        },

        style: {
          backgroundColor: "#ffffff",
          textColor: "#111827",
          paddingTop: 40,
          paddingRight: 20,
          paddingBottom: 40,
          paddingLeft: 20,
          marginTop: 0,
          marginBottom: 0,
          maxWidth: 1200,
          textAlign: "center"
        }
      },


      {
        id: crypto.randomUUID(),

        type: "Footer",

        props: {
          text:
            `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`
        },

        style: {
          backgroundColor: "#111827",
          textColor: "#ffffff",
          paddingTop: 25,
          paddingRight: 20,
          paddingBottom: 25,
          paddingLeft: 20,
          marginTop: 0,
          marginBottom: 0,
          maxWidth: 1200,
          textAlign: "center"
        }
      }

    ]
  };
}


export async function generateWebsite(
  input: GenerateWebsiteInput
): Promise<GeneratedWebsite> {

  const store =
    await createStore(input);


  const pageData =
    createDefaultHomepage(
      store.store_name,
      store.primary_color
    );


  await savePage(
    store.id,
    pageData
  );


  return {
    storeId:
      store.id,

    slug:
      store.slug,

    storeName:
      store.store_name
  };
}
