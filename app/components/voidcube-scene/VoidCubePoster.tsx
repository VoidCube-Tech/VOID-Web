import { useId } from "react";

export interface VoidCubePosterProps {
  className?: string;
}

export function VoidCubePoster({ className = "" }: VoidCubePosterProps) {
  const id = useId().replaceAll(":", "");
  const shellGradient = `shell-${id}`;
  const shellSideGradient = `shell-side-${id}`;
  const coreGradient = `core-${id}`;
  const goldGradient = `gold-${id}`;
  const shadowFilter = `shadow-${id}`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 640 640"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={shellGradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#293B55" />
          <stop offset="0.32" stopColor="#0C1320" />
          <stop offset="1" stopColor="#01030A" />
        </linearGradient>
        <linearGradient id={shellSideGradient} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#02050B" />
          <stop offset="1" stopColor="#18263A" />
        </linearGradient>
        <radialGradient id={coreGradient} cx="34%" cy="24%" r="82%">
          <stop offset="0" stopColor="#78A6FF" />
          <stop offset="0.35" stopColor="#1F5BD8" />
          <stop offset="1" stopColor="#06143D" />
        </radialGradient>
        <linearGradient id={goldGradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#F1D889" />
          <stop offset="0.5" stopColor="#C9A45D" />
          <stop offset="1" stopColor="#684D1D" />
        </linearGradient>
        <filter id={shadowFilter} height="180%" width="180%" x="-40%" y="-40%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <ellipse
        cx="322"
        cy="510"
        fill="#000"
        filter={`url(#${shadowFilter})`}
        opacity="0.56"
        rx="154"
        ry="34"
      />

      <g opacity="0.96" stroke="#2F6BFF" strokeWidth="7">
        <path d="M320 180V456" />
        <path d="M183 318H458" />
        <path d="M225 220L418 414" />
      </g>

      <g filter={`url(#${shadowFilter})`} opacity="0.26">
        <rect fill="#1F5BD8" height="190" rx="18" width="190" x="225" y="224" />
      </g>

      <g>
        <path d="M257 226L320 191L383 226L320 262Z" fill="#4B8DFF" />
        <path d="M257 226L320 262V336L257 299Z" fill="#083084" />
        <path d="M383 226L320 262V336L383 299Z" fill={`url(#${coreGradient})`} />
      </g>

      <g stroke="#314660" strokeLinejoin="round" strokeWidth="2">
        <g>
          <path d="M155 139L255 115L296 159L196 184Z" fill={`url(#${shellGradient})`} />
          <path d="M155 139V246L196 290V184Z" fill="#02050B" />
          <path d="M196 184L296 159V265L196 290Z" fill={`url(#${shellSideGradient})`} />
        </g>
        <g>
          <path d="M349 113L449 136L489 181L389 159Z" fill={`url(#${shellGradient})`} />
          <path d="M389 159L489 181V288L389 266Z" fill="#07111F" />
          <path d="M349 113V220L389 266V159Z" fill="#18263A" />
        </g>
        <g>
          <path d="M121 305L221 280L263 325L162 350Z" fill={`url(#${shellGradient})`} />
          <path d="M121 305V412L162 457V350Z" fill="#01030A" />
          <path d="M162 350L263 325V432L162 457Z" fill={`url(#${shellSideGradient})`} />
        </g>
        <g>
          <path d="M380 323L480 300L521 345L421 368Z" fill={`url(#${shellGradient})`} />
          <path d="M421 368L521 345V452L421 476Z" fill="#07111F" />
          <path d="M380 323V430L421 476V368Z" fill="#18263A" />
        </g>
      </g>

      <g fill={`url(#${goldGradient})`} stroke="#F1D889" strokeWidth="1.5">
        <circle cx="320" cy="208" r="8" />
        <circle cx="377" cy="274" r="7" />
        <circle cx="279" cy="299" r="6" />
        <circle cx="331" cy="332" r="5" />
      </g>
    </svg>
  );
}

export default VoidCubePoster;
