import { theme } from "../parse.js";

// A1 vocabulary, part 1. type | German | forms | Hungarian | English | example

export const A1_PART1 = [
  theme("a1-greetings", "A1", 1, { hu: "Köszönés és udvariasság", en: "Greetings and politeness" }, `
x | Hallo | | Szia! (köszönéskor) | Hello! | Hallo, ich bin Tom.
x | Guten Morgen | | Jó reggelt! | Good morning! | Guten Morgen, Frau Weber!
x | Guten Tag | | Jó napot! | Good day! / Hello! (formal) | Guten Tag, ich heiße Anna.
x | Guten Abend | | Jó estét! | Good evening! | Guten Abend, Herr Müller!
x | Gute Nacht | | Jó éjszakát! | Good night! | Gute Nacht und schlaf gut!
x | Tschüss | | Szia! (búcsúzáskor) | Bye! | Tschüss, bis morgen!
x | Auf Wiedersehen | | Viszontlátásra! | Goodbye! | Auf Wiedersehen und vielen Dank!
x | Bis bald | | Hamarosan találkozunk! | See you soon! | Bis bald, Maria!
x | Bis morgen | | Holnap találkozunk! | See you tomorrow! | Ich gehe jetzt nach Hause. Bis morgen!
x | Wie geht's | | Hogy vagy? | How are you? | Hallo Peter, wie geht's?
x | Wie geht es Ihnen | | Hogy van? (magázva) | How are you? (formal) | Guten Tag, Frau Klein, wie geht es Ihnen?
x | Danke | | Köszönöm! | Thank you! | Danke für die Hilfe!
x | Vielen Dank | | Nagyon köszönöm! | Thank you very much! | Vielen Dank für das Geschenk!
x | Bitte | | Kérem. / Szívesen. | Please. / You're welcome. | Einen Kaffee, bitte.
x | Gern geschehen | | Nincs mit. | You're welcome. | Danke! – Gern geschehen!
x | Entschuldigung | | Elnézést! | Excuse me! / Sorry! | Entschuldigung, wo ist der Bahnhof?
x | Es tut mir leid | | Sajnálom. | I'm sorry. | Es tut mir leid, ich bin zu spät.
x | ja | | igen | yes | Ja, das stimmt.
x | nein | | nem | no | Nein, danke.
x | Herzlich willkommen | | Isten hozott! / Üdvözöljük! | Welcome! | Herzlich willkommen in Berlin!
x | Alles Gute | | Minden jót! | All the best! | Alles Gute zum Geburtstag!
x | Viel Glück | | Sok szerencsét! | Good luck! | Viel Glück bei der Prüfung!
`),

  theme("a1-person", "A1", 2, { hu: "Személyes adatok", en: "Personal details" }, `
n | der Name | Namen | név | name | Mein Name ist Anna Kovács.
n | der Vorname | Vornamen | keresztnév | first name | Mein Vorname ist Peter.
n | der Familienname | Familiennamen | vezetéknév | surname | Wie ist Ihr Familienname?
v | heißen | er heißt, hat geheißen | hívják vhogy | to be called | Ich heiße Lukas.
n | das Alter | – | életkor | age | Bitte geben Sie Ihr Alter an.
n | der Geburtstag | Geburtstage | születésnap | birthday | Wann hast du Geburtstag?
n | das Geburtsdatum | Geburtsdaten | születési dátum | date of birth | Schreiben Sie bitte Ihr Geburtsdatum hier.
n | der Geburtsort | Geburtsorte | születési hely | place of birth | Mein Geburtsort ist Debrecen.
n | die Adresse | Adressen | cím | address | Wie ist Ihre Adresse?
n | die Straße | Straßen | utca | street | Ich wohne in der Goethestraße.
n | die Hausnummer | Hausnummern | házszám | house number | Die Hausnummer ist zwölf.
n | die Postleitzahl | Postleitzahlen | irányítószám | postcode | Wie ist die Postleitzahl?
n | der Wohnort | Wohnorte | lakóhely | place of residence | Mein Wohnort ist Hamburg.
v | wohnen | | lakik | to live (somewhere) | Ich wohne in Wien.
v | kommen | er kommt, ist gekommen | jön; származik | to come | Ich komme aus Ungarn.
n | das Land | Länder | ország | country | Aus welchem Land kommst du?
n | die Sprache | Sprachen | nyelv | language | Ich spreche zwei Sprachen.
v | sprechen | er spricht, hat gesprochen | beszél | to speak | Sprechen Sie Englisch?
n | die Telefonnummer | Telefonnummern | telefonszám | phone number | Wie ist deine Telefonnummer?
n | die E-Mail-Adresse | E-Mail-Adressen | e-mail-cím | email address | Meine E-Mail-Adresse ist anna@web.de.
a | ledig | | egyedülálló | single | Ich bin ledig.
a | verheiratet | | házas | married | Sind Sie verheiratet?
a | geschieden | | elvált | divorced | Mein Bruder ist geschieden.
n | der Herr | Herren | úr | Mr; gentleman | Guten Tag, Herr Schmidt!
n | die Frau | Frauen | nő; asszony; feleség | woman; Mrs; wife | Das ist Frau Schmidt.
n | der Mann | Männer | férfi; férj | man; husband | Der Mann dort ist mein Vater.
n | das Kind | Kinder | gyerek | child | Wir haben zwei Kinder.
n | die Person | Personen | személy | person | Ein Tisch für vier Personen, bitte.
`),

  theme("a1-family", "A1", 3, { hu: "Család és emberek", en: "Family and people" }, `
n | die Familie | Familien | család | family | Meine Familie wohnt in Pécs.
n | die Eltern | – | szülők | parents | Meine Eltern sind Rentner.
n | der Vater | Väter | apa | father | Mein Vater ist Lehrer.
n | die Mutter | Mütter | anya | mother | Meine Mutter heißt Eva.
n | der Sohn | Söhne | fia vkinek | son | Ihr Sohn ist fünf Jahre alt.
n | die Tochter | Töchter | lánya vkinek | daughter | Unsere Tochter geht in die Schule.
n | der Bruder | Brüder | fiútestvér | brother | Ich habe einen Bruder.
n | die Schwester | Schwestern | lánytestvér | sister | Meine Schwester wohnt in Graz.
n | die Geschwister | – | testvérek | siblings | Hast du Geschwister?
n | der Großvater | Großväter | nagyapa | grandfather | Mein Großvater ist achtzig.
n | die Großmutter | Großmütter | nagyanya | grandmother | Meine Großmutter kocht sehr gut.
n | die Großeltern | – | nagyszülők | grandparents | Am Sonntag besuchen wir die Großeltern.
n | der Opa | Opas | nagypapa | grandpa | Opa liest die Zeitung.
n | die Oma | Omas | nagyi | grandma | Oma backt einen Kuchen.
n | der Onkel | Onkel | nagybácsi | uncle | Mein Onkel lebt in Amerika.
n | die Tante | Tanten | nagynéni | aunt | Meine Tante hat drei Kinder.
n | der Cousin / die Cousine | Cousins / Cousinen | unokatestvér | cousin | Mein Cousin studiert in Wien.
n | das Baby | Babys | kisbaba | baby | Das Baby schläft.
n | der Partner / die Partnerin | Partner / Partnerinnen | partner | partner | Das ist mein Partner Tom.
n | der Freund / die Freundin | Freunde / Freundinnen | barát; barátnő | friend; boyfriend, girlfriend | Ich treffe heute meinen Freund.
n | der Junge | Jungen | fiú | boy | Der Junge spielt Fußball.
n | das Mädchen | Mädchen | lány | girl | Das Mädchen heißt Lisa.
n | die Leute | – | emberek | people | Viele Leute warten auf den Bus.
n | der Mensch | Menschen | ember | human being, person | Er ist ein netter Mensch.
v | leben | | él | to live | Meine Eltern leben in Szeged.
v | heiraten | | összeházasodik | to get married | Sie heiraten im Mai.
`),

  theme("a1-numbers", "A1", 4, { hu: "Számok és mennyiségek", en: "Numbers and quantities" }, `
x | null | | nulla | zero | Die Nummer beginnt mit null.
x | eins | | egy | one | Es ist eins.
x | zwei | | kettő | two | Ich habe zwei Brüder.
x | drei | | három | three | Wir bleiben drei Tage.
x | vier | | négy | four | Die Familie hat vier Personen.
x | fünf | | öt | five | Das kostet fünf Euro.
x | sechs | | hat | six | Der Kurs beginnt um sechs Uhr.
x | sieben | | hét | seven | Die Woche hat sieben Tage.
x | acht | | nyolc | eight | Ich arbeite acht Stunden.
x | neun | | kilenc | nine | Das Kind ist neun Jahre alt.
x | zehn | | tíz | ten | Zehn Minuten, bitte!
x | elf | | tizenegy | eleven | Eine Fußballmannschaft hat elf Spieler.
x | zwölf | | tizenkettő | twelve | Das Jahr hat zwölf Monate.
x | zwanzig | | húsz | twenty | Ich bin zwanzig Jahre alt.
x | dreißig | | harminc | thirty | Der Juni hat dreißig Tage.
x | hundert | | száz | hundred | Das sind hundert Euro.
x | tausend | | ezer | thousand | Das Auto kostet zehntausend Euro.
n | die Zahl | Zahlen | szám | number | Schreib die Zahl bitte auf.
n | die Nummer | Nummern | szám (sorszám) | number (e.g. house, phone) | Welche Nummer hat das Zimmer?
x | erste | | első | first | Ich wohne im ersten Stock.
a | viel | mehr, am meisten | sok | much, a lot | Ich habe heute viel Arbeit.
a | wenig | | kevés | little, not much | Er isst sehr wenig.
x | alle | | mind; mindenki | all; everyone | Alle sind schon da.
x | halb | | fél | half | Es ist halb drei.
n | das Stück | Stücke | darab | piece | Ich nehme ein Stück Kuchen.
n | das Kilo | Kilos | kiló | kilo | Ein Kilo Tomaten, bitte.
n | der Liter | Liter | liter | litre | Ich trinke zwei Liter Wasser am Tag.
n | das Gramm | – | gramm | gram | 200 Gramm Käse, bitte.
`),

  theme("a1-days-months", "A1", 5, { hu: "Napok és hónapok", en: "Days and months" }, `
n | der Tag | Tage | nap | day | Heute ist ein schöner Tag.
n | die Woche | Wochen | hét | week | Ich arbeite fünf Tage in der Woche.
n | das Wochenende | Wochenenden | hétvége | weekend | Was machst du am Wochenende?
n | der Monat | Monate | hónap | month | Der Kurs dauert einen Monat.
n | das Jahr | Jahre | év | year | Ich bin 25 Jahre alt.
n | das Datum | Daten | dátum | date | Welches Datum ist heute?
n | der Montag | Montage | hétfő | Monday | Am Montag arbeite ich.
n | der Dienstag | Dienstage | kedd | Tuesday | Am Dienstag habe ich einen Kurs.
n | der Mittwoch | Mittwoche | szerda | Wednesday | Am Mittwoch gehe ich schwimmen.
n | der Donnerstag | Donnerstage | csütörtök | Thursday | Der Termin ist am Donnerstag.
n | der Freitag | Freitage | péntek | Friday | Am Freitag gehen wir ins Kino.
n | der Samstag | Samstage | szombat | Saturday | Am Samstag kaufe ich ein.
n | der Sonntag | Sonntage | vasárnap | Sunday | Am Sonntag schlafe ich lange.
n | der Januar | – | január | January | Im Januar ist es kalt.
n | der Februar | – | február | February | Der Februar hat 28 Tage.
n | der März | – | március | March | Im März beginnt der Frühling.
n | der April | – | április | April | Mein Geburtstag ist im April.
n | der Mai | – | május | May | Im Mai ist es oft schön.
n | der Juni | – | június | June | Im Juni sind Ferien.
n | der Juli | – | július | July | Im Juli fahren wir ans Meer.
n | der August | – | augusztus | August | Im August ist es heiß.
n | der September | – | szeptember | September | Im September beginnt die Schule.
n | der Oktober | – | október | October | Im Oktober regnet es oft.
n | der November | – | november | November | Im November ist es grau.
n | der Dezember | – | december | December | Im Dezember ist Weihnachten.
`),

  theme("a1-time", "A1", 6, { hu: "Idő és napszakok", en: "Time and times of day" }, `
n | die Zeit | Zeiten | idő | time | Ich habe keine Zeit.
n | die Uhr | Uhren | óra (eszköz; időpont) | clock, watch; o'clock | Es ist acht Uhr.
n | die Stunde | Stunden | óra (időtartam) | hour | Der Film dauert zwei Stunden.
n | die Minute | Minuten | perc | minute | Ich komme in fünf Minuten.
n | die Sekunde | Sekunden | másodperc | second | Warte eine Sekunde!
n | der Morgen | Morgen | reggel | morning | Am Morgen trinke ich Kaffee.
n | der Vormittag | Vormittage | délelőtt | late morning | Am Vormittag bin ich im Büro.
n | der Mittag | Mittage | dél | noon, midday | Zu Mittag esse ich in der Kantine.
n | der Nachmittag | Nachmittage | délután | afternoon | Am Nachmittag gehe ich spazieren.
n | der Abend | Abende | este | evening | Am Abend sehe ich fern.
n | die Nacht | Nächte | éjszaka | night | In der Nacht schlafe ich.
x | heute | | ma | today | Heute ist Montag.
x | morgen | | holnap | tomorrow | Morgen habe ich frei.
x | gestern | | tegnap | yesterday | Gestern war ich krank.
x | jetzt | | most | now | Ich habe jetzt Zeit.
x | bald | | nemsokára | soon | Wir sehen uns bald.
a | früh | früher, am frühesten | korán; korai | early | Ich stehe früh auf.
a | spät | später, am spätesten | későn; késő | late | Es ist schon spät.
x | dann | | aztán | then | Zuerst frühstücke ich, dann gehe ich zur Arbeit.
x | danach | | utána | afterwards | Danach gehen wir essen.
x | gleich | | mindjárt | right away, in a moment | Ich komme gleich!
a | pünktlich | | pontos(an) | on time, punctual | Der Zug ist pünktlich.
x | immer | | mindig | always | Ich trinke immer Tee.
x | oft | | gyakran | often | Wir gehen oft ins Kino.
x | manchmal | | néha | sometimes | Manchmal koche ich.
x | nie | | soha | never | Ich rauche nie.
x | schon | | már | already | Bist du schon fertig?
x | noch | | még | still; yet | Ich habe noch Zeit.
`),

  theme("a1-food", "A1", 7, { hu: "Élelmiszerek", en: "Food" }, `
n | das Essen | – | étel; evés | food; meal | Das Essen ist fertig.
n | das Brot | Brote | kenyér | bread | Ich kaufe ein Brot.
n | das Brötchen | Brötchen | zsemle | bread roll | Zum Frühstück esse ich zwei Brötchen.
n | die Butter | – | vaj | butter | Ich esse Brot mit Butter.
n | der Käse | – | sajt | cheese | Der Käse kommt aus der Schweiz.
n | die Wurst | Würste | kolbász; felvágott | sausage; cold cuts | Möchtest du Wurst oder Käse?
n | das Ei | Eier | tojás | egg | Ich esse jeden Morgen ein Ei.
n | die Milch | – | tej | milk | Trinkst du Kaffee mit Milch?
n | der Joghurt | Joghurts | joghurt | yoghurt | Der Joghurt ist im Kühlschrank.
n | das Fleisch | – | hús | meat | Ich esse kein Fleisch.
n | das Hähnchen | Hähnchen | csirke | chicken | Heute gibt es Hähnchen mit Reis.
n | der Fisch | Fische | hal | fish | Am Freitag essen wir Fisch.
n | der Reis | – | rizs | rice | Der Reis ist schon fertig.
n | die Nudel | Nudeln | tészta | noodle, pasta | Die Kinder essen gern Nudeln.
n | die Kartoffel | Kartoffeln | burgonya | potato | Ich koche Kartoffeln.
n | das Gemüse | – | zöldség | vegetables | Gemüse ist gesund.
n | die Tomate | Tomaten | paradicsom | tomato | Ein Kilo Tomaten, bitte.
n | die Gurke | Gurken | uborka | cucumber | Ich mache einen Salat mit Gurken.
n | die Zwiebel | Zwiebeln | hagyma | onion | Die Suppe braucht eine Zwiebel.
n | der Salat | Salate | saláta | salad; lettuce | Ich nehme einen kleinen Salat.
n | das Obst | – | gyümölcs | fruit | Ich esse jeden Tag Obst.
n | der Apfel | Äpfel | alma | apple | Der Apfel ist rot.
n | die Banane | Bananen | banán | banana | Die Bananen sind noch grün.
n | die Orange | Orangen | narancs | orange | Ich presse eine Orange aus.
n | der Kuchen | Kuchen | sütemény, torta | cake | Möchtest du ein Stück Kuchen?
n | die Schokolade | Schokoladen | csokoládé | chocolate | Kinder lieben Schokolade.
n | der Zucker | – | cukor | sugar | Kaffee ohne Zucker, bitte.
n | das Salz | – | só | salt | Die Suppe braucht noch Salz.
`),

  theme("a1-meals", "A1", 8, { hu: "Étkezés és italok", en: "Meals and drinks" }, `
n | das Frühstück | Frühstücke | reggeli | breakfast | Das Frühstück ist um acht Uhr.
n | das Mittagessen | Mittagessen | ebéd | lunch | Das Mittagessen ist fertig.
n | das Abendessen | Abendessen | vacsora | dinner | Zum Abendessen gibt es Suppe.
n | die Suppe | Suppen | leves | soup | Die Suppe ist heiß.
n | das Getränk | Getränke | ital | drink | Was für Getränke haben Sie?
n | das Wasser | – | víz | water | Ein Glas Wasser, bitte.
n | der Saft | Säfte | gyümölcslé | juice | Ich trinke gern Apfelsaft.
n | der Kaffee | Kaffees | kávé | coffee | Ich trinke morgens Kaffee.
n | der Tee | Tees | tea | tea | Möchtest du einen Tee?
n | das Bier | Biere | sör | beer | Ein Bier, bitte.
n | der Wein | Weine | bor | wine | Der Wein kommt aus Tokaj.
n | das Glas | Gläser | pohár | glass | Ein Glas Saft, bitte.
n | die Tasse | Tassen | csésze | cup | Ich trinke eine Tasse Tee.
n | die Flasche | Flaschen | üveg, palack | bottle | Eine Flasche Wasser kostet einen Euro.
n | der Hunger | – | éhség | hunger | Ich habe Hunger.
n | der Durst | – | szomjúság | thirst | Hast du Durst?
v | essen | er isst, hat gegessen | eszik | to eat | Was isst du gern?
v | trinken | er trinkt, hat getrunken | iszik | to drink | Ich trinke keinen Alkohol.
v | kochen | | főz | to cook | Mein Mann kocht sehr gut.
v | frühstücken | | reggelizik | to have breakfast | Wir frühstücken um sieben.
v | schmecken | | ízlik | to taste (good) | Schmeckt dir die Suppe?
a | lecker | | finom | tasty, delicious | Der Kuchen ist sehr lecker.
a | süß | | édes | sweet | Der Kaffee ist zu süß.
a | warm | wärmer, am wärmsten | meleg | warm | Das Essen ist noch warm.
a | kalt | kälter, am kältesten | hideg | cold | Das Bier ist schön kalt.
a | satt | | jóllakott | full (after eating) | Danke, ich bin satt.
`),

  theme("a1-shopping", "A1", 9, { hu: "Vásárlás és pénz", en: "Shopping and money" }, `
v | einkaufen | er kauft ein, hat eingekauft | bevásárol | to go shopping | Am Samstag kaufe ich ein.
v | kaufen | | vesz, vásárol | to buy | Ich kaufe ein Brot.
v | verkaufen | | elad | to sell | Er verkauft sein Auto.
v | kosten | | kerül vmibe | to cost | Was kostet das?
v | bezahlen | | fizet | to pay | Ich bezahle mit Karte.
v | brauchen | | szüksége van vmire | to need | Ich brauche eine Tüte.
n | das Geld | – | pénz | money | Ich habe kein Geld dabei.
n | der Euro | Euro | euró | euro | Das kostet fünf Euro.
n | der Cent | Cent | cent | cent | Das macht zwei Euro fünfzig Cent.
n | der Preis | Preise | ár | price | Der Preis ist gut.
n | das Geschäft | Geschäfte | üzlet | shop; business | Das Geschäft ist bis 20 Uhr geöffnet.
n | der Supermarkt | Supermärkte | szupermarket | supermarket | Der Supermarkt ist gleich um die Ecke.
n | der Markt | Märkte | piac | market | Auf dem Markt kaufe ich Obst.
n | die Bäckerei | Bäckereien | pékség | bakery | Die Bäckerei öffnet um sechs.
n | die Kasse | Kassen | pénztár | checkout, till | Bitte zahlen Sie an der Kasse.
n | die Tüte | Tüten | szatyor, zacskó | bag | Brauchen Sie eine Tüte?
n | die Karte | Karten | kártya; jegy; térkép | card; ticket; map | Kann ich mit Karte zahlen?
n | das Angebot | Angebote | ajánlat, akció | offer, special offer | Die Äpfel sind heute im Angebot.
a | billig | | olcsó | cheap | Die Tomaten sind heute billig.
a | teuer | teurer, am teuersten | drága | expensive | Das Handy ist zu teuer.
a | günstig | | kedvező árú | inexpensive, good value | Das Hotel ist günstig.
a | geöffnet | | nyitva | open | Die Apotheke ist heute geöffnet.
a | geschlossen | | zárva | closed | Am Sonntag ist der Laden geschlossen.
x | Was kostet das | | Mennyibe kerül? | How much is it? | Entschuldigung, was kostet das?
x | Ich hätte gern | | Kérnék… | I'd like… | Ich hätte gern ein Kilo Äpfel.
n | der Laden | Läden | bolt | shop, store | Der Laden ist klein, aber gut.
`),

  theme("a1-home", "A1", 10, { hu: "Lakás", en: "Home" }, `
n | die Wohnung | Wohnungen | lakás | flat, apartment | Meine Wohnung hat zwei Zimmer.
n | das Haus | Häuser | ház | house | Wir wohnen in einem Haus.
n | das Zimmer | Zimmer | szoba | room | Das Zimmer ist hell.
n | die Küche | Küchen | konyha | kitchen | Die Küche ist neu.
n | das Bad | Bäder | fürdőszoba | bathroom | Das Bad ist klein.
n | das Schlafzimmer | Schlafzimmer | hálószoba | bedroom | Das Schlafzimmer ist ruhig.
n | das Wohnzimmer | Wohnzimmer | nappali | living room | Wir sitzen im Wohnzimmer.
n | die Toilette | Toiletten | WC | toilet | Wo ist die Toilette, bitte?
n | der Balkon | Balkone | erkély | balcony | Die Wohnung hat einen Balkon.
n | der Garten | Gärten | kert | garden | Die Kinder spielen im Garten.
n | der Stock | – | emelet | floor, storey | Wir wohnen im dritten Stock.
n | die Treppe | Treppen | lépcső | stairs | Die Treppe ist links.
n | der Aufzug | Aufzüge | lift | lift, elevator | Das Haus hat keinen Aufzug.
n | die Tür | Türen | ajtó | door | Mach bitte die Tür zu!
n | das Fenster | Fenster | ablak | window | Kannst du das Fenster öffnen?
n | die Miete | Mieten | lakbér | rent | Die Miete ist 800 Euro.
v | mieten | | bérel | to rent | Wir mieten eine Wohnung.
v | umziehen | er zieht um, ist umgezogen | költözik | to move (house) | Wir ziehen nächste Woche um.
n | der Nachbar / die Nachbarin | Nachbarn / Nachbarinnen | szomszéd | neighbour | Mein Nachbar ist sehr nett.
a | hell | | világos | bright, light | Das Wohnzimmer ist schön hell.
a | dunkel | dunkler, am dunkelsten | sötét | dark | Der Flur ist dunkel.
a | ruhig | | csendes, nyugodt | quiet, calm | Die Straße ist ruhig.
a | laut | | hangos, zajos | loud, noisy | Die Wohnung ist leider laut.
a | groß | größer, am größten | nagy | big, large | Das Zimmer ist groß.
a | klein | | kicsi | small | Die Küche ist klein.
n | der Schlüssel | Schlüssel | kulcs | key | Ich habe meinen Schlüssel vergessen.
`),

  theme("a1-furniture", "A1", 11, { hu: "Bútorok és tárgyak otthon", en: "Furniture and things at home" }, `
n | der Tisch | Tische | asztal | table | Das Essen steht auf dem Tisch.
n | der Stuhl | Stühle | szék | chair | Wir brauchen noch zwei Stühle.
n | das Sofa | Sofas | kanapé | sofa | Das Sofa ist sehr bequem.
n | das Bett | Betten | ágy | bed | Ich gehe um elf ins Bett.
n | der Schrank | Schränke | szekrény | cupboard, wardrobe | Die Kleider sind im Schrank.
n | das Regal | Regale | polc | shelf | Die Bücher stehen im Regal.
n | die Lampe | Lampen | lámpa | lamp | Die Lampe ist kaputt.
n | der Kühlschrank | Kühlschränke | hűtőszekrény | fridge | Die Milch ist im Kühlschrank.
n | der Herd | Herde | tűzhely | cooker, stove | Der Topf steht auf dem Herd.
n | die Waschmaschine | Waschmaschinen | mosógép | washing machine | Die Waschmaschine läuft.
n | der Fernseher | Fernseher | televízió (készülék) | TV set | Der Fernseher ist neu.
n | der Computer | Computer | számítógép | computer | Ich arbeite am Computer.
n | das Bild | Bilder | kép | picture | Das Bild hängt an der Wand.
n | die Wand | Wände | fal | wall | Die Wand ist weiß.
n | der Boden | Böden | padló | floor | Die Tasche liegt auf dem Boden.
n | der Teppich | Teppiche | szőnyeg | carpet, rug | Der Teppich ist rot.
n | die Dusche | Duschen | zuhany | shower | Die Dusche ist kaputt.
n | das Handtuch | Handtücher | törölköző | towel | Das Handtuch ist nass.
n | der Teller | Teller | tányér | plate | Stell bitte die Teller auf den Tisch.
n | das Messer | Messer | kés | knife | Das Messer ist scharf.
n | die Gabel | Gabeln | villa | fork | Ich brauche eine Gabel.
n | der Löffel | Löffel | kanál | spoon | Die Suppe isst man mit dem Löffel.
n | der Topf | Töpfe | fazék | pot | Die Suppe ist im Topf.
a | kaputt | | elromlott | broken | Der Fernseher ist kaputt.
a | bequem | | kényelmes | comfortable | Der Stuhl ist bequem.
a | neu | | új | new | Wir haben ein neues Sofa.
`),

  theme("a1-city", "A1", 12, { hu: "A városban", en: "In town" }, `
n | die Stadt | Städte | város | town, city | Wien ist eine schöne Stadt.
n | das Dorf | Dörfer | falu | village | Meine Eltern wohnen in einem Dorf.
n | das Zentrum | Zentren | központ | centre | Das Hotel liegt im Zentrum.
n | der Platz | Plätze | tér; hely | square; place, seat | Auf dem Platz ist ein Markt.
n | die Kirche | Kirchen | templom | church | Die Kirche ist sehr alt.
n | das Museum | Museen | múzeum | museum | Das Museum ist montags geschlossen.
n | das Kino | Kinos | mozi | cinema | Gehen wir heute ins Kino?
n | das Theater | Theater | színház | theatre | Das Theater ist in der Altstadt.
n | der Park | Parks | park | park | Wir gehen in den Park.
n | das Hotel | Hotels | szálloda | hotel | Das Hotel hat 50 Zimmer.
n | das Restaurant | Restaurants | étterem | restaurant | Das Restaurant ist sehr gut.
n | das Café | Cafés | kávézó | café | Wir treffen uns im Café.
n | die Bank | Banken | bank | bank | Die Bank ist neben der Post.
n | die Post | – | posta | post office; mail | Ich gehe zur Post.
n | die Apotheke | Apotheken | gyógyszertár | pharmacy | Die Apotheke ist an der Ecke.
n | das Krankenhaus | Krankenhäuser | kórház | hospital | Das Krankenhaus ist nicht weit.
n | die Schule | Schulen | iskola | school | Die Kinder sind in der Schule.
n | der Bahnhof | Bahnhöfe | pályaudvar | railway station | Wie komme ich zum Bahnhof?
n | die Haltestelle | Haltestellen | megálló | stop (bus, tram) | Die Haltestelle ist vor dem Haus.
n | die Ecke | Ecken | sarok | corner | Die Bäckerei ist an der Ecke.
n | die Ampel | Ampeln | közlekedési lámpa | traffic light | Gehen Sie bis zur Ampel.
x | links | | balra; bal oldalon | left | Gehen Sie hier links.
x | rechts | | jobbra; jobb oldalon | right | Die Post ist rechts.
x | geradeaus | | egyenesen | straight on | Gehen Sie immer geradeaus.
x | hier | | itt | here | Ich wohne hier.
x | dort | | ott | there | Dort ist der Bahnhof.
a | weit | | messze; távol | far | Ist es weit bis zum Zentrum?
x | in der Nähe | | a közelben | nearby | Gibt es hier in der Nähe eine Bank?
`),
];
