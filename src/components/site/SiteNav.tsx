import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart";

const LINKS = [
  { to: "/shop", label: "SHOP", search: undefined },
  { to: "/shop", label: "CHAKLI", search: { c: "chakli" } },
  { to: "/shop", label: "BHAKARWADI", search: { c: "bhakarwadi" } },
  { to: "/shop", label: "SHANKARPADA", search: { c: "shankarpada" } },
  { to: "/story", label: "OUR STORY", search: undefined },
] as const;

export function SiteNav() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b-[3px] border-ink bg-paper/95 backdrop-blur transition-all duration-200 ${
        scrolled ? "py-1.5" : "py-3"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4"
      >
        <Link to="/" className="flex items-baseline gap-1.5">
          <span
            className={`font-display text-red transition-all duration-200 ${scrolled ? "text-2xl" : "text-3xl"}`}
          >
            ZAKAAS
          </span>
          <span className="font-marathi hidden text-xs text-ink/70 sm:inline">झकास</span>
        </Link>

        <ul className="hidden items-center gap-5 lg:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                search={link.search as never}
                className="text-xs font-bold tracking-[0.14em] transition-colors hover:text-red"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="stamp-sm stamp-hover flex items-center gap-2 bg-gold px-3 py-1.5 text-xs font-bold tracking-widest"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <ShoppingBag className="size-4" /> CART ({count})
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="stamp-sm flex items-center bg-paper px-2.5 py-1.5 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <ul className="mx-auto mt-3 grid max-w-6xl gap-1 border-t-2 border-ink/20 px-4 pt-3 lg:hidden">
          {LINKS.map((link) => (
            <li key={`m-${link.label}`}>
              <Link
                to={link.to}
                search={link.search as never}
                onClick={() => setMenuOpen(false)}
                className="block py-2 font-display text-xl"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
