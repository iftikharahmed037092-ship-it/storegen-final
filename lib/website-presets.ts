import type {
  BusinessType
} from "@/types/store";

export interface CategoryPreset {
  name: string;
  slug: string;
  description: string;
}

export interface DemoProductPreset {
  name: string;
  price: number;
  old_price: number | null;
  description: string;
  stock: number;
  sku: string;
  categorySlug: string;
}

export interface WebsitePreset {
  categories: CategoryPreset[];
  products: DemoProductPreset[];
}

const GENERAL_CATEGORIES: CategoryPreset[] = [
  {
    name: "Featured",
    slug: "featured",
    description:
      "Featured products"
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    description:
      "Latest products"
  },
  {
    name: "Best Sellers",
    slug: "best-sellers",
    description:
      "Popular products"
  },
  {
    name: "Deals",
    slug: "deals",
    description:
      "Special offers"
  }
];

const GARMENTS_CATEGORIES: CategoryPreset[] = [
  {
    name: "Men",
    slug: "men",
    description:
      "Men's fashion"
  },
  {
    name: "Women",
    slug: "women",
    description:
      "Women's fashion"
  },
  {
    name: "Kids",
    slug: "kids",
    description:
      "Kids clothing"
  },
  {
    name: "T-Shirts",
    slug: "t-shirts",
    description:
      "T-shirts and casual wear"
  },
  {
    name: "Shirts",
    slug: "shirts",
    description:
      "Shirts and formal wear"
  },
  {
    name: "Pants",
    slug: "pants",
    description:
      "Pants and trousers"
  }
];

const SHOES_CATEGORIES: CategoryPreset[] = [
  {
    name: "Men's Shoes",
    slug: "mens-shoes",
    description:
      "Shoes for men"
  },
  {
    name: "Women's Shoes",
    slug: "womens-shoes",
    description:
      "Shoes for women"
  },
  {
    name: "Sneakers",
    slug: "sneakers",
    description:
      "Sneakers and casual shoes"
  },
  {
    name: "Formal Shoes",
    slug: "formal-shoes",
    description:
      "Formal footwear"
  },
  {
    name: "Sports Shoes",
    slug: "sports-shoes",
    description:
      "Sports and running shoes"
  }
];

const WATCHES_CATEGORIES: CategoryPreset[] = [
  {
    name: "Men's Watches",
    slug: "mens-watches",
    description:
      "Watches for men"
  },
  {
    name: "Women's Watches",
    slug: "womens-watches",
    description:
      "Watches for women"
  },
  {
    name: "Smart Watches",
    slug: "smart-watches",
    description:
      "Smart watches"
  },
  {
    name: "Classic Watches",
    slug: "classic-watches",
    description:
      "Classic watches"
  },
  {
    name: "Accessories",
    slug: "accessories",
    description:
      "Watch accessories"
  }
];

const ELECTRONICS_CATEGORIES: CategoryPreset[] = [
  {
    name: "Mobiles",
    slug: "mobiles",
    description:
      "Mobile phones"
  },
  {
    name: "Laptops",
    slug: "laptops",
    description:
      "Laptops and computers"
  },
  {
    name: "Headphones",
    slug: "headphones",
    description:
      "Headphones and audio"
  },
  {
    name: "Accessories",
    slug: "accessories",
    description:
      "Electronic accessories"
  },
  {
    name: "Smart Watches",
    slug: "smart-watches",
    description:
      "Smart watches"
  }
];

function productsFor(
  categories: CategoryPreset[],
  business: string
): DemoProductPreset[] {
  const first =
    categories[0]?.slug ??
    "featured";

  return [
    {
      name: `${business} Product 01`,
      price: 2999,
      old_price: 3999,
      description:
        `Quality ${business.toLowerCase()} product for your online store.`,
      stock: 25,
      sku: "DEMO-001",
      categorySlug: first
    },
    {
      name: `${business} Product 02`,
      price: 4499,
      old_price: 5499,
      description:
        `Popular ${business.toLowerCase()} product with great value.`,
      stock: 18,
      sku: "DEMO-002",
      categorySlug:
        categories[1]?.slug ??
        first
    },
    {
      name: `${business} Product 03`,
      price: 5999,
      old_price: 6999,
      description:
        `Featured ${business.toLowerCase()} product.`,
      stock: 15,
      sku: "DEMO-003",
      categorySlug:
        categories[2]?.slug ??
        first
    },
    {
      name: `${business} Product 04`,
      price: 2499,
      old_price: 2999,
      description:
        `New arrival for your store.`,
      stock: 30,
      sku: "DEMO-004",
      categorySlug:
        categories[3]?.slug ??
        first
    },
    {
      name: `${business} Product 05`,
      price: 7999,
      old_price: 8999,
      description:
        `Premium ${business.toLowerCase()} selection.`,
      stock: 10,
      sku: "DEMO-005",
      categorySlug:
        categories[4]?.slug ??
        first
    },
    {
      name: `${business} Product 06`,
      price: 3499,
      old_price: 4299,
      description:
        `Best-selling demo product.`,
      stock: 22,
      sku: "DEMO-006",
      categorySlug:
        categories[5]?.slug ??
        first
    }
  ];
}

export function getWebsitePreset(
  businessType: BusinessType
): WebsitePreset {
  switch (businessType) {
    case "garments":
      return {
        categories:
          GARMENTS_CATEGORIES,
        products:
          productsFor(
            GARMENTS_CATEGORIES,
            "Garments"
          )
      };

    case "shoes":
      return {
        categories:
          SHOES_CATEGORIES,
        products:
          productsFor(
            SHOES_CATEGORIES,
            "Shoes"
          )
      };

    case "watches":
      return {
        categories:
          WATCHES_CATEGORIES,
        products:
          productsFor(
            WATCHES_CATEGORIES,
            "Watches"
          )
      };

    case "electronics":
      return {
        categories:
          ELECTRONICS_CATEGORIES,
        products:
          productsFor(
            ELECTRONICS_CATEGORIES,
            "Electronics"
          )
      };

    case "general":
    default:
      return {
        categories:
          GENERAL_CATEGORIES,
        products:
          productsFor(
            GENERAL_CATEGORIES,
            "Store"
          )
      };
  }
}
