import type {
  BusinessType,
  TemplateType
} from "@/types/store";

export interface BusinessPreset {
  label: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  productsTitle: string;
  featuresTitle: string;
  features: Array<{
    title: string;
    description: string;
  }>;
}

export const BUSINESS_PRESETS: Record<
  BusinessType,
  BusinessPreset
> = {
  general: {
    label: "General Store",
    description: "Multi-purpose online store",
    heroTitle: "Shop Everything You Love",
    heroSubtitle:
      "Discover quality products at great prices.",
    productsTitle: "Featured Products",
    featuresTitle: "Why Shop With Us?",
    features: [
      {
        title: "Quality Products",
        description: "Carefully selected products."
      },
      {
        title: "Fast Delivery",
        description: "Quick and reliable delivery."
      },
      {
        title: "Easy Ordering",
        description: "Simple and convenient shopping."
      }
    ]
  },

  garments: {
    label: "Garments",
    description: "Clothing and fashion store",
    heroTitle: "Style That Fits You",
    heroSubtitle:
      "Discover the latest fashion and clothing collections.",
    productsTitle: "Latest Collection",
    featuresTitle: "Shop Fashion With Confidence",
    features: [
      {
        title: "Latest Styles",
        description: "Fresh fashion for every season."
      },
      {
        title: "Quality Fabric",
        description: "Comfortable and carefully selected materials."
      },
      {
        title: "Easy Ordering",
        description: "Order your favorite styles with ease."
      }
    ]
  },

  shoes: {
    label: "Shoes",
    description: "Footwear and shoes store",
    heroTitle: "Step Into Your Style",
    heroSubtitle:
      "Find footwear designed for comfort, style and everyday life.",
    productsTitle: "Featured Footwear",
    featuresTitle: "Why Choose Our Shoes?",
    features: [
      {
        title: "Great Comfort",
        description: "Shoes designed for everyday comfort."
      },
      {
        title: "Modern Designs",
        description: "Trendy styles for every occasion."
      },
      {
        title: "Reliable Quality",
        description: "Products selected with quality in mind."
      }
    ]
  },

  watches: {
    label: "Watches",
    description: "Watches and accessories store",
    heroTitle: "Time Meets Style",
    heroSubtitle:
      "Explore elegant watches for every occasion.",
    productsTitle: "Featured Watches",
    featuresTitle: "Why Shop Our Watches?",
    features: [
      {
        title: "Elegant Designs",
        description: "Classic and modern watch designs."
      },
      {
        title: "Quality Selection",
        description: "Carefully selected products."
      },
      {
        title: "Perfect Gift",
        description: "Beautiful choices for special occasions."
      }
    ]
  },

  electronics: {
    label: "Electronics",
    description: "Phones, gadgets and electronics",
    heroTitle: "Smart Technology For Everyone",
    heroSubtitle:
      "Discover useful gadgets and electronics at great prices.",
    productsTitle: "Trending Electronics",
    featuresTitle: "Shop Electronics Easily",
    features: [
      {
        title: "Latest Gadgets",
        description: "Discover useful modern technology."
      },
      {
        title: "Great Prices",
        description: "Competitive prices on selected products."
      },
      {
        title: "Easy Ordering",
        description: "A simple way to order your products."
      }
    ]
  }
};

export interface TemplatePreset {
  label: string;
  description: string;
  style: {
    sectionRadius: number;
    heroAlignment: "left" | "center" | "right";
    productsColumns: number;
    buttonRadius: number;
  };
}

export const TEMPLATE_PRESETS: Record<
  TemplateType,
  TemplatePreset
> = {
  classic: {
    label: "Classic",
    description: "Clean and familiar shopping layout.",
    style: {
      sectionRadius: 12,
      heroAlignment: "center",
      productsColumns: 4,
      buttonRadius: 8
    }
  },

  modern: {
    label: "Modern",
    description: "Bold, spacious and modern storefront.",
    style: {
      sectionRadius: 18,
      heroAlignment: "left",
      productsColumns: 4,
      buttonRadius: 12
    }
  },

  minimal: {
    label: "Minimal",
    description: "Simple, clean and product-focused design.",
    style: {
      sectionRadius: 6,
      heroAlignment: "center",
      productsColumns: 3,
      buttonRadius: 6
    }
  }
};

export function getBusinessPreset(
  businessType: BusinessType
): BusinessPreset {
  return (
    BUSINESS_PRESETS[businessType] ||
    BUSINESS_PRESETS.general
  );
}

export function getTemplatePreset(
  templateType: TemplateType
): TemplatePreset {
  return (
    TEMPLATE_PRESETS[templateType] ||
    TEMPLATE_PRESETS.classic
  );
}
