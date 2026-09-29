// Static for the MVP.
// - title / description / tasks[].hu / phrases are shown in the UI.
// - role / scenario / tasks[].de go to the roleplay prompt (German).
// - opening is the partner's first line; mockScript drives LLM_MODE=mock.
// Every German line that can appear in the chat carries its Hungarian
// translation, so mock mode can translate without calling Claude.

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
  mockScript: Line[];
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
    mockScript: [
      { de: "Gerne. Haben Sie Ihren Ausweis oder Reisepass dabei?", hu: "Szívesen. Önnél van a személyi igazolványa vagy az útlevele?" },
      { de: "Danke. Und die Wohnungsgeberbestätigung von Ihrem Vermieter brauche ich auch.", hu: "Köszönöm. És szükségem van a főbérlőjétől kapott szállásadói igazolásra is." },
      { de: "Wie ist Ihre neue Adresse, bitte?", hu: "Mi az új címe, kérem?" },
      { de: "Alles klar, ich trage das jetzt ein. Einen Moment, bitte.", hu: "Rendben, most beírom. Egy pillanat, kérem." },
      { de: "So, fertig. Hier ist Ihre Meldebescheinigung, die bekommen Sie sofort.", hu: "Így, kész. Itt a bejelentő igazolása, azt azonnal megkapja." },
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
    mockScript: [
      { de: "Oh, das tut mir leid. Seit wann haben Sie diese Beschwerden?", hu: "Ó, sajnálom. Mióta vannak ezek a panaszai?" },
      { de: "Haben Sie auch Fieber oder Husten?", hu: "Van láza vagy köhögése is?" },
      { de: "Ich schaue mal in Ihren Hals. Sagen Sie bitte „Aaah“.", hu: "Megnézem a torkát. Mondja, kérem, hogy „Ááá”." },
      { de: "Das ist eine leichte Erkältung. Ich verschreibe Ihnen ein Medikament.", hu: "Ez egy enyhe megfázás. Felírok Önnek egy gyógyszert." },
      { de: "Nehmen Sie die Tabletten dreimal am Tag, fünf Tage lang.", hu: "Szedje a tablettákat naponta háromszor, öt napig." },
      { de: "Gute Besserung! Brauchen Sie noch eine Krankschreibung?", hu: "Jobbulást! Kell még betegállományi igazolás?" },
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
    mockScript: [
      { de: "Hier ist das Wohnzimmer. Es ist schön hell, oder?", hu: "Ez itt a nappali. Szép világos, ugye?" },
      { de: "Die Kaltmiete ist 780 Euro, dazu kommen 190 Euro Nebenkosten.", hu: "Az alapbér 780 euró, ehhez jön még 190 euró rezsi." },
      { de: "Die Wohnung ist ab dem Ersten des nächsten Monats frei.", hu: "A lakás a jövő hónap elsejétől szabad." },
      { de: "Darf ich fragen, was Sie beruflich machen?", hu: "Megkérdezhetem, mivel foglalkozik?" },
      { de: "Sehr gut. Die Kaution beträgt drei Kaltmieten.", hu: "Nagyon jó. A kaució három havi alapbér." },
      { de: "Haben Sie noch Fragen zur Wohnung?", hu: "Van még kérdése a lakással kapcsolatban?" },
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
    mockScript: [
      { de: "Kein Problem, wir haben noch einen Tisch am Fenster frei. Bitte hier entlang.", hu: "Nem probléma, van még egy szabad asztalunk az ablaknál. Erre tessék." },
      { de: "Hier ist die Speisekarte. Was möchten Sie trinken?", hu: "Itt az étlap. Mit szeretne inni?" },
      { de: "Sehr gerne. Und was darf ich Ihnen zum Essen bringen?", hu: "Nagyon szívesen. És mit hozhatok enni?" },
      { de: "Eine gute Wahl! Heute kann ich auch die Käsespätzle empfehlen.", hu: "Jó választás! Ma a sajtos spätzlét is ajánlhatom." },
      { de: "Hat es Ihnen geschmeckt? Möchten Sie noch einen Nachtisch?", hu: "Ízlett? Kér még desszertet?" },
      { de: "Das macht dann 34,50 Euro. Zahlen Sie bar oder mit Karte?", hu: "Az összesen 34,50 euró lesz. Készpénzzel vagy kártyával fizet?" },
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
    mockScript: [
      { de: "Gerne! Wir haben zwei Kontomodelle: Das Basiskonto ist kostenlos, das Komfortkonto kostet 4,90 Euro im Monat.", hu: "Szívesen! Kétféle számlánk van: az alapszámla ingyenes, a komfortszámla havi 4,90 euróba kerül." },
      { de: "Für die Kontoeröffnung brauche ich Ihren Ausweis und Ihre Meldebescheinigung.", hu: "A számlanyitáshoz szükségem van a személyi igazolványára és a lakcímbejelentő igazolására." },
      { de: "Haben Sie auch Ihre Steuer-Identifikationsnummer?", hu: "Megvan az adóazonosító száma is?" },
      { de: "Perfekt. Möchten Sie auch Online-Banking nutzen?", hu: "Tökéletes. Szeretné a netbankot is használni?" },
      { de: "Ihre Bankkarte kommt in etwa einer Woche per Post, die PIN kommt separat.", hu: "A bankkártyája körülbelül egy héten belül postán érkezik, a PIN-kód külön jön." },
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
    mockScript: [
      { de: "Seit wann haben Sie die Beschwerden?", hu: "Mióta vannak a panaszai?" },
      { de: "Haben Sie Allergien oder nehmen Sie andere Medikamente?", hu: "Van valamilyen allergiája, vagy szed más gyógyszert?" },
      { de: "Dann empfehle ich Ihnen diese Lutschtabletten und ein Nasenspray.", hu: "Akkor ezt a szopogató tablettát és egy orrspray-t ajánlom." },
      { de: "Nehmen Sie alle drei Stunden eine Tablette, aber höchstens sechs am Tag.", hu: "Háromóránként vegyen be egy tablettát, de naponta legfeljebb hatot." },
      { de: "Dafür brauchen Sie kein Rezept. Das macht zusammen 12,80 Euro.", hu: "Ehhez nem kell recept. Összesen 12,80 euró lesz." },
      { de: "Gute Besserung! Brauchen Sie eine Tüte?", hu: "Jobbulást! Kér egy zacskót?" },
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
    mockScript: [
      { de: "Für wann brauchen Sie die Fahrkarte? Für heute oder für einen anderen Tag?", hu: "Mikorra kell a jegy? Mára vagy egy másik napra?" },
      { de: "Es gibt einen direkten ICE um 9:04 Uhr. Die Fahrt dauert vier Stunden und kostet 89 Euro.", hu: "Van egy közvetlen ICE 9:04-kor. Az út négy óra, és 89 euróba kerül." },
      { de: "Günstiger geht es mit Umstieg in Leipzig: Abfahrt um 10:15 Uhr, für 59 Euro.", hu: "Olcsóbban átszállással megy, Lipcsében: indulás 10:15-kor, 59 euróért." },
      { de: "Möchten Sie nur die Hinfahrt oder auch die Rückfahrt?", hu: "Csak oda kéri, vagy vissza is?" },
      { de: "Der Zug fährt von Gleis 7 ab. Hier ist Ihre Fahrkarte.", hu: "A vonat a 7-es vágányról indul. Itt a jegye." },
      { de: "Gute Reise!", hu: "Jó utat!" },
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
    mockScript: [
      { de: "Vielen Dank. Welche Berufserfahrung haben Sie bisher?", hu: "Köszönöm szépen. Milyen munkatapasztalata van eddig?" },
      { de: "Interessant. Was sind Ihre Stärken?", hu: "Érdekes. Mik az erősségei?" },
      { de: "Bei uns haben Sie viel Kontakt mit Kunden, auch am Telefon. Ist das in Ordnung für Sie?", hu: "Nálunk sokat fog ügyfelekkel beszélni, telefonon is. Ez rendben van Önnek?" },
      { de: "Haben Sie Fragen an uns?", hu: "Van kérdése felénk?" },
      { de: "Es ist eine Vollzeitstelle mit 40 Stunden pro Woche und Gleitzeit.", hu: "Ez egy teljes munkaidős állás, heti 40 órában, rugalmas munkaidővel." },
      { de: "Vielen Dank für das Gespräch. Wir melden uns bis Ende nächster Woche bei Ihnen.", hu: "Köszönjük a beszélgetést. A jövő hét végéig jelentkezünk." },
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
    mockScript: [
      { de: "Ah, guten Tag! Was kann ich für Sie tun?", hu: "Á, jó napot! Miben segíthetek?" },
      { de: "Oh je. Seit wann funktioniert die Heizung nicht mehr?", hu: "Jaj. Mióta nem működik a fűtés?" },
      { de: "Ist nur ein Heizkörper kalt oder sind alle kalt?", hu: "Csak egy radiátor hideg, vagy mind?" },
      { de: "Ich rufe sofort den Handwerker an. Wann sind Sie zu Hause?", hu: "Azonnal felhívom a szerelőt. Mikor van otthon?" },
      { de: "Gut, der Handwerker kommt am Donnerstag zwischen 9 und 12 Uhr.", hu: "Jó, a szerelő csütörtökön 9 és 12 óra között jön." },
      { de: "Entschuldigen Sie die Unannehmlichkeiten. Auf Wiederhören!", hu: "Elnézést a kellemetlenségért. Viszonthallásra!" },
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
    mockScript: [
      { de: "Das finden Sie in Gang 4, neben dem Zucker.", hu: "Azt a 4-es sorban találja, a cukor mellett." },
      { de: "Laktosefreie Milch steht im Kühlregal, ganz hinten links.", hu: "A laktózmentes tej a hűtőpolcon van, leghátul balra." },
      { de: "Der Pfandautomat ist gleich am Eingang, rechts.", hu: "A palackvisszaváltó automata rögtön a bejáratnál van, jobbra." },
      { de: "Ich kann Sie jetzt auch an der Kasse bedienen. Brauchen Sie eine Tüte?", hu: "Most a pénztárnál is ki tudom szolgálni. Kér szatyrot?" },
      { de: "Das macht 23,47 Euro. Haben Sie eine Kundenkarte?", hu: "Az 23,47 euró lesz. Van törzsvásárlói kártyája?" },
      { de: "Hier ist Ihr Kassenbon. Einen schönen Tag noch!", hu: "Itt a blokkja. További szép napot!" },
    ],
  },
];

// What the mock partner says once its script has run out.
export const MOCK_FALLBACK: Line = {
  de: "Gibt es sonst noch etwas, worüber Sie sprechen möchten?",
  hu: "Van még valami, amiről beszélni szeretne?",
};

export function getSituation(id: string) {
  return SITUATIONS.find((s) => s.id === id);
}

export function toPublicSituation({ id, emoji, title, description, tasks, phrases }: Situation) {
  return { id, emoji, title, description, tasks: tasks.map(({ id, hu }) => ({ id, hu })), phrases };
}
