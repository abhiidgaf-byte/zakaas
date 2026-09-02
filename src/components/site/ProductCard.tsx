import { Link } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/stores/cartStore";
import { categoryFor, firstImage, firstVariant, formatMoney, type ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product, index }: { product: ShopifyProduct; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const setOpen = useCartStore((s) => s.setOpen);

  const image = firstImage(product);
  const variant = firstVariant(product);
  const category = categoryFor(product);
  const number = category?.number ?? String(index + 1).padStart(2, "0");
  const soldOut = !variant?.availableForSale;

  async function addToCart() {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success("ADDED. झकास.");
    setOpen(true);
  }

  return (
    <article className="stamp group flex flex-col bg-card transition-transform duration-200 hover:-translate-y-1">
      <Link
        to="/product/$slug"
        params={{ slug: product.node.handle }}
        className="relative block overflow-hidden border-b-[3px] border-ink bg-paper"
      >
        {image && (
          <img
            src={image.url}
            alt={image.altText ?? `${product.node.title} by ZAKAAS`}
            loading="lazy"
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        )}
        <span className="absolute top-3 left-3 border-2 border-ink bg-paper px-2 py-0.5 font-display text-sm">
          {number}
        </span>
        <span className="stamp-sm absolute -bottom-1 right-3 rotate-[-3deg] bg-gold px-3 py-1 font-display text-lg">
          {formatMoney(
            product.node.priceRange.minVariantPrice.amount,
            product.node.priceRange.minVariantPrice.currencyCode,
          )}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-3xl leading-none">{product.node.title}</h3>
        <p className="text-[11px] font-bold tracking-[0.22em] text-red">
          {variant?.title?.toUpperCase() ?? "ORIGINAL"}
        </p>
        <p className="flex-1 text-sm text-muted-foreground">{product.node.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addToCart}
            disabled={soldOut || isLoading}
            className="stamp-sm stamp-hover inline-flex flex-1 items-center justify-center gap-1.5 bg-red px-4 py-2.5 text-sm font-bold tracking-wide text-paper disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : soldOut ? (
              "SOLD OUT"
            ) : (
              <>
                ADD TO CART <Plus className="size-4" />
              </>
            )}
          </button>
          <Link
            to="/product/$slug"
            params={{ slug: product.node.handle }}
            className="stamp-sm stamp-hover inline-flex items-center justify-center bg-paper px-4 py-2.5 text-sm font-bold"
          >
            VIEW →
          </Link>
        </div>
      </div>
    </article>
  );
}
