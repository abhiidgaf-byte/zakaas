import { ExternalLink, Loader2, Minus, Plus, Trash2, X } from "lucide-react";
import { useEffect } from "react";

import { useCartStore } from "@/stores/cartStore";
import { formatMoney } from "@/lib/shopify";

export function CartDrawer() {
  const {
    items,
    isOpen,
    isLoading,
    isSyncing,
    setOpen,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const currency = items[0]?.price.currencyCode ?? "INR";
  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);

  function handleCheckout() {
    const checkoutUrl = getCheckoutUrl();
    if (!checkoutUrl) return;
    window.open(checkoutUrl, "_blank");
    setOpen(false);
  }

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/60 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Cart"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-50 flex h-full w-full flex-col border-l-[3px] border-ink bg-paper transition-transform duration-250 sm:max-w-md ${
          isOpen ? "translate-x-0" : "translate-x-full"
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
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Nothing here yet. भूक लागली?
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const image = item.product.node.images?.edges?.[0]?.node;
                return (
                  <li key={item.variantId} className="stamp-sm flex gap-3 bg-card p-3">
                    {image && (
                      <img
                        src={image.url}
                        alt={item.product.node.title}
                        loading="lazy"
                        className="size-20 border-2 border-ink object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-display text-lg leading-tight">
                        {item.product.node.title}
                      </p>
                      <p className="text-xs tracking-widest text-muted-foreground">
                        {item.selectedOptions.map((o) => o.value).join(" • ") || item.variantTitle}
                      </p>
                      <p className="mt-1 text-sm font-bold">
                        {formatMoney(item.price.amount, item.price.currencyCode)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.product.node.title}`}
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="border-2 border-ink p-1"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.product.node.title}`}
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="border-2 border-ink p-1"
                        >
                          <Plus className="size-3" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${item.product.node.title}`}
                          onClick={() => removeItem(item.variantId)}
                          className="ml-auto text-muted-foreground hover:text-red"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t-[3px] border-ink px-4 py-4">
          <div className="flex items-center justify-between font-display text-xl">
            <span>SUBTOTAL</span>
            <span>{formatMoney(subtotal, currency)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Taxes and shipping calculated at Shopify checkout.
          </p>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={items.length === 0 || isLoading || isSyncing}
            className="stamp-sm stamp-hover mt-3 flex w-full items-center justify-center gap-2 bg-red px-4 py-3 font-display text-lg text-paper disabled:opacity-50"
          >
            {isLoading || isSyncing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <ExternalLink className="size-4" /> CHECKOUT →
              </>
            )}
          </button>
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
