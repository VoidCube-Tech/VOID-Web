import type { MouseEventHandler } from "react";
import Link from "next/link";

type BrandMarkProps = {
  className?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

/**
 * Marca leve: três planos CSS formam o cubo e o ponto dourado identifica o
 * núcleo. Não há canvas, SVG externo ou loop de animação no cabeçalho.
 */
export function BrandMark({
  className = "",
  href = "/",
  onClick,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="VoidCube — página inicial"
      className={`group inline-flex w-fit items-center gap-3 text-porcelain outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void ${className}`}
    >
      <span
        aria-hidden="true"
        className="relative grid size-9 shrink-0 place-items-center [perspective:140px]"
      >
        <span className="absolute inset-[5px] border-l border-t border-signal-blue/25" />
        <span className="absolute left-1/2 top-1/2 size-4 [transform:translate(-50%,-50%)_rotateX(-24deg)_rotateY(38deg)] [transform-style:preserve-3d] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:[transform:translate(-50%,-50%)_rotateX(-20deg)_rotateY(48deg)] group-active:scale-[0.98] motion-reduce:transition-none">
          <span className="absolute inset-0 border border-signal-blue/95 bg-signal-deep/20 [transform:translateZ(8px)]" />
          <span className="absolute inset-0 border border-signal-blue/55 bg-signal-blue/[0.06] [transform:rotateY(90deg)_translateZ(8px)]" />
          <span className="absolute inset-0 border border-[#78A6FF]/70 bg-signal-blue/[0.1] [transform:rotateX(90deg)_translateZ(8px)]" />
          <span className="absolute left-1/2 top-1/2 size-1 bg-node-gold shadow-[0_0_10px_rgba(201,164,93,0.55)] [transform:translate(-50%,-50%)_translateZ(9px)]" />
        </span>
        <span className="absolute bottom-0.5 right-0.5 size-1 bg-node-gold" />
      </span>

      <span className="font-display text-[1.08rem] font-semibold leading-none tracking-[-0.04em]">
        Void<span className="text-[#78A6FF]">Cube</span>
      </span>
    </Link>
  );
}

export default BrandMark;
