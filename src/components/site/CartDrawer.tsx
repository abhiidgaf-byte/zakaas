import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X } from "lucide-react";

import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/schemas";

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQuantity, remove } = useCart();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/60 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Cart"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 flex h-full w-full flex-col border-l-[3px] border-ink bg-paper transition-transform duration-250 sm:max-w-md ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b-[3px] border-ink px-4 py-4">
          <h2 className="font-display text-2xl">YOUR CART</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="stamp-sm bg-paper p-1.5"
            aria-label="Close cart"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {lines.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Nothing here yet. भूक लागली?
            </p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.productId} className="stamp-sm flex gap-3 bg-card p-3">
                  <img
                    src={line.imageUrl}
                    alt={line.name}
                    loading="lazy"
                    className="size-20 border-2 border-ink object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-lg leading-tight">{line.name}</p>
                    <p className="text-xs tracking-widest text-muted-foreground">
                      {line.flavour} · {line.weightGrams}g
                    </p>
                    <p className="mt-1 text-sm font-bold">{formatINR(line.pricePaise)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease ${line.name}`}
                        onClick={() => setQuantity(line.productId, line.quantity - 1)}
                        className="border-2 border-ink p-1"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${line.name}`}
                        onClick={() => setQuantity(line.productId, line.quantity + 1)}
                        className="border-2 border-ink p-1"
                      >
                        <Plus className="size-3" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${line.name}`}
                        onClick={() => remove(line.productId)}
                        className="ml-auto text-muted-foreground hover:text-red"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t-[3px] border-ink px-4 py-4">
          <div className="flex items-center justify-between font-display text-xl">
            <span>SUBTOTAL</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Shipping calculated at checkout. Payment coming soon.
          </p>
          <Link
            to="/checkout"
            onClick={() => setOpen(false)}
            aria-disabled={lines.length === 0}
            className={`stamp-sm stamp-hover mt-3 flex w-full items-center justify-center bg-red px-4 py-3 font-display text-lg text-paper ${
              lines.length === 0 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            CHECKOUT →
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 w-full py-2 text-xs font-bold tracking-widest hover:text-red"
          >
            KEEP SNACKING →
          </button>
        </div>
      </aside>
    </>
  );
}
