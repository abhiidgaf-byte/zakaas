const DEFAULT_ITEMS = [
  "झकासच.",
  "चहा आहे का?",
  "थोडं अजून दे.",
  "MADE IN MAHARASHTRA",
  "OPEN. CRUNCH. REPEAT.",
  "BATCH 001",
];

export function Marquee({
  items = DEFAULT_ITEMS,
  className,
  slow = false,
}: {
  items?: string[];
  className?: string;
  slow?: boolean;
}) {
  const row = [...items, ...items, ...items];
  return (
    <div className={`overflow-hidden border-y-[3px] border-ink py-2.5 ${className ?? ""}`}>
      <div
        className={`${slow ? "animate-marquee-slow" : "animate-marquee"} flex w-max items-center gap-6 whitespace-nowrap will-change-transform`}
      >
        {[...row, ...row].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 text-sm font-semibold tracking-[0.18em] uppercase"
          >
            {item} <span aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
