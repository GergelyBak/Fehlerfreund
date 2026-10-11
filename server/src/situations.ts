// Static for the MVP.
// - title / description / tasks / phrase translations are shown in the UI,
//   in the learner's language (Hungarian or English).
// - role / scenario / tasks[].de go to the roleplay prompt (German).
// - opening is the partner's first line.

export const UI_LANGUAGES = ["hu", "en"] as const;
export type UiLanguage = (typeof UI_LANGUAGES)[number];

type Localized = Record<UiLanguage, string>;

export interface Line extends Localized {
  de: string;
}

export interface Situation {
  id: string;
  emoji: string;
  title: Localized;
  description: Localized;
  role: string;
  scenario: string;
  opening: Line;
  tasks: ({ id: string; de: string } & Localized)[];
  phrases: Line[];
}

export const SITUATIONS: Situation[] = [
  {
    id: "buergeramt",
    emoji: "🏛️",
    title: { hu: "Bürgeramt – lakcímbejelentés", en: "Bürgeramt – registering your address" },
    description: {
      hu: "Bejelented az új lakcímedet (Anmeldung) az ügyintézőnél.",
      en: "You register your new address (Anmeldung) with the clerk.",
    },
    role: "Sachbearbeiter/in im Bürgeramt",
    scenario:
      "Die Person möchte ihre neue Wohnung anmelden. Für die Anmeldung braucht sie einen Ausweis oder Pass und die Wohnungsgeberbestätigung. Die Meldebescheinigung bekommt sie sofort.",
    opening: {
      de: "Guten Tag! Bitte nehmen Sie Platz. Was kann ich für Sie tun?",
      hu: "Jó napot! Kérem, foglaljon helyet. Miben segíthetek?",
      en: "Good afternoon! Please take a seat. What can I do for you?",
    },
    tasks: [
      {
        id: "anliegen",
        hu: "Mondd el, hogy be szeretnéd jelenteni a lakcímed",
        en: "Say that you want to register your address",
        de: "Die Person sagt, dass sie ihre Wohnung anmelden möchte.",
      },
      {
        id: "daten",
        hu: "Add meg a neved és az új címed",
        en: "Give your name and your new address",
        de: "Die Person nennt ihren Namen und ihre neue Adresse.",
      },
      {
        id: "bescheinigung",
        hu: "Kérdezd meg, mikor kapod meg az igazolást",
        en: "Ask when you will get the certificate",
        de: "Die Person fragt, wann sie die Meldebescheinigung bekommt.",
      },
    ],
    phrases: [
      { de: "Ich möchte meine Wohnung anmelden.", hu: "Szeretném bejelenteni a lakcímemet.", en: "I'd like to register my address." },
      { de: "Ich bin vor zwei Wochen umgezogen.", hu: "Két hete költöztem.", en: "I moved two weeks ago." },
      { de: "Hier ist mein Reisepass.", hu: "Itt az útlevelem.", en: "Here is my passport." },
      {
        de: "Die Wohnungsgeberbestätigung habe ich dabei.",
        hu: "A szállásadói igazolás nálam van.",
        en: "I have the landlord's confirmation with me.",
      },
      { de: "Wie schreibt man das?", hu: "Hogy írják ezt?", en: "How do you spell that?" },
      { de: "Können Sie das bitte wiederholen?", hu: "Megismételné, kérem?", en: "Could you repeat that, please?" },
      { de: "Brauche ich noch weitere Unterlagen?", hu: "Kell még más dokumentum?", en: "Do I need any other documents?" },
    ],
  },
  {
    id: "arzt",
    emoji: "🩺",
    title: { hu: "Orvosnál", en: "At the doctor's" },
    description: {
      hu: "Elmondod a háziorvosnak, mi a panaszod, és válaszolsz a kérdéseire.",
      en: "You tell the GP what's wrong and answer their questions.",
    },
    role: "Hausärztin/Hausarzt in einer Praxis",
    scenario:
      "Die Person kommt mit Beschwerden in die Sprechstunde. Frage nach den Symptomen und seit wann sie bestehen, untersuche kurz und gib am Ende einfache Ratschläge und ein Medikament.",
    opening: {
      de: "Guten Tag! Was führt Sie heute zu mir?",
      hu: "Jó napot! Mi hozta ma hozzám?",
      en: "Good afternoon! What brings you here today?",
    },
    tasks: [
      { id: "beschwerden", hu: "Mondd el, mi a panaszod", en: "Describe your symptoms", de: "Die Person beschreibt ihre Beschwerden." },
      {
        id: "seit-wann",
        hu: "Mondd meg, mióta tart",
        en: "Say how long it has been going on",
        de: "Die Person sagt, seit wann sie die Beschwerden hat.",
      },
      {
        id: "medikament",
        hu: "Kérdezd meg, meddig kell szedni a gyógyszert",
        en: "Ask how long to take the medicine",
        de: "Die Person fragt, wie lange sie das Medikament nehmen soll.",
      },
    ],
    phrases: [
      { de: "Ich habe Kopfschmerzen.", hu: "Fáj a fejem.", en: "I have a headache." },
      { de: "Mir ist schlecht.", hu: "Hányingerem van.", en: "I feel sick." },
      { de: "Ich habe seit drei Tagen Fieber.", hu: "Három napja lázas vagyok.", en: "I've had a fever for three days." },
      { de: "Mein Hals tut weh.", hu: "Fáj a torkom.", en: "My throat hurts." },
      { de: "Ich bin allergisch gegen Penicillin.", hu: "Allergiás vagyok a penicillinre.", en: "I'm allergic to penicillin." },
      { de: "Ich brauche eine Krankschreibung.", hu: "Betegállományi igazolásra van szükségem.", en: "I need a sick note." },
      { de: "Wie oft soll ich die Tabletten nehmen?", hu: "Milyen gyakran szedjem a tablettákat?", en: "How often should I take the tablets?" },
    ],
  },
  {
    id: "wohnung",
    emoji: "🏠",
    title: { hu: "Lakásnézés", en: "Flat viewing" },
    description: {
      hu: "Megnézel egy kétszobás lakást, és a bérleti feltételekről kérdezel.",
      en: "You view a two-room flat and ask about the rental terms.",
    },
    role: "Vermieter/in",
    scenario:
      "Besichtigung einer 2-Zimmer-Wohnung (58 m², 3. Stock, ohne Aufzug). Kaltmiete 780 €, Nebenkosten 190 €, Kaution drei Kaltmieten, frei ab dem 1. des nächsten Monats. Haustiere nur nach Absprache.",
    opening: {
      de: "Hallo, schön, dass Sie da sind! Kommen Sie herein. Haben Sie die Wohnung gut gefunden?",
      hu: "Üdvözlöm, örülök, hogy eljött! Jöjjön be. Könnyen megtalálta a lakást?",
      en: "Hello, nice to see you! Come in. Did you find the flat easily?",
    },
    tasks: [
      {
        id: "miete",
        hu: "Kérdezz rá a bérleti díjra és a rezsire",
        en: "Ask about the rent and the utility costs",
        de: "Die Person fragt nach der Miete und den Nebenkosten.",
      },
      {
        id: "einzug",
        hu: "Kérdezd meg, mikortól szabad a lakás",
        en: "Ask when the flat is available",
        de: "Die Person fragt, ab wann die Wohnung frei ist.",
      },
      { id: "beruf", hu: "Mondd el, mivel foglalkozol", en: "Say what you do for a living", de: "Die Person erzählt, was sie beruflich macht." },
    ],
    phrases: [
      { de: "Wie hoch ist die Miete?", hu: "Mennyi a bérleti díj?", en: "How much is the rent?" },
      { de: "Sind die Nebenkosten inklusive?", hu: "Benne van a rezsi?", en: "Are utilities included?" },
      { de: "Wie hoch ist die Kaution?", hu: "Mennyi a kaució?", en: "How much is the deposit?" },
      { de: "Ab wann ist die Wohnung frei?", hu: "Mikortól szabad a lakás?", en: "When is the flat available?" },
      { de: "Darf man hier Haustiere haben?", hu: "Szabad itt háziállatot tartani?", en: "Are pets allowed here?" },
      { de: "Ich arbeite als Krankenpfleger.", hu: "Ápolóként dolgozom.", en: "I work as a nurse." },
      { de: "Die Wohnung gefällt mir sehr gut.", hu: "Nagyon tetszik a lakás.", en: "I like the flat a lot." },
    ],
  },
  {
    id: "restaurant",
    emoji: "🍽️",
    title: { hu: "Étteremben", en: "At a restaurant" },
    description: { hu: "Asztalt kérsz, rendelsz, a végén pedig fizetsz.", en: "You ask for a table, order, and pay at the end." },
    role: "Kellner/in in einem deutschen Restaurant",
    scenario:
      "Ein gemütliches Restaurant mit deutscher Küche (Schnitzel, Käsespätzle, Salate, Apfelstrudel). Nimm die Bestellung auf, empfiehl etwas und bring am Ende die Rechnung.",
    opening: { de: "Guten Abend! Haben Sie reserviert?", hu: "Jó estét! Foglaltak asztalt?", en: "Good evening! Do you have a reservation?" },
    tasks: [
      { id: "tisch", hu: "Kérj asztalt két főre", en: "Ask for a table for two", de: "Die Person bittet um einen Tisch für zwei Personen." },
      {
        id: "bestellen",
        hu: "Rendelj egy főételt és egy italt",
        en: "Order a main course and a drink",
        de: "Die Person bestellt ein Hauptgericht und ein Getränk.",
      },
      {
        id: "zahlen",
        hu: "Kérd a számlát, és fizess kártyával",
        en: "Ask for the bill and pay by card",
        de: "Die Person bittet um die Rechnung und zahlt mit Karte.",
      },
    ],
    phrases: [
      { de: "Einen Tisch für zwei Personen, bitte.", hu: "Egy asztalt két főre, kérem.", en: "A table for two, please." },
      { de: "Was können Sie empfehlen?", hu: "Mit tud ajánlani?", en: "What do you recommend?" },
      { de: "Ich hätte gern das Schnitzel.", hu: "A rántott húst kérném.", en: "I'd like the schnitzel." },
      { de: "Ohne Zwiebeln, bitte.", hu: "Hagyma nélkül, kérem.", en: "Without onions, please." },
      { de: "Ein Glas Wasser, bitte.", hu: "Egy pohár vizet kérek.", en: "A glass of water, please." },
      { de: "Die Rechnung, bitte.", hu: "A számlát, kérem.", en: "The bill, please." },
      { de: "Kann ich mit Karte zahlen?", hu: "Fizethetek kártyával?", en: "Can I pay by card?" },
    ],
  },
  {
    id: "bank",
    emoji: "💶",
    title: { hu: "Bankszámlanyitás", en: "Opening a bank account" },
    description: { hu: "Folyószámlát nyitsz egy bankfiókban.", en: "You open a current account at a bank branch." },
    role: "Bankberater/in in einer Filiale",
    scenario:
      "Die Person möchte ein Girokonto eröffnen. Es gibt zwei Kontomodelle: Basiskonto (kostenlos) und Komfortkonto (4,90 € im Monat). Du brauchst Ausweis, Meldebescheinigung und Steuer-ID. Die Bankkarte kommt nach etwa einer Woche per Post, die PIN separat.",
    opening: { de: "Guten Morgen! Was kann ich für Sie tun?", hu: "Jó reggelt! Miben segíthetek?", en: "Good morning! What can I do for you?" },
    tasks: [
      {
        id: "konto",
        hu: "Mondd el, hogy számlát szeretnél nyitni",
        en: "Say that you want to open an account",
        de: "Die Person sagt, dass sie ein Konto eröffnen möchte.",
      },
      {
        id: "kosten",
        hu: "Kérdezd meg, mennyibe kerül a számla havonta",
        en: "Ask how much the account costs per month",
        de: "Die Person fragt, was das Konto im Monat kostet.",
      },
      {
        id: "karte",
        hu: "Kérdezd meg, mikor kapod meg a bankkártyát",
        en: "Ask when you will get your bank card",
        de: "Die Person fragt, wann die Bankkarte kommt.",
      },
    ],
    phrases: [
      { de: "Ich möchte ein Girokonto eröffnen.", hu: "Szeretnék folyószámlát nyitni.", en: "I'd like to open a current account." },
      { de: "Was kostet das Konto im Monat?", hu: "Mennyibe kerül a számla havonta?", en: "How much does the account cost per month?" },
      { de: "Gibt es auch ein kostenloses Konto?", hu: "Van ingyenes számla is?", en: "Is there a free account too?" },
      { de: "Hier ist meine Meldebescheinigung.", hu: "Itt a lakcímbejelentő igazolásom.", en: "Here is my registration certificate." },
      { de: "Wann bekomme ich meine Karte?", hu: "Mikor kapom meg a kártyámat?", en: "When will I get my card?" },
      { de: "Kann ich auch Online-Banking nutzen?", hu: "Használhatok netbankot is?", en: "Can I use online banking too?" },
    ],
  },
  {
    id: "apotheke",
    emoji: "💊",
    title: { hu: "Gyógyszertárban", en: "At the pharmacy" },
    description: {
      hu: "Gyógyszert kérsz a megfázásodra, és megkérdezed, hogyan kell szedni.",
      en: "You ask for something for your cold and how to take it.",
    },
    role: "Apotheker/in",
    scenario:
      "Die Person hat Erkältungssymptome und braucht ein Medikament ohne Rezept. Frag nach Symptomen, Allergien und anderen Medikamenten, empfiehl etwas und erkläre die Dosierung.",
    opening: { de: "Guten Tag! Wie kann ich Ihnen helfen?", hu: "Jó napot! Miben segíthetek?", en: "Good afternoon! How can I help you?" },
    tasks: [
      { id: "symptome", hu: "Írd le a tüneteidet", en: "Describe your symptoms", de: "Die Person beschreibt ihre Symptome." },
      {
        id: "allergien",
        hu: "Mondd meg, allergiás vagy-e valamire",
        en: "Say whether you have any allergies",
        de: "Die Person sagt, ob sie Allergien hat.",
      },
      {
        id: "dosierung",
        hu: "Kérdezd meg, hogyan kell szedni a gyógyszert",
        en: "Ask how to take the medicine",
        de: "Die Person fragt, wie sie das Medikament nehmen soll.",
      },
    ],
    phrases: [
      { de: "Ich habe Schnupfen und Husten.", hu: "Náthás vagyok és köhögök.", en: "I have a cold and a cough." },
      { de: "Haben Sie etwas gegen Halsschmerzen?", hu: "Van valami torokfájás ellen?", en: "Do you have something for a sore throat?" },
      { de: "Brauche ich dafür ein Rezept?", hu: "Kell ehhez recept?", en: "Do I need a prescription for that?" },
      { de: "Ich bin gegen nichts allergisch.", hu: "Semmire sem vagyok allergiás.", en: "I'm not allergic to anything." },
      { de: "Wie oft am Tag soll ich das nehmen?", hu: "Naponta hányszor szedjem?", en: "How many times a day should I take it?" },
      { de: "Was kostet das?", hu: "Mennyibe kerül?", en: "How much is it?" },
    ],
  },
  {
    id: "bahnhof",
    emoji: "🚆",
    title: { hu: "Jegyvásárlás a pályaudvaron", en: "Buying a train ticket" },
    description: {
      hu: "Vonatjegyet veszel Berlinből Münchenbe, és az átszállásról kérdezel.",
      en: "You buy a train ticket from Berlin to Munich and ask about changing trains.",
    },
    role: "Mitarbeiter/in im Reisezentrum am Bahnhof",
    scenario:
      "Die Person möchte eine Fahrkarte von Berlin nach München kaufen. Es gibt einen direkten ICE um 9:04 Uhr (4 Stunden, 89 €) und eine günstigere Verbindung mit Umstieg in Leipzig um 10:15 Uhr (5,5 Stunden, 59 €). Der ICE fährt von Gleis 7 ab. Frag nach Datum und ob Hin- und Rückfahrt.",
    opening: {
      de: "Guten Tag, der Nächste, bitte! Wohin möchten Sie fahren?",
      hu: "Jó napot, a következőt kérem! Hová szeretne utazni?",
      en: "Hello, next please! Where would you like to go?",
    },
    tasks: [
      {
        id: "ziel",
        hu: "Mondd meg, hová és mikor utaznál",
        en: "Say where and when you want to travel",
        de: "Die Person sagt, wohin und wann sie fahren möchte.",
      },
      {
        id: "guenstiger",
        hu: "Kérdezz rá egy olcsóbb lehetőségre",
        en: "Ask about a cheaper option",
        de: "Die Person fragt nach einer günstigeren Verbindung.",
      },
      {
        id: "gleis",
        hu: "Kérdezd meg, melyik vágányról indul a vonat",
        en: "Ask which platform the train leaves from",
        de: "Die Person fragt, von welchem Gleis der Zug abfährt.",
      },
    ],
    phrases: [
      { de: "Eine Fahrkarte nach München, bitte.", hu: "Egy jegyet kérek Münchenbe.", en: "A ticket to Munich, please." },
      { de: "Nur die Hinfahrt, bitte.", hu: "Csak oda, kérem.", en: "One way, please." },
      { de: "Hin und zurück, bitte.", hu: "Oda-vissza, kérem.", en: "Return, please." },
      { de: "Gibt es eine günstigere Verbindung?", hu: "Van olcsóbb járat?", en: "Is there a cheaper connection?" },
      { de: "Muss ich umsteigen?", hu: "Át kell szállnom?", en: "Do I have to change trains?" },
      { de: "Von welchem Gleis fährt der Zug ab?", hu: "Melyik vágányról indul a vonat?", en: "Which platform does the train leave from?" },
      { de: "Wann kommt der Zug in München an?", hu: "Mikor ér a vonat Münchenbe?", en: "When does the train arrive in Munich?" },
    ],
  },
  {
    id: "interview",
    emoji: "💼",
    title: { hu: "Állásinterjú", en: "Job interview" },
    description: {
      hu: "Bemutatkozol egy ügyfélszolgálati állás interjúján, és a tapasztalataidról beszélsz.",
      en: "You introduce yourself at an interview for a customer service job and talk about your experience.",
    },
    role: "Personalleiter/in in einem mittelgroßen Unternehmen",
    scenario:
      "Vorstellungsgespräch für eine Stelle im Kundenservice. Frag nach Berufserfahrung, Stärken und Deutschkenntnissen. Die Stelle ist Vollzeit (40 Stunden pro Woche, Gleitzeit), Einstieg ab dem nächsten Monat möglich.",
    opening: {
      de: "Guten Tag und herzlich willkommen! Erzählen Sie doch bitte kurz etwas über sich.",
      hu: "Jó napot, és üdvözlöm! Kérem, meséljen röviden magáról.",
      en: "Hello and welcome! Please tell me a little about yourself.",
    },
    tasks: [
      { id: "vorstellen", hu: "Mutatkozz be röviden", en: "Briefly introduce yourself", de: "Die Person stellt sich kurz vor." },
      {
        id: "erfahrung",
        hu: "Beszélj a munkatapasztalatodról",
        en: "Talk about your work experience",
        de: "Die Person erzählt von ihrer Berufserfahrung.",
      },
      { id: "arbeitszeit", hu: "Kérdezz rá a munkaidőre", en: "Ask about the working hours", de: "Die Person fragt nach den Arbeitszeiten." },
    ],
    phrases: [
      {
        de: "Ich komme aus Ungarn und lebe seit einem Jahr in Deutschland.",
        hu: "Magyarországról jöttem, és egy éve élek Németországban.",
        en: "I'm from Hungary and have been living in Germany for a year.",
      },
      { de: "Ich habe drei Jahre als Verkäufer gearbeitet.", hu: "Három évig eladóként dolgoztam.", en: "I worked as a sales assistant for three years." },
      {
        de: "Meine Stärke ist, dass ich gut im Team arbeite.",
        hu: "Az erősségem, hogy jól dolgozom csapatban.",
        en: "My strength is that I work well in a team.",
      },
      { de: "Ich lerne gerade Deutsch auf B1-Niveau.", hu: "Jelenleg B1-es szinten tanulok németül.", en: "I'm currently learning German at B1 level." },
      { de: "Wie sind die Arbeitszeiten?", hu: "Milyen a munkaidő?", en: "What are the working hours?" },
      { de: "Wann könnte ich anfangen?", hu: "Mikor kezdhetnék?", en: "When could I start?" },
    ],
  },
  {
    id: "vermieter",
    emoji: "📞",
    title: { hu: "Telefon a főbérlőnek", en: "Calling your landlord" },
    description: {
      hu: "Felhívod a főbérlőt, mert elromlott a fűtés, és időpontot egyeztetsz a szerelőnek.",
      en: "You call your landlord because the heating is broken and arrange a time for a repair person.",
    },
    role: "Vermieter/in, am Telefon",
    scenario:
      "Die Person ruft an, weil die Heizung in ihrer Wohnung nicht funktioniert. Frag nach dem Problem und seit wann es besteht, und vereinbare einen Termin für den Handwerker (z. B. Donnerstag zwischen 9 und 12 Uhr).",
    opening: { de: "Hallo, hier Schmidt. Wer ist da, bitte?", hu: "Halló, Schmidt. Ki beszél?", en: "Hello, Schmidt speaking. Who's calling, please?" },
    tasks: [
      {
        id: "anruf",
        hu: "Mutatkozz be, és mondd el, miért hívod",
        en: "Introduce yourself and say why you're calling",
        de: "Die Person stellt sich vor und sagt, warum sie anruft.",
      },
      { id: "problem", hu: "Írd le pontosan a problémát", en: "Describe the problem precisely", de: "Die Person beschreibt das Problem genau." },
      {
        id: "termin",
        hu: "Egyeztess időpontot a szerelőnek",
        en: "Arrange a time for the repair person",
        de: "Die Person vereinbart einen Termin für den Handwerker.",
      },
    ],
    phrases: [
      { de: "Hier ist … aus der Wohnung im zweiten Stock.", hu: "… vagyok a második emeleti lakásból.", en: "This is … from the flat on the second floor." },
      { de: "Die Heizung funktioniert nicht.", hu: "Nem működik a fűtés.", en: "The heating isn't working." },
      {
        de: "Seit gestern ist es in der Wohnung sehr kalt.",
        hu: "Tegnap óta nagyon hideg van a lakásban.",
        en: "It's been very cold in the flat since yesterday.",
      },
      { de: "Können Sie einen Handwerker schicken?", hu: "Tudna küldeni egy szerelőt?", en: "Could you send a repair person?" },
      { de: "Am Vormittag bin ich zu Hause.", hu: "Délelőtt otthon vagyok.", en: "I'm at home in the morning." },
      { de: "Passt Ihnen Donnerstag?", hu: "Megfelel Önnek a csütörtök?", en: "Does Thursday suit you?" },
    ],
  },
  {
    id: "supermarkt",
    emoji: "🛒",
    title: { hu: "Szupermarketben", en: "At the supermarket" },
    description: {
      hu: "Megkérdezed, hol találsz néhány terméket, aztán fizetsz a pénztárnál.",
      en: "You ask where to find a few products, then pay at the checkout.",
    },
    role: "Mitarbeiter/in im Supermarkt (zuerst im Laden, später an der Kasse)",
    scenario:
      "Die Person sucht Produkte (Mehl in Gang 4, laktosefreie Milch im Kühlregal hinten links) und fragt nach dem Pfandautomaten (am Eingang rechts). Danach bezahlt sie an der Kasse (23,47 €).",
    opening: {
      de: "Hallo! Kann ich Ihnen helfen? Sie suchen bestimmt etwas.",
      hu: "Üdvözlöm! Segíthetek? Biztosan keres valamit.",
      en: "Hello! Can I help you? You must be looking for something.",
    },
    tasks: [
      {
        id: "produkt",
        hu: "Kérdezd meg, hol találsz egy terméket",
        en: "Ask where to find a product",
        de: "Die Person fragt, wo sie ein Produkt findet.",
      },
      {
        id: "pfand",
        hu: "Kérdezd meg, hol lehet visszaváltani az üvegeket",
        en: "Ask where to return deposit bottles",
        de: "Die Person fragt, wo sie Pfandflaschen zurückgeben kann.",
      },
      { id: "kasse", hu: "Fizess a pénztárnál", en: "Pay at the checkout", de: "Die Person bezahlt an der Kasse." },
    ],
    phrases: [
      { de: "Entschuldigung, wo finde ich Mehl?", hu: "Elnézést, hol találom a lisztet?", en: "Excuse me, where can I find flour?" },
      { de: "Haben Sie laktosefreie Milch?", hu: "Van laktózmentes tejük?", en: "Do you have lactose-free milk?" },
      {
        de: "Wo kann ich die Pfandflaschen abgeben?",
        hu: "Hol tudom leadni a betétdíjas palackokat?",
        en: "Where can I return the deposit bottles?",
      },
      { de: "Ich brauche keine Tüte, danke.", hu: "Nem kérek szatyrot, köszönöm.", en: "I don't need a bag, thanks." },
      { de: "Kann ich mit Karte zahlen?", hu: "Fizethetek kártyával?", en: "Can I pay by card?" },
      { de: "Den Kassenbon, bitte.", hu: "A blokkot kérném.", en: "The receipt, please." },
    ],
  },
];

export function getSituation(id: string) {
  return SITUATIONS.find((s) => s.id === id);
}

export function isUiLanguage(value: unknown): value is UiLanguage {
  return (UI_LANGUAGES as readonly unknown[]).includes(value);
}

/** What the client sees, in one language: no prompt-only fields. */
export function toPublicSituation({ id, emoji, title, description, tasks, phrases }: Situation, lang: UiLanguage) {
  return {
    id,
    emoji,
    title: title[lang],
    description: description[lang],
    tasks: tasks.map((t) => ({ id: t.id, text: t[lang] })),
    phrases: phrases.map((p) => ({ de: p.de, translation: p[lang] })),
  };
}
