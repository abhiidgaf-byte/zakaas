import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";

import { ProductCard } from "@/components/site/ProductCard";
import { buildCategories, productInCategory } from "@/lib/shopify";
import { collectionsQuery, productsQuery } from "@/lib/shopify-queries";

export const Route = createFileRoute("/shop")({
  validateSearch: z.object({ c: z.string().optional() }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(collectionsQuery),
    ]);
  },
  head: () => ({

    meta: [
      { title: "Shop — ZAKAAS Chakli, Bhakarwadi & Shankarpada" },
      {
        name: "description",
        content:
          "Shop the ZAKAAS lineup: chakli, bhakarwadi and shankarpada, made in small Maharashtrian batches and delivered fresh.",
      },
      { property: "og:title", content: "Shop ZAKAAS" },
      {
        property: "og:description",
        content: "Three classics. One new attitude. Chakli, bhakarwadi and shankarpada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { c } = Route.useSearch();
  const { data: products } = useSuspenseQuery(productsQuery);

  const filtered = c ? products.filter((p) => categoryFor(p)?.slug === c) : products;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-5xl">THE ZAKAAS LINEUP</h1>
      <p className="mt-2 text-muted-foreground">Three classics. One new attitude.</p>

      <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <FilterChip label="ALL" active={!c} to={undefined} />
        {CATEGORIES.map((cat) => (
          <FilterChip key={cat.slug} label={cat.name} active={c === cat.slug} to={cat.slug} />
        ))}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, i) => (
          <div
            key={product.node.id}
            className="animate-rise"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="stamp mt-10 bg-card p-8 text-center font-bold">No products found.</p>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  to,
}: {
  label: string;
  active: boolean;
  to: string | undefined;
}) {
  return (
    <Link
      to="/shop"
      search={to ? { c: to } : {}}
      className={`stamp-sm px-4 py-2 text-xs font-bold tracking-[0.18em] transition-transform hover:-translate-y-0.5 ${
        active ? "bg-red text-paper" : "bg-paper"
      }`}
    >
      {label}
    </Link>
  );
}
