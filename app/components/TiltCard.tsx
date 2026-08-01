"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { HTMLVanillaTiltElement } from "vanilla-tilt";

type TiltTag = "article" | "div" | "li";

export interface TiltCardProps extends HTMLAttributes<HTMLElement> {
  as?: TiltTag;
  children: ReactNode;
  disabled?: boolean;
}

export function TiltCard({
  as: Component = "div",
  children,
  className = "",
  disabled = false,
  style,
  ...props
}: TiltCardProps) {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current as HTMLVanillaTiltElement | null;
    if (!element || disabled) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let active = true;

    const initialize = async () => {
      if (motionQuery.matches || !pointerQuery.matches) return;
      const { default: VanillaTilt } = await import("vanilla-tilt");
      if (!active || !elementRef.current) return;

      VanillaTilt.init(element, {
        max: 3.5,
        perspective: 1400,
        scale: 1.008,
        speed: 850,
        transition: true,
        easing: "cubic-bezier(.16,1,.3,1)",
        reset: true,
        "reset-to-start": true,
        glare: false,
        gyroscope: false,
      });
    };

    void initialize();

    return () => {
      active = false;
      element.vanillaTilt?.destroy();
    };
  }, [disabled]);

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        elementRef.current = node;
      }}
      className={`will-change-transform motion-reduce:transform-none ${className}`}
      style={{ transformStyle: "preserve-3d", ...style }}
      {...props}
    >
      {children}
    </Component>
  );
}

export default TiltCard;
