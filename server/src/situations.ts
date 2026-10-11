// Static for the MVP.
// - title / description / tasks[].hu / phrases are shown in the UI.
// - role / scenario / tasks[].de go to the roleplay prompt (German).
// - opening is the partner's first line.
// Fixed German lines carry their Hungarian translation for the UI.

export interface Line {
  de: string;
  hu: string;
}

export interface Situation {
  id: string;
  emoji: string;
  title: string;
  description: string;
  role: string;
  scenario: string;
  opening: Line;
  tasks: { id: string; hu: string; de: string }[];
  phrases: Line[];
}

export const SITUATIONS: Situation[] = [
  {
    id: "buergeramt",
    emoji: "🏛️",
    title: "Bürgeramt – lakcímbejelentés",
    description: "Bejelented az új lakcímedet (Anmeldung) az ügyintézőnél.",
    role: "Sachbearbeiter/in im Bürgeramt",
    scenario:
      "Die Person möchte ihre neue Wohnung anmelden. Für die Anmeldung braucht sie einen Ausweis oder Pass und die Wohnungsgeberbestätigung. Die Meldebescheinigung bekommt sie sofort.",
    opening: {
      de: "Guten Tag! Bitte nehmen Sie Platz. Was kann ich für Sie tun?",
      hu: "Jó napot! Kérem, foglaljon helyet. Miben segíthetek?",
    },
    tasks: [
      { id: "anliegen", hu: "Mondd el, hogy be szeretnéd jelenteni a lakcímed", de: "Die Person sagt, dass sie ihre Wohnung anmelden möchte." },
      { id: "daten", hu: "Add meg a neved és az új címed", de: "Die Person nennt ihren Namen und ihre neue Adresse." },
      { id: "bescheinigung", hu: "Kérdezd meg, mikor kapod meg az igazolást", de: "Die Person fragt, wann sie die Meldebescheinigung bekommt." },
    ],
    phrases: [
      { de: "Ich möchte meine Wohnung anmelden.", hu: "Szeretném bejelenteni a lakcímemet." },
      { de: "Ich bin vor zwei Wochen umgezogen.", hu: "Két hete költöztem." },
      { de: "Hier ist mein Reisepass.", hu: "Itt az útlevelem." },
      { de: "Die Wohnungsgeberbestätigung habe ich dabei.", hu: "A szállásadói igazolás nálam van." },
      { de: "Wie schreibt man das?", hu: "Hogy írják ezt?" },
      { de: "Können Sie das bitte wiederholen?", hu: "Megismételné, kérem?" },
      { de: "Brauche ich noch weitere Unterlagen?", hu: "Kell még más dokumentum?" },
    ],
  },
  {
    id: "arzt",
    emoji: "🩺",
    title: "Orvosnál",
    description: "Elmondod a háziorvosnak, mi a panaszod, és válaszolsz a kérdéseire.",
    role: "Hausärztin/Hausarzt in einer Praxis",
    scenario:
      "Die Person kommt mit Beschwerden in die Sprechstunde. Frage nach den Symptomen und seit wann sie bestehen, untersuche kurz und gib am Ende einfache Ratschläge und ein Medikament.",
    opening: { de: "Guten Tag! Was führt Sie heute zu mir?", hu: "Jó napot! Mi hozta ma hozzám?" },
    tasks: [
      { id: "beschwerden", hu: "Mondd el, mi a panaszod", de: "Die Person beschreibt ihre Beschwerden." },
      { id: "seit-wann", hu: "Mondd meg, mióta tart", de: "Die Person sagt, seit wann sie die Beschwerden hat." },
      { id: "medikament", hu: "Kérdezd meg, meddig kell szedni a gyógyszert", de: "Die Person fragt, wie lange sie das Medikament nehmen soll." },
    ],
    phrases: [
      { de: "Ich habe Kopfschmerzen.", hu: "Fáj a fejem." },
      { de: "Mir ist schlecht.", hu: "Hányingerem van." },
      { de: "Ich habe seit drei Tagen Fieber.", hu: "Három napja lázas vagyok." },
      { de: "Mein Hals tut weh.", hu: "Fáj a torkom." },
      { de: "Ich bin allergisch gegen Penicillin.", hu: "Allergiás vagyok a penicillinre." },
      { de: "Ich brauche eine Krankschreibung.", hu: "Betegállományi igazolásra van szükségem." },
      { de: "Wie oft soll ich die Tabletten nehmen?", hu: "Milyen gyakran szedjem a tablettákat?" },
    ],
  },
  {
    id: "wohnung",
    emoji: "🏠",
    title: "Lakásnézés",
    description: "Megnézel egy kétszobás lakást, és a bérleti feltételekről kérdezel.",
    role: "Vermieter/in",
    scenario:
      "Besichtigung einer 2-Zimmer-Wohnung (58 m², 3. Stock, ohne Aufzug). Kaltmiete 780 €, Nebenkosten 190 €, Kaution drei Kaltmieten, frei ab dem 1. des nächsten Monats. Haustiere nur nach Absprache.",
    opening: {
      de: "Hallo, schön, dass Sie da sind! Kommen Sie herein. Haben Sie die Wohnung gut gefunden?",
      hu: "Üdvözlöm, örülök, hogy eljött! Jöjjön be. Könnyen megtalálta a lakást?",
    },
    tasks: [
      { id: "miete", hu: "Kérdezz rá a bérleti díjra és a rezsire", de: "Die Person fragt nach der Miete und den Nebenkosten." },
      { id: "einzug", hu: "Kérdezd meg, mikortól szabad a lakás", de: "Die Person fragt, ab wann die Wohnung frei ist." },
      { id: "beruf", hu: "Mondd el, mivel foglalkozol", de: "Die Person erzählt, was sie beruflich macht." },
    ],
    phrases: [
      { de: "Wie hoch ist die Miete?", hu: "Mennyi a bérleti díj?" },
      { de: "Sind die Nebenkosten inklusive?", hu: "Benne van a rezsi?" },
      { de: "Wie hoch ist die Kaution?", hu: "Mennyi a kaució?" },
      { de: "Ab wann ist die Wohnung frei?", hu: "Mikortól szabad a lakás?" },
      { de: "Darf man hier Haustiere haben?", hu: "Szabad itt háziállatot tartani?" },
      { de: "Ich arbeite als Krankenpfleger.", hu: "Ápolóként dolgozom." },
      { de: "Die Wohnung gefällt mir sehr gut.", hu: "Nagyon tetszik a lakás." },
    ],
  },
  {
    id: "restaurant",
    emoji: "🍽️",
    title: "Étteremben",
    description: "Asztalt kérsz, rendelsz, a végén pedig fizetsz.",
    role: "Kellner/in in einem deutschen Restaurant",
    scenario:
      "Ein gemütliches Restaurant mit deutscher Küche (Schnitzel, Käsespätzle, Salate, Apfelstrudel). Nimm die Bestellung auf, empfiehl etwas und bring am Ende die Rechnung.",
    opening: { de: "Guten Abend! Haben Sie reserviert?", hu: "Jó estét! Foglaltak asztalt?" },
    tasks: [
      { id: "tisch", hu: "Kérj asztalt két főre", de: "Die Person bittet um einen Tisch für zwei Personen." },
      { id: "bestellen", hu: "Rendelj egy főételt és egy italt", de: "Die Person bestellt ein Hauptgericht und ein Getränk." },
      { id: "zahlen", hu: "Kérd a számlát, és fizess kártyával", de: "Die Person bittet um die Rechnung und zahlt mit Karte." },
    ],
    phrases: [
      { de: "Einen Tisch für zwei Personen, bitte.", hu: "Egy asztalt két főre, kérem." },
      { de: "Was können Sie empfehlen?", hu: "Mit tud ajánlani?" },
      { de: "Ich hätte gern das Schnitzel.", hu: "A rántott húst kérném." },
      { de: "Ohne Zwiebeln, bitte.", hu: "Hagyma nélkül, kérem." },
      { de: "Ein Glas Wasser, bitte.", hu: "Egy pohár vizet kérek." },
      { de: "Die Rechnung, bitte.", hu: "A számlát, kérem." },
      { de: "Kann ich mit Karte zahlen?", hu: "Fizethetek kártyával?" },
    ],
  },
  {
    id: "bank",
    emoji: "💶",
    title: "Bankszámlanyitás",
    description: "Folyószámlát nyitsz egy bankfiókban.",
    role: "Bankberater/in in einer Filiale",
    scenario:
      "Die Person möchte ein Girokonto eröffnen. Es gibt zwei Kontomodelle: Basiskonto (kostenlos) und Komfortkonto (4,90 € im Monat). Du brauchst Ausweis, Meldebescheinigung und Steuer-ID. Die Bankkarte kommt nach etwa einer Woche per Post, die PIN separat.",
    opening: { de: "Guten Morgen! Was kann ich für Sie tun?", hu: "Jó reggelt! Miben segíthetek?" },
    tasks: [
      { id: "konto", hu: "Mondd el, hogy számlát szeretnél nyitni", de: "Die Person sagt, dass sie ein Konto eröffnen möchte." },
      { id: "kosten", hu: "Kérdezd meg, mennyibe kerül a számla havonta", de: "Die Person fragt, was das Konto im Monat kostet." },
      { id: "karte", hu: "Kérdezd meg, mikor kapod meg a bankkártyát", de: "Die Person fragt, wann die Bankkarte kommt." },
    ],
    phrases: [
      { de: "Ich möchte ein Girokonto eröffnen.", hu: "Szeretnék folyószámlát nyitni." },
      { de: "Was kostet das Konto im Monat?", hu: "Mennyibe kerül a számla havonta?" },
      { de: "Gibt es auch ein kostenloses Konto?", hu: "Van ingyenes számla is?" },
      { de: "Hier ist meine Meldebescheinigung.", hu: "Itt a lakcímbejelentő igazolásom." },
      { de: "Wann bekomme ich meine Karte?", hu: "Mikor kapom meg a kártyámat?" },
      { de: "Kann ich auch Online-Banking nutzen?", hu: "Használhatok netbankot is?" },
    ],
  },
  {
    id: "apotheke",
    emoji: "💊",
    title: "Gyógyszertárban",
    description: "Gyógyszert kérsz a megfázásodra, és megkérdezed, hogyan kell szedni.",
    role: "Apotheker/in",
    scenario:
      "Die Person hat Erkältungssymptome und braucht ein Medikament ohne Rezept. Frag nach Symptomen, Allergien und anderen Medikamenten, empfiehl etwas und erkläre die Dosierung.",
    opening: { de: "Guten Tag! Wie kann ich Ihnen helfen?", hu: "Jó napot! Miben segíthetek?" },
    tasks: [
      { id: "symptome", hu: "Írd le a tüneteidet", de: "Die Person beschreibt ihre Symptome." },
      { id: "allergien", hu: "Mondd meg, allergiás vagy-e valamire", de: "Die Person sagt, ob sie Allergien hat." },
      { id: "dosierung", hu: "Kérdezd meg, hogyan kell szedni a gyógyszert", de: "Die Person fragt, wie sie das Medikament nehmen soll." },
    ],
    phrases: [
      { de: "Ich habe Schnupfen und Husten.", hu: "Náthás vagyok és köhögök." },
      { de: "Haben Sie etwas gegen Halsschmerzen?", hu: "Van valami torokfájás ellen?" },
      { de: "Brauche ich dafür ein Rezept?", hu: "Kell ehhez recept?" },
      { de: "Ich bin gegen nichts allergisch.", hu: "Semmire sem vagyok allergiás." },
      { de: "Wie oft am Tag soll ich das nehmen?", hu: "Naponta hányszor szedjem?" },
      { de: "Was kostet das?", hu: "Mennyibe kerül?" },
    ],
  },
  {
    id: "bahnhof",
    emoji: "🚆",
    title: "Jegyvásárlás a pályaudvaron",
    description: "Vonatjegyet veszel Berlinből Münchenbe, és az átszállásról kérdezel.",
    role: "Mitarbeiter/in im Reisezentrum am Bahnhof",
    scenario:
      "Die Person möchte eine Fahrkarte von Berlin nach München kaufen. Es gibt einen direkten ICE um 9:04 Uhr (4 Stunden, 89 €) und eine günstigere Verbindung mit Umstieg in Leipzig um 10:15 Uhr (5,5 Stunden, 59 €). Der ICE fährt von Gleis 7 ab. Frag nach Datum und ob Hin- und Rückfahrt.",
    opening: { de: "Guten Tag, der Nächste, bitte! Wohin möchten Sie fahren?", hu: "Jó napot, a következőt kérem! Hová szeretne utazni?" },
    tasks: [
      { id: "ziel", hu: "Mondd meg, hová és mikor utaznál", de: "Die Person sagt, wohin und wann sie fahren möchte." },
      { id: "guenstiger", hu: "Kérdezz rá egy olcsóbb lehetőségre", de: "Die Person fragt nach einer günstigeren Verbindung." },
      { id: "gleis", hu: "Kérdezd meg, melyik vágányról indul a vonat", de: "Die Person fragt, von welchem Gleis der Zug abfährt." },
    ],
    phrases: [
      { de: "Eine Fahrkarte nach München, bitte.", hu: "Egy jegyet kérek Münchenbe." },
      { de: "Nur die Hinfahrt, bitte.", hu: "Csak oda, kérem." },
      { de: "Hin und zurück, bitte.", hu: "Oda-vissza, kérem." },
      { de: "Gibt es eine günstigere Verbindung?", hu: "Van olcsóbb járat?" },
      { de: "Muss ich umsteigen?", hu: "Át kell szállnom?" },
      { de: "Von welchem Gleis fährt der Zug ab?", hu: "Melyik vágányról indul a vonat?" },
      { de: "Wann kommt der Zug in München an?", hu: "Mikor ér a vonat Münchenbe?" },
    ],
  },
  {
    id: "interview",
    emoji: "💼",
    title: "Állásinterjú",
    description: "Bemutatkozol egy ügyfélszolgálati állás interjúján, és a tapasztalataidról beszélsz.",
    role: "Personalleiter/in in einem mittelgroßen Unternehmen",
    scenario:
      "Vorstellungsgespräch für eine Stelle im Kundenservice. Frag nach Berufserfahrung, Stärken und Deutschkenntnissen. Die Stelle ist Vollzeit (40 Stunden pro Woche, Gleitzeit), Einstieg ab dem nächsten Monat möglich.",
    opening: {
      de: "Guten Tag und herzlich willkommen! Erzählen Sie doch bitte kurz etwas über sich.",
      hu: "Jó napot, és üdvözlöm! Kérem, meséljen röviden magáról.",
    },
    tasks: [
      { id: "vorstellen", hu: "Mutatkozz be röviden", de: "Die Person stellt sich kurz vor." },
      { id: "erfahrung", hu: "Beszélj a munkatapasztalatodról", de: "Die Person erzählt von ihrer Berufserfahrung." },
      { id: "arbeitszeit", hu: "Kérdezz rá a munkaidőre", de: "Die Person fragt nach den Arbeitszeiten." },
    ],
    phrases: [
      { de: "Ich komme aus Ungarn und lebe seit einem Jahr in Deutschland.", hu: "Magyarországról jöttem, és egy éve élek Németországban." },
      { de: "Ich habe drei Jahre als Verkäufer gearbeitet.", hu: "Három évig eladóként dolgoztam." },
      { de: "Meine Stärke ist, dass ich gut im Team arbeite.", hu: "Az erősségem, hogy jól dolgozom csapatban." },
      { de: "Ich lerne gerade Deutsch auf B1-Niveau.", hu: "Jelenleg B1-es szinten tanulok németül." },
      { de: "Wie sind die Arbeitszeiten?", hu: "Milyen a munkaidő?" },
      { de: "Wann könnte ich anfangen?", hu: "Mikor kezdhetnék?" },
    ],
  },
  {
    id: "vermieter",
    emoji: "📞",
    title: "Telefon a főbérlőnek",
    description: "Felhívod a főbérlőt, mert elromlott a fűtés, és időpontot egyeztetsz a szerelőnek.",
    role: "Vermieter/in, am Telefon",
    scenario:
      "Die Person ruft an, weil die Heizung in ihrer Wohnung nicht funktioniert. Frag nach dem Problem und seit wann es besteht, und vereinbare einen Termin für den Handwerker (z. B. Donnerstag zwischen 9 und 12 Uhr).",
    opening: { de: "Hallo, hier Schmidt. Wer ist da, bitte?", hu: "Halló, Schmidt. Ki beszél?" },
    tasks: [
      { id: "anruf", hu: "Mutatkozz be, és mondd el, miért hívod", de: "Die Person stellt sich vor und sagt, warum sie anruft." },
      { id: "problem", hu: "Írd le pontosan a problémát", de: "Die Person beschreibt das Problem genau." },
      { id: "termin", hu: "Egyeztess időpontot a szerelőnek", de: "Die Person vereinbart einen Termin für den Handwerker." },
    ],
    phrases: [
      { de: "Hier ist … aus der Wohnung im zweiten Stock.", hu: "… vagyok a második emeleti lakásból." },
      { de: "Die Heizung funktioniert nicht.", hu: "Nem működik a fűtés." },
      { de: "Seit gestern ist es in der Wohnung sehr kalt.", hu: "Tegnap óta nagyon hideg van a lakásban." },
      { de: "Können Sie einen Handwerker schicken?", hu: "Tudna küldeni egy szerelőt?" },
      { de: "Am Vormittag bin ich zu Hause.", hu: "Délelőtt otthon vagyok." },
      { de: "Passt Ihnen Donnerstag?", hu: "Megfelel Önnek a csütörtök?" },
    ],
  },
  {
    id: "supermarkt",
    emoji: "🛒",
    title: "Szupermarketben",
    description: "Megkérdezed, hol találsz néhány terméket, aztán fizetsz a pénztárnál.",
    role: "Mitarbeiter/in im Supermarkt (zuerst im Laden, später an der Kasse)",
    scenario:
      "Die Person sucht Produkte (Mehl in Gang 4, laktosefreie Milch im Kühlregal hinten links) und fragt nach dem Pfandautomaten (am Eingang rechts). Danach bezahlt sie an der Kasse (23,47 €).",
    opening: {
      de: "Hallo! Kann ich Ihnen helfen? Sie suchen bestimmt etwas.",
      hu: "Üdvözlöm! Segíthetek? Biztosan keres valamit.",
    },
    tasks: [
      { id: "produkt", hu: "Kérdezd meg, hol találsz egy terméket", de: "Die Person fragt, wo sie ein Produkt findet." },
      { id: "pfand", hu: "Kérdezd meg, hol lehet visszaváltani az üvegeket", de: "Die Person fragt, wo sie Pfandflaschen zurückgeben kann." },
      { id: "kasse", hu: "Fizess a pénztárnál", de: "Die Person bezahlt an der Kasse." },
    ],
    phrases: [
      { de: "Entschuldigung, wo finde ich Mehl?", hu: "Elnézést, hol találom a lisztet?" },
      { de: "Haben Sie laktosefreie Milch?", hu: "Van laktózmentes tejük?" },
      { de: "Wo kann ich die Pfandflaschen abgeben?", hu: "Hol tudom leadni a betétdíjas palackokat?" },
      { de: "Ich brauche keine Tüte, danke.", hu: "Nem kérek szatyrot, köszönöm." },
      { de: "Kann ich mit Karte zahlen?", hu: "Fizethetek kártyával?" },
      { de: "Den Kassenbon, bitte.", hu: "A blokkot kérném." },
    ],
  },
];

export function getSituation(id: string) {
  return SITUATIONS.find((s) => s.id === id);
}

export function toPublicSituation({ id, emoji, title, description, tasks, phrases }: Situation) {
  return { id, emoji, title, description, tasks: tasks.map(({ id, hu }) => ({ id, hu })), phrases };
}
