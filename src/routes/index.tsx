import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Marquee } from "@/components/site/Marquee";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { DrivingRickshaw, RickshawArt } from "@/components/site/Rickshaw";
import { buildCategories, firstImage, productInCategory } from "@/lib/shopify";
import { collectionsQuery, productsQuery } from "@/lib/shopify-queries";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(collectionsQuery),
    ]);
  },
  head: () => ({

    meta: [
      { title: "ZAKAAS — Maharashtrian Snacks with New-Gen Attitude" },
      {
        name: "description",
        content:
          "ZAKAAS makes chakli, bhakarwadi and shankarpada in small Maharashtrian batches. Old-school soul, new-school crunch — order online across India.",
      },
      { property: "og:title", content: "ZAKAAS — Maharashtrian Snacks" },
      {
        property: "og:description",
        content: "Chakli, bhakarwadi and shankarpada, made in small batches. झकासच.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const CRAVINGS = [
  { key: "SPICY", line: "You want heat. Chakli, Tikha Masala.", slug: "chakli" },
  { key: "SWEET", line: "Sugar-dusted and dangerous. Shankarpada.", slug: "shankarpada" },
  { key: "CRUNCHY", line: "Loud bite, no apologies. Bhakarwadi.", slug: "bhakarwadi" },
  { key: "CHAI-SIDE", line: "The 4pm classic. Bhakarwadi, Original.", slug: "bhakarwadi" },
];

function HomePage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const [craving, setCraving] = useState<(typeof CRAVINGS)[number]>(CRAVINGS[0]!);

  const heroImage = products[0] ? firstImage(products[0])?.url : undefined;
  const imageForCategory = (slug: string) => {
    const match = products.find((p) => categoryFor(p)?.slug === slug);
    return match ? firstImage(match)?.url : undefined;
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-red text-paper">
        <div
          className="pattern-halftone pointer-events-none absolute inset-0 opacity-25"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-16 pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="stamp-sm inline-block rotate-[-3deg] bg-gold px-3 py-1 text-xs font-bold tracking-[0.25em] text-ink">
              BATCH 001 · MADE IN MAHARASHTRA
            </p>
            <h1 className="font-display mt-6 text-6xl leading-[0.85] sm:text-8xl">
              SNACKS THAT
              <br />
              DON'T SIT
              <br />
              QUIETLY.
            </h1>
            <p className="font-marathi mt-5 text-2xl text-gold">झकासच.</p>
            <p className="mt-4 max-w-md text-lg text-paper/90">
              Chakli, bhakarwadi and shankarpada — the snacks Maharashtra grew up on, packed loud
              enough for the rest of the country.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="stamp stamp-hover bg-gold px-7 py-3.5 font-display text-2xl text-ink"
              >
                SHOP NOW →
              </Link>
              <Link
                to="/story"
                className="stamp stamp-hover bg-paper px-7 py-3.5 font-display text-2xl text-ink"
              >
                OUR STORY
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="stamp rotate-[2deg] overflow-hidden bg-paper">
              {heroImage && (
                <img
                  src={heroImage}
                  alt="ZAKAAS Maharashtrian snacks packed in retro tins"
                  width={1024}
                  height={1024}
                  className="aspect-square w-full object-cover"
                />
              )}
            </div>
            <RickshawArt className="animate-bump absolute -bottom-10 -left-6 h-24 w-auto" />
          </div>
        </div>

        <DrivingRickshaw className="h-20" size="h-16" />
      </section>

      <Marquee className="bg-gold" />

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-4xl">THREE HEROES</h2>
        <p className="mt-1 text-muted-foreground">Everything starts here.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((category, i) => {
            const image = imageForCategory(category.slug);
            return (
              <Reveal key={category.slug} delay={i * 90}>
                <Link
                  to="/shop"
                  search={{ c: category.slug }}
                  className="stamp stamp-hover block h-full overflow-hidden bg-card"
                >
                  {image && (
                    <img
                      src={image}
                      alt={`${category.name} from ZAKAAS`}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="aspect-[4/3] w-full border-b-[3px] border-ink object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="font-display text-sm text-red">{category.number}</p>
                    <h3 className="font-display text-3xl">{category.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{category.blurb}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CRAVING SELECTOR */}
      <section className="relative overflow-hidden bg-green py-16 text-paper">
        <div
          className="pattern-halftone pointer-events-none absolute inset-0 opacity-20"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-4xl">WHAT ARE YOU CRAVING?</h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {CRAVINGS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setCraving(option)}
                className={`stamp-sm px-5 py-2.5 text-sm font-bold tracking-[0.18em] transition-transform hover:-translate-y-0.5 ${
                  craving.key === option.key ? "bg-gold text-ink" : "bg-paper text-ink"
                }`}
              >
                {option.key}
              </button>
            ))}
          </div>
          <p className="font-display mt-8 text-3xl">{craving.line}</p>
          <Link
            to="/shop"
            search={{ c: craving.slug }}
            className="stamp stamp-hover mt-6 inline-block bg-gold px-6 py-3 font-display text-xl text-ink"
          >
            TAKE ME THERE →
          </Link>
        </div>
        <DrivingRickshaw className="h-16" size="h-12" />
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-4xl">THE LINEUP</h2>
          <Link to="/shop" className="text-sm font-bold tracking-[0.2em] hover:text-red">
            SEE ALL →
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="stamp mt-8 bg-card p-8 text-center font-bold">No products found.</p>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product, i) => (
              <Reveal key={product.node.id} delay={i * 70}>
                <ProductCard product={product} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <Marquee className="bg-red text-paper" slow />
    </div>
  );
}
