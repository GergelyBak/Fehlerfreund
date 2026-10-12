import { theme } from "../parse.js";

// A1 vocabulary, part 2. type | German | forms | Hungarian | English | example

export const A1_PART2 = [
  theme("a1-transport", "A1", 13, { hu: "Közlekedés és utazás", en: "Transport and travel" }, `
n | das Auto | Autos | autó | car | Ich fahre mit dem Auto zur Arbeit.
n | der Bus | Busse | busz | bus | Der Bus kommt um acht.
n | die Straßenbahn | Straßenbahnen | villamos | tram | Ich nehme die Straßenbahn.
n | die U-Bahn | U-Bahnen | metró | underground, subway | Die U-Bahn ist schneller.
n | der Zug | Züge | vonat | train | Der Zug hat Verspätung.
n | das Flugzeug | Flugzeuge | repülőgép | plane | Das Flugzeug landet um zehn.
n | der Flughafen | Flughäfen | repülőtér | airport | Wie komme ich zum Flughafen?
n | das Fahrrad | Fahrräder | kerékpár | bicycle | Ich fahre jeden Tag Fahrrad.
n | das Taxi | Taxis | taxi | taxi | Wir nehmen ein Taxi.
n | die Fahrkarte | Fahrkarten | menetjegy | ticket | Ich brauche eine Fahrkarte nach Graz.
n | das Ticket | Tickets | jegy | ticket | Hast du schon ein Ticket?
n | das Gleis | Gleise | vágány | platform, track | Der Zug fährt von Gleis drei.
n | die Abfahrt | Abfahrten | indulás | departure | Die Abfahrt ist um 9:15 Uhr.
n | die Ankunft | Ankünfte | érkezés | arrival | Die Ankunft ist um zwölf.
n | die Reise | Reisen | utazás | trip, journey | Gute Reise!
n | der Urlaub | Urlaube | szabadság, nyaralás | holiday, vacation | Im Sommer machen wir Urlaub.
n | der Koffer | Koffer | bőrönd | suitcase | Mein Koffer ist sehr schwer.
n | der Pass | Pässe | útlevél | passport | Vergiss deinen Pass nicht!
v | fahren | er fährt, ist gefahren | megy (járművel), utazik; vezet | to go (by vehicle), to drive | Wir fahren nach Berlin.
v | fliegen | er fliegt, ist geflogen | repül | to fly | Ich fliege nach Wien.
v | gehen | er geht, ist gegangen | megy (gyalog) | to go, to walk | Ich gehe zu Fuß.
v | ankommen | er kommt an, ist angekommen | megérkezik | to arrive | Der Zug kommt um acht an.
v | abfahren | er fährt ab, ist abgefahren | elindul (jármű) | to depart | Der Bus fährt gleich ab.
v | umsteigen | er steigt um, ist umgestiegen | átszáll | to change (trains etc.) | In Linz müssen Sie umsteigen.
v | warten | | vár | to wait | Ich warte auf den Bus.
x | zu Fuß | | gyalog | on foot | Ich gehe zu Fuß zur Schule.
`),

  theme("a1-health", "A1", 14, { hu: "Test és egészség", en: "Body and health" }, `
n | der Körper | Körper | test | body | Sport ist gut für den Körper.
n | der Kopf | Köpfe | fej | head | Mein Kopf tut weh.
n | das Auge | Augen | szem | eye | Sie hat blaue Augen.
n | das Ohr | Ohren | fül | ear | Mein Ohr tut weh.
n | die Nase | Nasen | orr | nose | Meine Nase läuft.
n | der Mund | Münder | száj | mouth | Mach bitte den Mund auf.
n | der Zahn | Zähne | fog | tooth | Ich putze mir die Zähne.
n | der Hals | Hälse | nyak; torok | neck; throat | Ich habe Halsschmerzen.
n | der Arm | Arme | kar | arm | Mein Arm ist gebrochen.
n | die Hand | Hände | kéz | hand | Wasch dir die Hände!
n | der Bauch | Bäuche | has | belly, stomach | Mein Bauch tut weh.
n | der Rücken | Rücken | hát | back | Ich habe Rückenschmerzen.
n | das Bein | Beine | láb (egész) | leg | Er hat lange Beine.
n | der Fuß | Füße | lábfej | foot | Mein Fuß tut weh.
n | der Arzt / die Ärztin | Ärzte / Ärztinnen | orvos | doctor | Ich muss zum Arzt.
n | die Praxis | Praxen | rendelő | doctor's surgery | Die Praxis ist im ersten Stock.
n | der Termin | Termine | időpont | appointment | Ich habe um zehn einen Termin.
n | das Medikament | Medikamente | gyógyszer | medicine | Nehmen Sie das Medikament dreimal am Tag.
n | die Tablette | Tabletten | tabletta | tablet, pill | Ich nehme eine Tablette.
n | das Fieber | – | láz | fever | Das Kind hat Fieber.
n | die Schmerzen | – | fájdalom | pain | Haben Sie Schmerzen?
a | krank | kränker, am kränksten | beteg | ill, sick | Ich bin krank.
a | gesund | | egészséges | healthy | Obst ist gesund.
a | müde | | fáradt | tired | Ich bin sehr müde.
v | wehtun | es tut weh, hat wehgetan | fáj | to hurt | Mein Kopf tut weh.
x | Gute Besserung | | Jobbulást! | Get well soon! | Gute Besserung!
`),

  theme("a1-clothes", "A1", 15, { hu: "Ruhák és színek", en: "Clothes and colours" }, `
n | die Kleidung | – | ruházat | clothing | Ich brauche neue Kleidung.
n | die Hose | Hosen | nadrág | trousers | Die Hose ist zu lang.
n | das Hemd | Hemden | ing | shirt | Er trägt ein weißes Hemd.
n | das T-Shirt | T-Shirts | póló | T-shirt | Das T-Shirt kostet zehn Euro.
n | der Pullover | Pullover | pulóver | jumper, sweater | Der Pullover ist warm.
n | die Jacke | Jacken | dzseki, kabát | jacket | Nimm eine Jacke mit!
n | der Mantel | Mäntel | kabát | coat | Im Winter trage ich einen Mantel.
n | das Kleid | Kleider | ruha (női) | dress | Das Kleid ist sehr schön.
n | der Rock | Röcke | szoknya | skirt | Sie trägt einen roten Rock.
n | der Schuh | Schuhe | cipő | shoe | Die Schuhe sind zu klein.
n | die Socke | Socken | zokni | sock | Ich brauche neue Socken.
n | die Mütze | Mützen | sapka | woolly hat, cap | Im Winter trage ich eine Mütze.
n | die Größe | Größen | méret | size | Welche Größe haben Sie?
n | die Farbe | Farben | szín | colour | Welche Farbe magst du?
v | tragen | er trägt, hat getragen | visel; cipel | to wear; to carry | Sie trägt eine Brille.
v | anziehen | er zieht an, hat angezogen | felvesz (ruhát) | to put on | Zieh dich warm an!
v | anprobieren | er probiert an, hat anprobiert | felpróbál | to try on | Kann ich die Hose anprobieren?
a | weiß | | fehér | white | Der Schnee ist weiß.
a | schwarz | | fekete | black | Ich trinke den Kaffee schwarz.
a | rot | | piros | red | Die Ampel ist rot.
a | blau | | kék | blue | Der Himmel ist blau.
a | grün | | zöld | green | Das Gras ist grün.
a | gelb | | sárga | yellow | Die Banane ist gelb.
a | grau | | szürke | grey | Mein Mantel ist grau.
a | braun | | barna | brown | Er hat braune Augen.
a | schön | | szép | beautiful, nice | Das Kleid ist schön.
`),

  theme("a1-work", "A1", 16, { hu: "Munka és foglalkozások", en: "Work and jobs" }, `
n | die Arbeit | Arbeiten | munka | work, job | Ich gehe zur Arbeit.
v | arbeiten | | dolgozik | to work | Ich arbeite in einem Büro.
n | der Beruf | Berufe | foglalkozás, szakma | job, profession | Was sind Sie von Beruf?
n | die Firma | Firmen | cég | company | Die Firma hat 200 Mitarbeiter.
n | das Büro | Büros | iroda | office | Das Büro ist im zweiten Stock.
n | der Chef / die Chefin | Chefs / Chefinnen | főnök | boss | Meine Chefin ist sehr nett.
n | der Kollege / die Kollegin | Kollegen / Kolleginnen | kolléga | colleague | Mein Kollege hilft mir.
n | der Lehrer / die Lehrerin | Lehrer / Lehrerinnen | tanár | teacher | Die Lehrerin erklärt die Grammatik.
n | der Verkäufer / die Verkäuferin | Verkäufer / Verkäuferinnen | eladó | sales assistant | Die Verkäuferin ist freundlich.
n | der Kellner / die Kellnerin | Kellner / Kellnerinnen | pincér | waiter, waitress | Der Kellner bringt die Rechnung.
n | der Koch / die Köchin | Köche / Köchinnen | szakács | cook, chef | Der Koch arbeitet in einem Hotel.
n | der Fahrer / die Fahrerin | Fahrer / Fahrerinnen | sofőr | driver | Er ist Busfahrer.
n | der Student / die Studentin | Studenten / Studentinnen | egyetemi hallgató | (university) student | Meine Schwester ist Studentin.
n | der Arbeiter / die Arbeiterin | Arbeiter / Arbeiterinnen | munkás | worker | Die Arbeiter machen eine Pause.
n | der Ingenieur / die Ingenieurin | Ingenieure / Ingenieurinnen | mérnök | engineer | Mein Vater ist Ingenieur.
n | der Krankenpfleger / die Krankenpflegerin | Krankenpfleger / Krankenpflegerinnen | ápoló | nurse | Sie arbeitet als Krankenpflegerin.
n | die Pause | Pausen | szünet | break | Um zwölf machen wir Pause.
n | der Feierabend | Feierabende | munkaidő vége | end of the working day | Um fünf habe ich Feierabend.
n | der Job | Jobs | állás, munka | job | Ich suche einen Job.
v | suchen | | keres | to look for | Ich suche eine neue Arbeit.
v | verdienen | | keres (pénzt) | to earn | Er verdient gut.
a | arbeitslos | | munkanélküli | unemployed | Seit Mai bin ich arbeitslos.
a | frei | | szabad | free | Morgen habe ich frei.
a | fertig | | kész | ready, finished | Ich bin mit der Arbeit fertig.
n | die Stelle | Stellen | állás | position, post | Ich suche eine neue Stelle.
n | das Praktikum | Praktika | szakmai gyakorlat | internship | Ich mache ein Praktikum bei einer Bank.
`),

  theme("a1-learning", "A1", 17, { hu: "Iskola és tanulás", en: "School and learning" }, `
v | lernen | | tanul | to learn, to study | Ich lerne Deutsch.
v | studieren | | egyetemen tanul | to study (at university) | Sie studiert Medizin.
n | der Kurs | Kurse | tanfolyam | course | Der Deutschkurs beginnt um neun.
n | die Klasse | Klassen | osztály | class, form | Die Klasse hat 20 Schüler.
n | der Schüler / die Schülerin | Schüler / Schülerinnen | diák (iskolai) | pupil | Die Schüler schreiben einen Test.
n | die Universität | Universitäten | egyetem | university | Er studiert an der Universität Wien.
n | die Prüfung | Prüfungen | vizsga | exam | Morgen habe ich eine Prüfung.
n | der Test | Tests | teszt, dolgozat | test | Der Test war leicht.
n | die Frage | Fragen | kérdés | question | Ich habe eine Frage.
n | die Antwort | Antworten | válasz | answer | Die Antwort ist richtig.
n | das Buch | Bücher | könyv | book | Das Buch ist sehr interessant.
n | das Heft | Hefte | füzet | exercise book | Schreibt das bitte ins Heft.
n | der Stift | Stifte | toll, ceruza | pen, pencil | Hast du einen Stift für mich?
n | das Papier | Papiere | papír | paper | Ich brauche ein Blatt Papier.
n | das Wort | Wörter | szó | word | Was bedeutet dieses Wort?
n | der Satz | Sätze | mondat | sentence | Lies bitte den Satz vor.
n | die Seite | Seiten | oldal | page; side | Öffnen Sie das Buch auf Seite zehn.
n | die Hausaufgabe | Hausaufgaben | házi feladat | homework | Hast du die Hausaufgaben gemacht?
v | schreiben | er schreibt, hat geschrieben | ír | to write | Ich schreibe eine E-Mail.
v | lesen | er liest, hat gelesen | olvas | to read | Ich lese gern Bücher.
v | fragen | | kérdez | to ask | Darf ich etwas fragen?
v | antworten | | válaszol | to answer | Bitte antworten Sie auf Deutsch.
v | verstehen | er versteht, hat verstanden | ért | to understand | Ich verstehe das nicht.
v | wiederholen | | megismétel | to repeat | Können Sie das bitte wiederholen?
a | richtig | | helyes | right, correct | Das ist richtig!
a | falsch | | hibás, rossz | wrong | Die Antwort ist falsch.
`),

  theme("a1-leisure", "A1", 18, { hu: "Szabadidő és hobbik", en: "Free time and hobbies" }, `
n | die Freizeit | – | szabadidő | free time | Was machst du in deiner Freizeit?
n | das Hobby | Hobbys | hobbi | hobby | Mein Hobby ist Fotografieren.
n | der Sport | – | sport | sport | Ich mache gern Sport.
n | der Fußball | Fußbälle | futball | football | Am Samstag spielen wir Fußball.
v | spielen | | játszik | to play | Die Kinder spielen im Park.
v | schwimmen | er schwimmt, ist geschwommen | úszik | to swim | Im Sommer schwimme ich im See.
v | tanzen | | táncol | to dance | Wir tanzen gern.
v | singen | er singt, hat gesungen | énekel | to sing | Sie singt in einem Chor.
v | wandern | | túrázik | to hike | Am Wochenende wandern wir in den Bergen.
v | reisen | | utazik | to travel | Ich reise gern.
v | fotografieren | | fényképez | to take photos | Er fotografiert gern Tiere.
v | fernsehen | er sieht fern, hat ferngesehen | tévét néz | to watch TV | Am Abend sehe ich fern.
v | treffen | er trifft, hat getroffen | találkozik vkivel | to meet | Ich treffe meine Freunde im Café.
v | besuchen | | meglátogat | to visit | Am Sonntag besuche ich meine Oma.
v | einladen | er lädt ein, hat eingeladen | meghív | to invite | Ich lade dich zum Essen ein.
n | die Musik | – | zene | music | Ich höre gern Musik.
n | der Film | Filme | film | film | Der Film war super.
n | das Spiel | Spiele | játék; mérkőzés | game; match | Das Spiel beginnt um acht.
n | die Party | Partys | buli | party | Kommst du zu meiner Party?
n | das Fest | Feste | ünnep; ünnepség | celebration, party | Das Fest ist im Garten.
n | das Konzert | Konzerte | koncert | concert | Das Konzert war toll.
n | der Ausflug | Ausflüge | kirándulás | trip, outing | Am Sonntag machen wir einen Ausflug.
a | gern | lieber, am liebsten | szívesen | gladly (likes doing) | Ich koche gern.
a | toll | | nagyszerű | great | Das Wetter ist toll.
a | interessant | | érdekes | interesting | Das Buch ist interessant.
a | langweilig | | unalmas | boring | Der Film ist langweilig.
`),

  theme("a1-weather", "A1", 19, { hu: "Időjárás és természet", en: "Weather and nature" }, `
n | das Wetter | – | időjárás | weather | Wie ist das Wetter heute?
n | die Sonne | Sonnen | nap (égitest) | sun | Die Sonne scheint.
n | der Regen | – | eső | rain | Es gibt viel Regen.
v | regnen | es regnet, hat geregnet | esik az eső | to rain | Es regnet schon den ganzen Tag.
n | der Schnee | – | hó | snow | Im Winter gibt es Schnee.
v | schneien | es schneit, hat geschneit | havazik | to snow | Heute schneit es.
n | der Wind | Winde | szél | wind | Der Wind ist sehr stark.
n | die Wolke | Wolken | felhő | cloud | Am Himmel sind viele Wolken.
n | der Himmel | – | ég | sky | Der Himmel ist blau.
n | der Grad | Grad | fok | degree | Es sind 25 Grad.
a | heiß | | forró | hot | Im Sommer ist es sehr heiß.
n | der Frühling | – | tavasz | spring | Im Frühling blühen die Blumen.
n | der Sommer | – | nyár | summer | Im Sommer fahren wir ans Meer.
n | der Herbst | – | ősz | autumn | Im Herbst ist es oft windig.
n | der Winter | – | tél | winter | Im Winter fahre ich Ski.
n | das Meer | Meere | tenger | sea | Wir machen Urlaub am Meer.
n | der See | Seen | tó | lake | Der Balaton ist ein großer See.
n | der Berg | Berge | hegy | mountain | Wir wandern auf den Berg.
n | der Fluss | Flüsse | folyó | river | Die Donau ist ein langer Fluss.
n | der Wald | Wälder | erdő | forest | Wir gehen im Wald spazieren.
n | die Blume | Blumen | virág | flower | Ich kaufe Blumen für meine Mutter.
n | der Baum | Bäume | fa | tree | Vor dem Haus steht ein Baum.
n | das Tier | Tiere | állat | animal | Hast du ein Tier zu Hause?
n | der Hund | Hunde | kutya | dog | Der Hund heißt Max.
n | die Katze | Katzen | macska | cat | Die Katze schläft auf dem Sofa.
`),

  theme("a1-communication", "A1", 20, { hu: "Kommunikáció és média", en: "Communication and media" }, `
n | das Telefon | Telefone | telefon | telephone | Das Telefon klingelt.
n | das Handy | Handys | mobiltelefon | mobile phone | Mein Handy ist kaputt.
v | telefonieren | | telefonál | to make a phone call | Ich telefoniere mit meiner Mutter.
v | anrufen | er ruft an, hat angerufen | felhív | to call | Ruf mich morgen an!
n | die Nachricht | Nachrichten | üzenet; hír | message; news | Ich schreibe dir eine Nachricht.
n | die E-Mail | E-Mails | e-mail | email | Ich habe deine E-Mail bekommen.
n | der Brief | Briefe | levél | letter | Ich schreibe einen Brief.
n | die Postkarte | Postkarten | képeslap | postcard | Wir schicken dir eine Postkarte.
n | das Paket | Pakete | csomag | parcel | Das Paket ist angekommen.
v | schicken | | küld | to send | Schick mir bitte ein Foto.
v | bekommen | er bekommt, hat bekommen | kap | to get, to receive | Ich habe ein Geschenk bekommen.
n | das Internet | – | internet | internet | Ich suche das im Internet.
n | die Zeitung | Zeitungen | újság | newspaper | Mein Vater liest die Zeitung.
n | das Radio | Radios | rádió | radio | Ich höre Radio im Auto.
n | das Foto | Fotos | fénykép | photo | Zeig mal die Fotos!
v | hören | | hall; hallgat | to hear; to listen | Ich höre Musik.
v | sagen | | mond | to say | Was sagst du?
v | erzählen | | elmesél | to tell | Erzähl mal von deinem Urlaub!
v | zeigen | | megmutat | to show | Kannst du mir den Weg zeigen?
v | buchstabieren | | betűz | to spell | Können Sie das bitte buchstabieren?
n | die Information | Informationen | információ | information | Ich brauche mehr Informationen.
x | Moment bitte | | Egy pillanat! | Just a moment, please. | Moment bitte, ich verbinde Sie.
`),

  theme("a1-verbs-1", "A1", 21, { hu: "Fontos igék 1", en: "Key verbs 1" }, `
v | sein | er ist, ist gewesen | van, lenni | to be | Ich bin müde.
v | haben | er hat, hat gehabt | van vkinek, birtokol | to have | Ich habe einen Bruder.
v | werden | er wird, ist geworden | válik vmivé | to become | Er wird Arzt.
v | machen | | csinál | to do, to make | Was machst du heute?
v | geben | er gibt, hat gegeben | ad | to give | Gib mir bitte das Buch.
v | nehmen | er nimmt, hat genommen | vesz, fog | to take | Ich nehme den Bus.
v | sehen | er sieht, hat gesehen | lát | to see | Ich sehe dich morgen.
v | finden | er findet, hat gefunden | talál; gondol vmit | to find; to think | Ich finde meinen Schlüssel nicht.
v | wissen | er weiß, hat gewusst | tud (vmit) | to know (a fact) | Ich weiß es nicht.
v | kennen | er kennt, hat gekannt | ismer | to know (be familiar with) | Kennst du Peter?
v | können | er kann, hat gekonnt | tud, képes | can, to be able to | Ich kann gut schwimmen.
v | müssen | er muss, hat gemusst | kell | must, to have to | Ich muss jetzt gehen.
v | wollen | er will, hat gewollt | akar | to want | Ich will Deutsch lernen.
v | möchten | er möchte | szeretne | would like | Ich möchte einen Kaffee.
v | dürfen | er darf, hat gedurft | szabad, -hat | may, to be allowed to | Darf ich hier rauchen?
v | sollen | er soll, hat gesollt | kell (mások szerint) | should, to be supposed to | Der Arzt sagt, ich soll im Bett bleiben.
v | mögen | er mag, hat gemocht | kedvel | to like | Ich mag Schokolade.
v | gefallen | es gefällt, hat gefallen | tetszik | to please (like) | Die Stadt gefällt mir.
v | helfen | er hilft, hat geholfen | segít | to help | Kannst du mir helfen?
v | bringen | er bringt, hat gebracht | hoz | to bring | Ich bringe dir einen Kaffee.
v | holen | | elhoz, érte megy | to fetch | Ich hole die Kinder von der Schule.
v | stehen | er steht, hat gestanden | áll | to stand | Das Auto steht vor dem Haus.
v | liegen | er liegt, hat gelegen | fekszik | to lie (be lying) | Das Buch liegt auf dem Tisch.
v | sitzen | er sitzt, hat gesessen | ül | to sit | Wir sitzen im Garten.
v | schlafen | er schläft, hat geschlafen | alszik | to sleep | Das Baby schläft.
v | aufstehen | er steht auf, ist aufgestanden | felkel | to get up | Ich stehe um sechs auf.
v | bleiben | er bleibt, ist geblieben | marad | to stay | Ich bleibe heute zu Hause.
v | gehören | | tartozik vkihez | to belong to | Das Auto gehört meinem Vater.
`),

  theme("a1-verbs-2", "A1", 22, { hu: "Fontos igék 2", en: "Key verbs 2" }, `
v | beginnen | er beginnt, hat begonnen | kezdődik; elkezd | to begin | Der Kurs beginnt um neun.
v | anfangen | er fängt an, hat angefangen | elkezd(ődik) | to start | Wann fängt der Film an?
v | aufhören | er hört auf, hat aufgehört | abbahagy; véget ér | to stop | Hör auf!
v | öffnen | | kinyit | to open | Öffnen Sie bitte das Fenster.
v | schließen | er schließt, hat geschlossen | bezár | to close | Wir schließen um 18 Uhr.
v | aufmachen | er macht auf, hat aufgemacht | kinyit | to open | Mach bitte die Tür auf!
v | zumachen | er macht zu, hat zugemacht | becsuk | to close | Mach das Fenster zu, es ist kalt.
v | denken | er denkt, hat gedacht | gondol | to think | Ich denke oft an dich.
v | glauben | | hisz, gondol | to believe, to think | Ich glaube, das ist richtig.
v | lieben | | szeret (szerelemmel) | to love | Ich liebe dich.
v | lachen | | nevet | to laugh | Wir lachen viel.
v | waschen | er wäscht, hat gewaschen | mos | to wash | Ich wasche die Wäsche.
v | putzen | | takarít; pucol | to clean | Am Samstag putze ich die Wohnung.
v | spülen | | elmosogat | to wash up | Wer spült heute?
v | ausmachen | er macht aus, hat ausgemacht | kikapcsol; megbeszél | to switch off; to agree on | Mach bitte das Licht aus.
v | bestellen | | rendel | to order | Ich bestelle eine Pizza.
v | mitkommen | er kommt mit, ist mitgekommen | velünk jön | to come along | Kommst du mit ins Kino?
v | mitbringen | er bringt mit, hat mitgebracht | magával hoz | to bring along | Bring bitte Brot mit!
v | vergessen | er vergisst, hat vergessen | elfelejt | to forget | Ich habe den Termin vergessen.
v | verlieren | er verliert, hat verloren | elveszít | to lose | Ich habe meinen Schlüssel verloren.
v | laufen | er läuft, ist gelaufen | fut; gyalogol | to run; to walk | Ich laufe jeden Morgen.
v | rauchen | | dohányzik | to smoke | Hier darf man nicht rauchen.
v | dauern | | tart (időben) | to last, to take (time) | Wie lange dauert der Kurs?
v | passieren | er passiert, ist passiert | történik | to happen | Was ist passiert?
v | stimmen | | stimmel | to be right | Das stimmt nicht.
v | ausfüllen | er füllt aus, hat ausgefüllt | kitölt | to fill in | Bitte füllen Sie das Formular aus.
v | unterschreiben | er unterschreibt, hat unterschrieben | aláír | to sign | Unterschreiben Sie bitte hier.
v | kennenlernen | er lernt kennen, hat kennengelernt | megismerkedik | to get to know | Wir haben uns im Kurs kennengelernt.
`),

  theme("a1-adjectives", "A1", 23, { hu: "Gyakori melléknevek", en: "Common adjectives" }, `
a | gut | besser, am besten | jó | good | Das Essen ist gut.
a | schlecht | | rossz | bad | Das Wetter ist schlecht.
a | alt | älter, am ältesten | öreg; régi | old | Wie alt bist du?
a | jung | jünger, am jüngsten | fiatal | young | Meine Schwester ist noch jung.
a | lang | länger, am längsten | hosszú | long | Der Film ist sehr lang.
a | kurz | kürzer, am kürzesten | rövid | short | Die Pause ist kurz.
a | schnell | | gyors | fast | Der Zug ist schnell.
a | langsam | | lassú | slow | Bitte sprechen Sie langsam.
a | leicht | | könnyű | easy; light | Die Übung ist leicht.
a | schwer | | nehéz | difficult; heavy | Deutsch ist nicht so schwer.
a | einfach | | egyszerű | simple | Das ist ganz einfach.
a | wichtig | | fontos | important | Das ist sehr wichtig.
a | nett | | kedves | nice, kind | Die Nachbarn sind nett.
a | freundlich | | barátságos | friendly | Der Verkäufer ist freundlich.
a | glücklich | | boldog | happy | Ich bin sehr glücklich.
a | traurig | | szomorú | sad | Warum bist du traurig?
a | froh | | örül, vidám | glad | Ich bin froh, dass du da bist.
a | sauber | | tiszta | clean | Die Küche ist sauber.
a | schmutzig | | piszkos | dirty | Die Schuhe sind schmutzig.
a | voll | | tele | full | Der Bus ist voll.
a | leer | | üres | empty | Die Flasche ist leer.
a | offen | | nyitott; nyitva | open | Die Tür ist offen.
a | möglich | | lehetséges | possible | Ist das möglich?
a | allein | | egyedül | alone | Ich wohne allein.
a | zusammen | | együtt | together | Wir essen zusammen.
a | genau | | pontos(an) | exact(ly) | Genau, das ist richtig!
a | fremd | | idegen | foreign; strange | Entschuldigung, ich bin fremd hier.
a | anders | | másképp; más | different(ly) | Das ist bei uns anders.
a | super | | szuper | great | Das ist super!
a | ganz | | egész; egészen | whole; quite | Ich habe den ganzen Tag gearbeitet.
a | sehr | | nagyon | very | Das ist sehr gut.
`),

  theme("a1-small-words", "A1", 24, { hu: "Kérdőszók és kis szavak", en: "Question words and small words" }, `
x | wer | | ki? | who? | Wer ist das?
x | was | | mi? | what? | Was ist das?
x | wo | | hol? | where? | Wo wohnst du?
x | woher | | honnan? | where from? | Woher kommst du?
x | wohin | | hová? | where to? | Wohin fährst du?
x | wann | | mikor? | when? | Wann beginnt der Kurs?
x | wie | | hogyan? | how? | Wie heißt du?
x | warum | | miért? | why? | Warum lernst du Deutsch?
x | wie viel | | mennyi? | how much? | Wie viel kostet das?
x | wie lange | | mennyi ideig? | how long? | Wie lange bleibst du?
x | welcher | | melyik? | which? | Welcher Bus fährt zum Bahnhof?
x | und | | és | and | Ich trinke Kaffee und Tee.
x | oder | | vagy | or | Möchtest du Tee oder Kaffee?
x | aber | | de | but | Das Hotel ist klein, aber schön.
x | weil | | mert | because | Ich bleibe zu Hause, weil ich krank bin.
x | dass | | hogy | that | Ich weiß, dass du recht hast.
x | wenn | | ha; amikor | if; when | Wenn es regnet, bleibe ich zu Hause.
x | auch | | is | also, too | Ich komme auch.
x | nur | | csak | only | Ich habe nur zehn Euro.
x | nicht | | nem (tagadás) | not | Ich verstehe das nicht.
x | kein | | nem, semmilyen | no, not a | Ich habe keine Zeit.
x | etwas | | valami | something | Möchtest du etwas trinken?
x | nichts | | semmi | nothing | Ich habe nichts gegessen.
x | alles | | minden | everything | Alles ist gut.
x | man | | az ember (általános alany) | one, you (in general) | Hier darf man nicht parken.
x | mit | | -val/-vel | with | Ich fahre mit dem Bus.
x | ohne | | nélkül | without | Kaffee ohne Milch, bitte.
x | für | | számára, -ért | for | Das Geschenk ist für dich.
x | bei | | -nál/-nél | at (someone's place) | Ich wohne bei meinen Eltern.
x | nach | | után; -ba/-be (városba, országba) | after; to (cities, countries) | Nach dem Essen fahre ich nach Hause.
x | aus | | -ból/-ből | from, out of | Ich komme aus Budapest.
x | zu | | -hoz/-hez | to | Ich gehe zum Arzt.
x | von | | -tól/-től | from; of | Das ist ein Geschenk von meiner Mutter.
x | vielleicht | | talán | maybe | Vielleicht komme ich morgen.
x | wieder | | újra | again | Ich bin wieder zu Hause.
x | zwischen | | között | between | Die Bank ist zwischen der Post und dem Café.
`),

  theme("a1-services", "A1", 25, { hu: "Hivatalok és szolgáltatások", en: "Offices and services" }, `
n | das Amt | Ämter | hivatal | (public) office | Ich muss heute aufs Amt.
n | das Formular | Formulare | űrlap | form | Bitte füllen Sie dieses Formular aus.
n | die Unterschrift | Unterschriften | aláírás | signature | Hier fehlt noch Ihre Unterschrift.
n | der Ausweis | Ausweise | személyi igazolvány | ID card | Haben Sie Ihren Ausweis dabei?
n | das Konto | Konten | bankszámla | bank account | Ich möchte ein Konto eröffnen.
n | der Schalter | Schalter | ablak, pult (ügyintézés) | counter | Bitte gehen Sie zu Schalter drei.
n | die Öffnungszeit | Öffnungszeiten | nyitvatartás | opening hours | Wie sind die Öffnungszeiten?
n | die Briefmarke | Briefmarken | bélyeg | stamp | Ich brauche eine Briefmarke.
n | die Polizei | – | rendőrség | police | Rufen Sie die Polizei!
n | der Notruf | Notrufe | segélyhívás | emergency call | Der Notruf ist 112.
n | die Hilfe | – | segítség | help | Danke für die Hilfe!
n | das Problem | Probleme | probléma | problem | Kein Problem!
n | die Erlaubnis | Erlaubnisse | engedély | permission | Sie brauchen eine Erlaubnis.
n | die Gebühr | Gebühren | díj (illeték) | fee | Die Gebühr kostet zehn Euro.
n | der Kunde / die Kundin | Kunden / Kundinnen | ügyfél, vevő | customer | Der Kunde wartet am Schalter.
n | der Mitarbeiter / die Mitarbeiterin | Mitarbeiter / Mitarbeiterinnen | munkatárs | employee | Ein Mitarbeiter hilft Ihnen gern.
n | die Anmeldung | Anmeldungen | bejelentkezés; regisztráció | registration | Die Anmeldung ist im Erdgeschoss.
v | anmelden | er meldet an, hat angemeldet | bejelent; jelentkezik | to register | Ich muss mich beim Bürgeramt anmelden.
n | die Bescheinigung | Bescheinigungen | igazolás | certificate | Die Bescheinigung bekommen Sie sofort.
n | die Wartenummer | Wartenummern | sorszám | queue number | Ziehen Sie bitte eine Wartenummer.
`),
];
