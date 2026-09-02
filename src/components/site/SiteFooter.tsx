import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Marquee } from "./Marquee";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <Marquee
        slow
        className="border-ink bg-red text-paper"
        items={["झकासच.", "OPEN. CRUNCH. REPEAT.", "MADE IN MH", "SNACK NO. 001"]}
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-4xl text-gold">ZAKAAS</p>
          <p className="font-marathi mt-2 text-sm text-paper/70">महाराष्ट्रातून. पण next level.</p>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-gold">SHOP</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/shop" search={{ c: "chakli" } as never} className="hover:text-gold">
                Chakli
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ c: "bhakarwadi" } as never} className="hover:text-gold">
                Bhakarwadi
              </Link>
            </li>
            <li>
              <Link to="/shop" search={{ c: "shankarpada" } as never} className="hover:text-gold">
                Shankarpada
              </Link>
            </li>
            <li>
              <Link to="/story" className="hover:text-gold">
                Our story
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-gold">MORE</h2>
          <ul className="mt-3 space-y-2 text-sm text-paper/80">
            <li>Contact — hello@zakaas.in</li>
            <li>Instagram — @zakaas</li>
            <li>Terms · Privacy</li>
            <li>Shipping · Returns</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl text-paper">GET THE GOOD STUFF.</h2>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@")) {
                toast.error("Enter a valid email");
                return;
              }
              setEmail("");
              toast.success("You're on the list. झकास.");
            }}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Your email
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL"
              className="w-full border-2 border-paper/40 bg-transparent px-3 py-2 text-sm placeholder:text-paper/50"
            />
            <button
              type="submit"
              className="border-2 border-gold bg-gold px-4 py-2 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              JOIN →
            </button>
          </form>
        </div>
      </div>

      <p className="border-t border-paper/20 px-4 py-5 text-center text-xs text-paper/60">
        © 2026 ZAKAAS · Made in Maharashtra
      </p>
    </footer>
  );
}
