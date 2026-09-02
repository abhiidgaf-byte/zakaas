import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { getProductBySlug } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/schemas";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Snack";
    const description =
      loaderData?.description ?? "A ZAKAAS Maharashtrian snack, made in small batches.";
    return {
      meta: [
        { title: `${name} — ZAKAAS` },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: `${name} — ZAKAAS` },
        { property: "og:description", content: description.slice(0, 155) },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

const DETAILS = [
  { label: "INGREDIENTS", value: "To be confirmed — final recipe details coming soon." },
  { label: "NUTRITION", value: "Full nutrition panel will be published before launch." },
  { label: "ALLERGENS", value: "May contain gluten, peanuts and sesame. Details to follow." },
  { label: "SHELF LIFE", value: "Best within 30 days of the batch date." },
  { label: "STORAGE", value: "Keep in an airtight tin, away from sunlight." },
];

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  function addToCart() {
    if (!product) return;
    add(
      {
        productId: product.id,
        name: product.name,
        flavour: product.flavour,
        slug: product.slug ?? "",
        imageUrl: product.image_url,
        pricePaise: product.price_paise,
        weightGrams: product.weight_grams,
      },
      qty,
    );
    toast.success("ADDED. झकास.");
    setOpen(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/shop" className="text-xs font-bold tracking-[0.2em] hover:text-red">
        ← BACK TO SHOP
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="stamp overflow-hidden bg-card">
          <img
            src={product.image_url}
            alt={`${product.name} — ${product.flavour} by ZAKAAS`}
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-red">
            {product.categories?.number ?? "01"} — {product.categories?.name ?? "SNACK"}
          </p>
          <h1 className="font-display mt-2 text-5xl leading-none sm:text-6xl">{product.name}</h1>
          <p className="mt-3 text-sm font-bold tracking-[0.22em]">
            {product.flavour} · {product.weight_grams}G
          </p>
          <p className="mt-5 text-lg text-muted-foreground">{product.description}</p>
          <p className="font-display mt-6 text-4xl">{formatINR(product.price_paise)}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="stamp-sm flex items-center bg-paper">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2.5"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(100, q + 1))}
                className="px-3 py-2.5"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={addToCart}
              disabled={product.coming_soon}
              className="stamp-sm stamp-hover flex-1 bg-red px-6 py-3 font-display text-xl text-paper disabled:opacity-50"
            >
              {product.coming_soon ? "COMING SOON" : "ADD TO CART +"}
            </button>
          </div>

          <dl className="mt-10 divide-y-2 divide-ink/15 border-y-2 border-ink/15">
            {DETAILS.map((detail) => (
              <div key={detail.label} className="py-4">
                <dt className="text-xs font-bold tracking-[0.22em]">{detail.label}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
