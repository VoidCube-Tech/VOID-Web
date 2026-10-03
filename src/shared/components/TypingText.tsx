import { useEffect, useState, type CSSProperties } from "react";

interface Props {
  readonly messages: readonly string[];
  readonly accessibleText?: string;
  readonly typeSpeed?: number;
  readonly deleteSpeed?: number;
  readonly pauseAfterType?: number;
  readonly pauseAfterDelete?: number;
  readonly startDelay?: number;
  readonly loop?: boolean;
  readonly repeatSingle?: boolean;
  readonly cursor?: boolean;
  readonly cursorCharacter?: string;
  readonly cursorBlinkSpeed?: number;
}
type Phase = "waiting" | "typing" | "holding" | "deleting" | "switching";
interface Animation { index: number; position: number; phase: Phase }
const empty: Animation = { index: 0, position: 0, phase: "waiting" };
const delay = (value: number, fallback: number) => Number.isFinite(value) ? Math.max(0, value) : fallback;

export function TypingText({ messages, accessibleText, typeSpeed = 75, deleteSpeed = 40,
  pauseAfterType = 2200, pauseAfterDelete = 350, startDelay = 400,
  loop = true, repeatSingle = false, cursor = true, cursorCharacter = "|", cursorBlinkSpeed = 650,
}: Props) {
  const [animation, setAnimation] = useState<Animation>(empty);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Equal contents do not restart the animation on parent renders.
  const signature = JSON.stringify(messages.filter(message => message.length > 0));
  const phrases: string[] = JSON.parse(signature);
  const characters = phrases.map(message => Array.from(message));
  useEffect(() => {
    const phrases: string[] = JSON.parse(signature);
    const characters = phrases.map(message => Array.from(message));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let current = { ...empty };
    const cancel = () => { clearTimeout(timer); timer = undefined; };
    const schedule = (duration: number) => { timer = setTimeout(advance, duration); };
    function advance() {
      timer = undefined;
      const length = characters[current.index]?.length ?? 0;
      switch (current.phase) {
        case "waiting":
          current.phase = "typing";
          schedule(delay(typeSpeed, 75));
          break;
        case "typing":
          current.position += 1;
          if (current.position >= length) {
            current.phase = "holding";
            const last = current.index === characters.length - 1;
            if (!(last && !loop) && (characters.length > 1 || repeatSingle)) schedule(delay(pauseAfterType, 2200));
          } else schedule(delay(typeSpeed, 75));
          break;
        case "holding":
          current.phase = "deleting";
          schedule(delay(deleteSpeed, 40));
          break;
        case "deleting":
          current.position -= 1;
          if (current.position === 0) {
            current.phase = "switching";
            schedule(delay(pauseAfterDelete, 350));
          } else schedule(delay(deleteSpeed, 40));
          break;
        case "switching":
          current.index = (current.index + 1) % characters.length;
          current.phase = "typing";
          schedule(delay(typeSpeed, 75));
          break;
      }
      setAnimation({ ...current });
    }
    function restart() {
      cancel();
      setReducedMotion(preference.matches);
      current = { ...empty };
      setAnimation({ ...current });
      if (!preference.matches && characters.length) schedule(delay(startDelay, 400));
    }
    restart();
    preference.addEventListener("change", restart);
    return () => { cancel(); preference.removeEventListener("change", restart); };
  }, [signature, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete, startDelay, loop, repeatSingle]);

  if (!phrases.length) return <span className="sr-only">{accessibleText ?? ""}</span>;
  const visible = reducedMotion ? phrases[0] : characters[animation.index]?.slice(0, animation.position).join("") ?? "";
  const style = { "--typing-cursor-duration": `${Math.max(1, delay(cursorBlinkSpeed, 650))}ms` } as CSSProperties;
  return <span className="typing-text" style={style}>
    <span className="sr-only">{accessibleText ?? phrases[0]}</span>
    {phrases.map((message, index) => <span key={index} className="typing-text-reserve" aria-hidden="true">{message}{cursor && <span>{cursorCharacter}</span>}</span>)}
    <span className="typing-text-animated" aria-hidden="true">{visible}{cursor && !reducedMotion && <span className="typing-text-cursor">{cursorCharacter}</span>}</span>
    <span className="typing-text-static" aria-hidden="true">{phrases[0]}</span>
  </span>;
}
