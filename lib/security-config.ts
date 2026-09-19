export const SECURITY_CONFIG = {
  maxProductImageSize:
    5 * 1024 * 1024,

  allowedProductImageTypes: [
    "image/jpeg",
    "image/png",
    "image/webp"
  ],

  allowedOrderStatuses: [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
  ],

  allowedBusinessTypes: [
    "general",
    "garments",
    "shoes",
    "watches",
    "electronics"
  ],

  allowedTemplateTypes: [
    "classic",
    "modern",
    "minimal"
  ],

  maxStoreNameLength: 100,

  maxSlugLength: 60,

  maxProductNameLength: 200,

  maxDescriptionLength: 10000
} as const;
