import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "wcfsjc-ib.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "70ff03d876d68c18ca34a9e9d07e1d4c";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  productType
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 10) {
    edges {
      node {
        id
        title
        price { amount currencyCode }
        availableForSale
        selectedOptions { name value }
      }
    }
  }
  options { name values }
`;

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image { url altText }
          products(first: 100) { edges { node { id handle } } }
        }
      }
    }
  }
`;

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(
      `Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }

  return data;
}

export async function fetchProducts(query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 50, query: query ?? null });
  return (data?.data?.products?.edges ?? []) as ShopifyProduct[];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  const node = data?.data?.product;
  return node ? ({ node } as ShopifyProduct) : null;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: { url: string; altText: string | null } | null;
  productHandles: string[];
}

/** Collections Shopify auto-creates that aren't editorial categories. */
const IGNORED_COLLECTION_HANDLES = new Set(["frontpage", "all"]);

export async function fetchCollections(): Promise<ShopifyCollection[]> {
  const data = await storefrontApiRequest(COLLECTIONS_QUERY, { first: 50 });
  const edges = (data?.data?.collections?.edges ?? []) as Array<{
    node: {
      id: string;
      handle: string;
      title: string;
      description: string;
      image: { url: string; altText: string | null } | null;
      products: { edges: Array<{ node: { id: string; handle: string } }> };
    };
  }>;
  return edges
    .map(({ node }) => ({
      id: node.id,
      handle: node.handle,
      title: node.title,
      description: node.description ?? "",
      image: node.image ?? null,
      productHandles: (node.products?.edges ?? []).map((e) => e.node.handle),
    }))
    .filter((c) => !IGNORED_COLLECTION_HANDLES.has(c.handle));
}


export function formatMoney(amount: string | number, currencyCode = "INR") {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}

export function firstImage(product: ShopifyProduct) {
  return product.node.images?.edges?.[0]?.node ?? null;
}

export function firstVariant(product: ShopifyProduct) {
  return product.node.variants?.edges?.[0]?.node ?? null;
}

export interface Category {
  slug: string;
  name: string;
  number: string;
  blurb: string;
  image: string | null;
  productHandles: string[] | null;
  productType: string | null;
}

/**
 * Categories are derived entirely from Shopify: real collections when the store
 * has them, otherwise grouped by the products' Shopify product type.
 */
export function buildCategories(
  products: ShopifyProduct[],
  collections: ShopifyCollection[],
): Category[] {
  const pad = (i: number) => String(i + 1).padStart(2, "0");

  if (collections.length > 0) {
    return collections.map((c, i) => ({
      slug: c.handle,
      name: c.title.toUpperCase(),
      number: pad(i),
      blurb: c.description,
      image:
        c.image?.url ??
        firstImage(products.find((p) => c.productHandles.includes(p.node.handle))!ate ?? null) ??
        null,
      productHandles: c.productHandles,
      productType: null,
    }));
  }

  const types: string[] = [];
  for (const p of products) {
    const t = p.node.productType?.trim();
    if (t && !types.includes(t)) types.push(t);
  }
  return types.map((t, i) => ({
    slug: t.toLowerCase().replace(/\s+/g, "-"),
    name: t.toUpperCase(),
    number: pad(i),
    blurb: "",
    image: null,
    productHandles: null,
    productType: t,
  }));
}

export function productInCategory(product: ShopifyProduct, category: Category) {
  if (category.productHandles) return category.productHandles.includes(product.node.handle);
  return (product.node.productType ?? "").toLowerCase() === (category.productType ?? "").toLowerCase();
}

export function categoryFor(product: ShopifyProduct, categories: Category[]) {
  return categories.find((c) => productInCategory(product, c)) ?? null;
}

