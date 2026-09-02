import { queryOptions } from "@tanstack/react-query";

import { fetchCollections, fetchProductByHandle, fetchProducts } from "@/lib/shopify";

/** Always fetch fresh data — Shopify is the single source of truth. */
const freshness = {
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: "always",
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;

export const productsQuery = queryOptions({
  queryKey: ["shopify", "products"],
  queryFn: () => fetchProducts(),
  ...freshness,
});

export const collectionsQuery = queryOptions({
  queryKey: ["shopify", "collections"],
  queryFn: () => fetchCollections(),
  ...freshness,
});

export const productQuery = (handle: string) =>
  queryOptions({
    queryKey: ["shopify", "product", handle],
    queryFn: () => fetchProductByHandle(handle),
    ...freshness,
  });
