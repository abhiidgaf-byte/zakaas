import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  categoryFor,
  fetchProductByHandle,
  firstImage,
  formatMoney,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => fetchProductByHandle(slug),
  });

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const product = loaderData as ShopifyProduct | undefined;
    const name = product?.node.title ?? "Snack";
    const description =
      product?.node.description || "A ZAKAAS Maharashtrian snack, made in small batches.";
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
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const setOpen = useCartStore((s) => s.setOpen);
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState<string | null>(null);

  if (!product) return null;

  const variants = product.node.variants.edges.map((e) => e.node);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const image = firstImage(product);
  const category = categoryFor(product);

  async function addToCart() {
    if (!product || !variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions ?? [],
    });
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
          {image && (
            <img
              src={image.url}
              alt={image.altText ?? `${product.node.title} by ZAKAAS`}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          )}
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-red">
            {category?.number ?? "01"} — {category?.name ?? product.node.productType ?? "SNACK"}
          </p>
          <h1 className="font-display mt-2 text-5xl leading-none sm:text-6xl">
            {product.node.title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">{product.node.description}</p>
          <p className="font-display mt-6 text-4xl">
            {variant && formatMoney(variant.price.amount, variant.price.currencyCode)}
          </p>

          {variants.length > 1 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  disabled={!v.availableForSale}
                  className={`stamp-sm px-4 py-2 text-xs font-bold tracking-[0.18em] disabled:opacity-40 ${
                    v.id === variant?.id ? "bg-red text-paper" : "bg-paper"
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          )}

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
              disabled={!variant?.availableForSale || isLoading}
              className="stamp-sm stamp-hover flex flex-1 items-center justify-center bg-red px-6 py-3 font-display text-xl text-paper disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : variant?.availableForSale ? (
                "ADD TO CART +"
              ) : (
                "SOLD OUT"
              )}
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
