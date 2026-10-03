export type ContactKind = "whatsapp" | "email" | "instagram" | "youtube" | "linkedin";
export interface ContactLink { kind: ContactKind; value: string; href: string; icon: string }
const officialWhatsAppNumber = "+55 91 98185-9653";
const normalizePhone = (value: string) => value.trim().replace(/[\s()+-]/g, "");
const phone = normalizePhone(import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? "");
export const whatsappNumber: string = /^[1-9]\d{7,14}$/.test(phone) ? phone : normalizePhone(officialWhatsAppNumber);
function social(kind: ContactKind, value: string | undefined, icon: string): ContactLink[] {
  if (!value) return [];
  try { const url = new URL(value); return url.protocol === "https:" ? [{ kind, value: url.hostname + url.pathname.replace(/\/$/, ""), href: url.href, icon }] : []; } catch { return []; }
}
const email = (import.meta.env.PUBLIC_CONTACT_EMAIL ?? "").trim();
export const contactLinks: readonly ContactLink[] = [
  { kind: "whatsapp", value: `+${whatsappNumber}`, href: `https://wa.me/${whatsappNumber}`, icon: "chat" },
  ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? [{ kind: "email" as const, value: email, href: `mailto:${email}`, icon: "mail" }] : []),
  ...social("instagram", import.meta.env.PUBLIC_INSTAGRAM_URL, "photo_camera"),
  ...social("youtube", import.meta.env.PUBLIC_YOUTUBE_URL, "play_circle"),
  ...social("linkedin", import.meta.env.PUBLIC_LINKEDIN_URL, "work"),
];


