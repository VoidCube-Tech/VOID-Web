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
      className={`relative overflow-hidden border-b border-white/[0.09] bg-[#0a0b0b] px-5 pb-16 pt-32 text-[#f1eee8] sm:px-8 sm:pb-20 sm:pt-36 lg:px-12 lg:pb-24 lg:pt-44 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[8%] hidden w-px bg-white/[0.05] lg:block"
      />
      <div className="mx-auto w-full max-w-[90rem]">
        <div
          className={`border-t border-white/[0.11] pt-5 ${
            centered ? "mx-auto max-w-5xl text-center" : ""
          }`}
        >
          <div
            className={`mb-10 flex items-center gap-3 font-mono text-[0.64rem] uppercase tracking-[0.19em] text-[#a5a29c] sm:mb-14 ${
              centered ? "justify-center" : ""
            }`}
          >
            {index ? <span className="text-[#cf8653]">{index}</span> : null}
            {index && eyebrow ? (
              <span aria-hidden="true" className="h-px w-6 bg-[#c47a44]/55" />
            ) : null}
            {eyebrow ? <span>{eyebrow}</span> : null}
          </div>

          <div
            className={
              centered
                ? "mx-auto max-w-5xl"
                : "grid gap-7 lg:grid-cols-[minmax(0,1.75fr)_minmax(18rem,0.65fr)] lg:items-end lg:gap-16"
            }
          >
            <h1 className="max-w-[17ch] text-balance text-5xl font-medium leading-[0.96] tracking-[-0.06em] text-[#f0ede7] sm:text-6xl lg:text-[clamp(4.5rem,7vw,7.6rem)]">
              {title}
            </h1>

            {description ? (
              <div
                className={`text-pretty text-base leading-7 text-[#aaa7a0] sm:text-lg sm:leading-8 ${
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
