import type { PageData } from "@/types/page";

import type {
  BusinessType,
  CreateStoreInput,
  TemplateType
} from "@/types/store";

import { createStore } from "./stores";

import { savePage } from "./pages";

import {
  getBusinessPreset,
  getTemplatePreset
} from "./website-templates";

export interface GenerateWebsiteInput
  extends CreateStoreInput {
  business_type: BusinessType;
  template_type: TemplateType;
}

export interface GeneratedWebsite {
  storeId: string;
  slug: string;
  storeName: string;
}

function createBlockId(): string {
  return crypto.randomUUID();
}

export function createDefaultHomepage(
  storeName: string,
  primaryColor: string,
  businessType: BusinessType,
  templateType: TemplateType,
  contactPhone: string,
  contactEmail: string,
  address: string,
  whatsappNumber: string,
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  }
): PageData {
  const business =
    getBusinessPreset(
      businessType
    );

  const template =
    getTemplatePreset(
      templateType
    );

  const currentYear =
    new Date().getFullYear();

  return {
    version: 1,

    content: [
      {
        id: createBlockId(),

        type: "Header",

        props: {
          logoText: storeName,
          logoUrl: "",
          showCart: true,
          showSearch: true
        },

        style: {
          backgroundColor: "#ffffff",
          textColor: "#111827",
          paddingTop: 14,
          paddingBottom: 14,
          maxWidth: 1200
        }
      },

      {
        id: createBlockId(),

        type: "Hero",

        props: {
          title: business.heroTitle,

          subtitle:
            business.heroSubtitle,

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
          backgroundColor:
            "#f0fdf4",

          textColor:
            "#111827",

          paddingTop:
            templateType === "modern"
              ? 90
              : 70,

          paddingBottom:
            templateType === "modern"
              ? 90
              : 70,

          textAlign:
            template.style.heroAlignment,

          maxWidth:
            1200
        }
      },

      {
        id: createBlockId(),

        type: "Products",

        props: {
          title:
            business.productsTitle,

          limit: 8,

          columns:
            template.style.productsColumns,

          showOldPrice:
            true,

          showButton:
            true,

          buttonText:
            "View Product"
        },

        style: {
          backgroundColor:
            "#ffffff",

          textColor:
            "#111827",

          paddingTop: 60,

          paddingBottom: 60,

          maxWidth:
            1200
        }
      },

      {
        id: createBlockId(),

        type: "Features",

        props: {
          title:
            business.featuresTitle,

          items:
            business.features
        },

        style: {
          backgroundColor:
            "#f9fafb",

          textColor:
            "#111827",

          paddingTop: 60,

          paddingBottom: 60,

          maxWidth:
            1200
        }
      },

      {
        id: createBlockId(),

        type: "Contact",

        props: {
          title:
            "Contact Us",

          phone:
            contactPhone,

          email:
            contactEmail,

          address:
            address,

          whatsapp:
            whatsappNumber,

          facebook:
            socialLinks.facebook || "",

          instagram:
            socialLinks.instagram || "",

          tiktok:
            socialLinks.tiktok || "",

          youtube:
            socialLinks.youtube || ""
        },

        style: {
          backgroundColor:
            "#ffffff",

          textColor:
            "#111827",

          paddingTop: 50,

          paddingBottom: 50,

          maxWidth:
            1200
        }
      },

      {
        id: createBlockId(),

        type: "Footer",

        props: {
          text:
            `© ${currentYear} ${storeName}. All rights reserved.`,

          facebook:
            socialLinks.facebook || "",

          instagram:
            socialLinks.instagram || "",

          tiktok:
            socialLinks.tiktok || "",

          youtube:
            socialLinks.youtube || ""
        },

        style: {
          backgroundColor:
            "#111827",

          textColor:
            "#ffffff",

          paddingTop: 30,

          paddingBottom: 30,

          maxWidth:
            1200
        }
      }
    ]
  };
}

export async function generateWebsite(
  input: GenerateWebsiteInput
): Promise<GeneratedWebsite> {
  const store =
    await createStore({
      slug: input.slug,

      store_name:
        input.store_name,

      custom_domain:
        input.custom_domain,

      logo_url:
        input.logo_url,

      primary_color:
        input.primary_color,

      whatsapp_number:
        input.whatsapp_number,

      shipping_fee:
        input.shipping_fee,

      is_active:
        input.is_active,

      business_type:
        input.business_type,

      template_type:
        input.template_type,

      contact_phone:
        input.contact_phone,

      contact_email:
        input.contact_email,

      address:
        input.address,

      social_links:
        input.social_links
    });

  const pageData =
    createDefaultHomepage(
      store.store_name,

      store.primary_color,

      input.business_type,

      input.template_type,

      input.contact_phone || "",

      input.contact_email || "",

      input.address || "",

      input.whatsapp_number || "",

      input.social_links || {}
    );

  await savePage(
    store.id,
    pageData
  );

  return {
    storeId: store.id,

    slug: store.slug,

    storeName:
      store.store_name
  };
}
