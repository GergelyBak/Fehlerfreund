// Static for the MVP. `title`/`description` are shown in the UI (Hungarian);
// `role`/`scenario`/`opening` go to the roleplay prompt and the chat (German).
export interface Situation {
  id: string;
  emoji: string;
  title: string;
  description: string;
  role: string;
  scenario: string;
  opening: string;
}

export const SITUATIONS: Situation[] = [
  {
    id: "buergeramt",
    emoji: "🏛️",
    title: "Bürgeramt – lakcímbejelentés",
    description: "Bejelented az új lakcímedet (Anmeldung) az ügyintézőnél.",
    role: "Sachbearbeiter/in im Bürgeramt",
    scenario:
      "Die Person möchte ihre neue Wohnung anmelden. Für die Anmeldung braucht sie einen Ausweis oder Pass und die Wohnungsgeberbestätigung. Frage nach den Unterlagen und den persönlichen Daten.",
    opening: "Guten Tag! Bitte nehmen Sie Platz. Was kann ich für Sie tun?",
  },
  {
    id: "arzt",
    emoji: "🩺",
    title: "Orvosnál",
    description: "Elmondod a háziorvosnak, mi a panaszod, és válaszolsz a kérdéseire.",
    role: "Hausärztin/Hausarzt in einer Praxis",
    scenario:
      "Die Person kommt mit Beschwerden in die Sprechstunde. Frage nach den Symptomen und seit wann sie bestehen, und gib am Ende einfache Ratschläge.",
    opening: "Guten Tag! Was führt Sie heute zu mir?",
  },
  {
    id: "wohnung",
    emoji: "🏠",
    title: "Lakásnézés",
    description: "Megnézel egy kétszobás lakást, és a bérleti feltételekről kérdezel.",
    role: "Vermieter/in",
    scenario:
      "Besichtigung einer 2-Zimmer-Wohnung (58 m², 3. Stock, ohne Aufzug). Kaltmiete 780 €, Nebenkosten 190 €, Kaution drei Kaltmieten, frei ab dem 1. des nächsten Monats. Beantworte Fragen und frag die Person auch nach Beruf und Einzugstermin.",
    opening: "Hallo, schön, dass Sie da sind! Kommen Sie herein. Haben Sie die Wohnung gut gefunden?",
  },
  {
    id: "restaurant",
    emoji: "🍽️",
    title: "Étteremben",
    description: "Asztalt kérsz, rendelsz, a végén pedig fizetsz.",
    role: "Kellner/in in einem deutschen Restaurant",
    scenario:
      "Ein gemütliches Restaurant mit deutscher Küche (Schnitzel, Käsespätzle, Salate, Apfelstrudel). Nimm die Bestellung auf, empfiehl etwas und bring am Ende die Rechnung.",
    opening: "Guten Abend! Haben Sie reserviert?",
  },
];

export function getSituation(id: string) {
  return SITUATIONS.find((s) => s.id === id);
}

export function toPublicSituation({ id, emoji, title, description }: Situation) {
  return { id, emoji, title, description };
}
