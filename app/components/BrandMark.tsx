import Link from "next/link";

type BrandMarkProps = {
  className?: string;
  href?: string;
};

/**
 * A marca usa um cubo de arame construído somente com CSS. O centro vazado
 * mantém a referência ao nome sem depender de um asset ou SVG externo.
 */
export function BrandMark({ className = "", href = "/" }: BrandMarkProps) {
  return (
    <Link
      href={href}
      aria-label="VoidCube — página inicial"
      className={`group inline-flex w-fit items-center gap-3 text-porcelain outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-4 focus-visible:ring-offset-void ${className}`}
    >
      <span
        aria-hidden="true"
        className="relative grid size-9 shrink-0 place-items-center [perspective:120px]"
      >
        <span className="absolute inset-0 border border-signal-blue/20" />
        <span className="absolute left-1/2 top-1/2 size-[18px] [transform:translate(-50%,-50%)_rotateX(-24deg)_rotateY(38deg)] [transform-style:preserve-3d] transition-transform duration-500 ease-out group-hover:[transform:translate(-50%,-50%)_rotateX(-18deg)_rotateY(58deg)] motion-reduce:transition-none">
          <span className="absolute inset-0 border border-signal-blue/90 bg-signal-blue/[0.025] [transform:translateZ(9px)]" />
          <span className="absolute inset-0 border border-signal-blue/35 [transform:rotateY(180deg)_translateZ(9px)]" />
          <span className="absolute inset-0 border border-signal-blue/60 bg-signal-blue/[0.035] [transform:rotateY(90deg)_translateZ(9px)]" />
          <span className="absolute inset-0 border border-signal-blue/45 [transform:rotateY(-90deg)_translateZ(9px)]" />
          <span className="absolute inset-0 border border-signal-blue/70 bg-signal-blue/[0.045] [transform:rotateX(90deg)_translateZ(9px)]" />
          <span className="absolute inset-0 border border-signal-blue/30 [transform:rotateX(-90deg)_translateZ(9px)]" />
        </span>
        <span className="absolute bottom-0 right-0 size-1.5 bg-node-gold" />
      </span>

      <span className="font-display text-[1.08rem] font-semibold leading-none tracking-[-0.045em]">
        Void<span className="text-signal-blue">Cube</span>
      </span>
    </Link>
  );
}

export default BrandMark;
