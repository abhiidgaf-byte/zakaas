import { createFileRoute, Link } from "@tanstack/react-router";

import { Marquee } from "@/components/site/Marquee";
import { Reveal } from "@/components/site/Reveal";
import { DrivingRickshaw } from "@/components/site/Rickshaw";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — ZAKAAS Maharashtrian Snacks" },
      {
        name: "description",
        content:
          "Maharashtra already knows what a good snack tastes like. ZAKAAS is how the rest of India finds out — chakli, bhakarwadi and shankarpada with a new attitude.",
      },
      { property: "og:title", content: "Our Story — ZAKAAS" },
      {
        property: "og:description",
        content: "Old-school Indian soul, new-school attitude. The story behind ZAKAAS.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StoryPage,
});

const MOMENTS = [
  { label: "CHAI TIME", line: "चहा झाला का?", copy: "4pm. Kettle on. Something crunchy, fast." },
  { label: "DABBA TIME", line: "थोडं अजून दे.", copy: "The steel dabba that never travels empty." },
  { label: "TRAVEL TIME", line: "पुडी कुठे आहे?", copy: "Window seat, ghats outside, packet open." },
  {
    label: "FRIENDS CAME OVER",
    line: "अरे काहीतरी खायला दे.",
    copy: "Zero notice. One packet solves it.",
  },
  { label: "MIDNIGHT", line: "भूक लागली.", copy: "Kitchen light on. Nobody saw anything." },
];

function StoryPage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-xs font-bold tracking-[0.3em] text-red">OUR STORY</p>
        <h1 className="font-marathi mt-4 text-4xl leading-tight sm:text-5xl">
          इथे snack म्हणजे फक्त snack नसतो.
        </h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          <p>
            Maharashtra already knows what a good snack tastes like. We just thought the rest of
            India should know too.
          </p>
          <p>
            Chakli at Diwali. Bhakarwadi in the office drawer. Shankarpada in the tin your aai
            refuses to let you finish. These snacks have been doing the heavy lifting at every chai,
            every train ride, every unannounced guest, for generations.
          </p>
          <p>
            ZAKAAS doesn't reinvent them. We make the snacks you already love feel impossible to
            ignore.
          </p>
        </div>
      </section>

      <div className="relative">
        <Marquee className="bg-gold" />
        <DrivingRickshaw className="h-16" size="h-14" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl">SNACKS, IN THE WILD</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MOMENTS.map((moment, i) => (
            <Reveal key={moment.label} delay={i * 70}>
              <article className="stamp h-full bg-card p-6">
                <p className="text-xs font-bold tracking-[0.24em] text-red">{moment.label}</p>
                <p className="font-marathi mt-3 text-2xl">{moment.line}</p>
                <p className="mt-3 text-sm text-muted-foreground">{moment.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 text-center">
        <Link
          to="/shop"
          className="stamp stamp-hover inline-block bg-red px-8 py-4 font-display text-2xl text-paper"
        >
          SHOP ZAKAAS →
        </Link>
      </section>
    </div>
  );
}
