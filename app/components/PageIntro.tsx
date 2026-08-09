import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function PageIntro({
  eyebrow,
  index,
  title,
  description,
  align = "left",
  className = "",
}: PageIntroProps) {
  const centered = align === "center";

  return (
    <section
      className={`relative overflow-hidden border-b border-signal-blue/20 bg-[radial-gradient(circle_at_82%_10%,rgba(31,91,216,0.18),transparent_32rem),linear-gradient(180deg,rgba(6,22,47,0.82),rgba(2,4,10,0.98))] px-5 pb-16 pt-32 text-porcelain sm:px-8 sm:pb-20 sm:pt-36 lg:px-12 lg:pb-24 lg:pt-44 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[13%] hidden w-px bg-spectral-blue/10 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-24 h-80 w-80 rotate-45 border border-spectral-blue/10"
      />

      <div className="mx-auto w-full max-w-[92rem]">
        <div
          className={`border-t border-spectral-blue/25 pt-5 ${
            centered ? "mx-auto max-w-5xl text-center" : ""
          }`}
        >
          {eyebrow || index ? (
            <div
              className={`mb-10 flex items-center gap-3 text-sm font-medium tracking-[0.06em] text-spectral-blue sm:mb-14 ${
                centered ? "justify-center" : ""
              }`}
            >
              {index ? (
                <span className="font-mono text-node-gold">{index}</span>
              ) : null}
              {index && eyebrow ? (
                <span aria-hidden="true" className="h-px w-6 bg-signal-blue/60" />
              ) : null}
              {eyebrow ? <span>{eyebrow}</span> : null}
            </div>
          ) : null}

          <div
            className={
              centered
                ? "mx-auto max-w-5xl"
                : "grid gap-7 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-16"
            }
          >
            <h1 className="max-w-[18ch] text-balance font-display text-4xl font-medium leading-[0.98] tracking-[-0.055em] text-porcelain sm:text-6xl lg:text-[clamp(4.5rem,7vw,7.4rem)]">
              {title}
            </h1>

            {description ? (
              <div
                className={`text-pretty text-base leading-7 text-mineral sm:text-lg sm:leading-8 ${
                  centered ? "mx-auto mt-8 max-w-2xl" : "max-w-lg lg:pb-2"
                }`}
              >
                {description}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageIntro;
