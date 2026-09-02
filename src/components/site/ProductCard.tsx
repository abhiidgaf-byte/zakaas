import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart";
import { formatINR, type ProductWithCategory } from "@/lib/schemas";

export function ProductCard({
  product,
  index,
}: {
  product: ProductWithCategory;
  index: number;
}) {
  const { add, setOpen } = useCart();
  const number = product.categories?.number ?? String(index + 1).padStart(2, "0");

  function addToCart() {
    add({
      productId: product.id,
      name: product.name,
      flavour: product.flavour,
      slug: product.slug ?? "",
      imageUrl: product.image_url,
      pricePaise: product.price_paise,
      weightGrams: product.weight_grams,
    });
    toast.success("ADDED. झकास.");
    setOpen(true);
  }

  return (
    <article className="stamp group flex flex-col bg-card transition-transform duration-200 hover:-translate-y-1">
      <div className="relative overflow-hidden border-b-[3px] border-ink bg-paper">
        <img
          src={product.image_url}
          alt={`${product.name} — ${product.flavour} pack by ZAKAAS`}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <span className="absolute top-3 left-3 border-2 border-ink bg-paper px-2 py-0.5 font-display text-sm">
          {number}
        </span>
        <span className="stamp-sm absolute -bottom-1 right-3 rotate-[-3deg] bg-gold px-3 py-1 font-display text-lg">
          {formatINR(product.price_paise)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-3xl leading-none">{product.name}</h3>
        <p className="text-[11px] font-bold tracking-[0.22em] text-red">
          {product.flavour} · {product.weight_grams}G
        </p>
        <p className="flex-1 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addToCart}
            disabled={product.coming_soon}
            className="stamp-sm stamp-hover inline-flex flex-1 items-center justify-center gap-1.5 bg-red px-4 py-2.5 text-sm font-bold tracking-wide text-paper disabled:opacity-50"
          >
            {product.coming_soon ? "COMING SOON" : "ADD TO CART"}
            {!product.coming_soon && <Plus className="size-4" />}
          </button>
          {product.slug && (
            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              className="stamp-sm stamp-hover inline-flex items-center justify-center bg-paper px-4 py-2.5 text-sm font-bold"
            >
              VIEW →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
