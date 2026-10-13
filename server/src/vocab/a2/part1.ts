import { theme } from "../parse.js";

// A2 vocabulary, part 1. type | German | forms | Hungarian | English | example
// Only words that A1 doesn't teach yet.

export const A2_PART1 = [
  theme("a2-feelings", "A2", 1, { hu: "Érzések és jellem", en: "Feelings and character" }, `
n | das Gefühl | Gefühle | érzés | feeling | Ich habe ein gutes Gefühl.
n | die Angst | Ängste | félelem | fear | Hast du Angst vor Hunden?
n | die Freude | Freuden | öröm | joy | Die Kinder springen vor Freude.
n | der Ärger | – | bosszúság | annoyance, trouble | Ich hatte heute viel Ärger im Büro.
n | die Liebe | – | szerelem, szeretet | love | Liebe ist das Wichtigste.
n | das Glück | – | szerencse; boldogság | luck; happiness | Zum Glück hat es nicht geregnet.
n | die Laune | Launen | hangulat | mood | Heute habe ich gute Laune.
n | die Sorge | Sorgen | aggodalom | worry | Mach dir keine Sorgen!
v | sich freuen | er freut sich, hat sich gefreut | örül | to be glad | Ich freue mich auf den Urlaub.
v | sich ärgern | er ärgert sich, hat sich geärgert | bosszankodik | to be annoyed | Er ärgert sich über den Stau.
v | weinen | | sír | to cry | Das Baby weint.
v | lächeln | | mosolyog | to smile | Sie lächelt immer.
v | hoffen | | remél | to hope | Ich hoffe, dass du kommst.
v | fühlen | | érez | to feel | Ich fühle mich nicht wohl.
v | vermissen | | hiányol | to miss | Ich vermisse meine Familie.
a | böse | | mérges; gonosz | angry; evil | Bist du mir böse?
a | wütend | | dühös | furious | Er ist sehr wütend.
a | nervös | | ideges | nervous | Vor der Prüfung bin ich nervös.
a | enttäuscht | | csalódott | disappointed | Ich bin von dem Film enttäuscht.
a | zufrieden | | elégedett | satisfied | Ich bin mit meiner Arbeit zufrieden.
a | lustig | | vicces | funny | Der Film war sehr lustig.
a | ernst | | komoly | serious | Das ist ein ernstes Problem.
a | ehrlich | | őszinte | honest | Sei bitte ehrlich zu mir.
a | höflich | | udvarias | polite | Der Kellner war sehr höflich.
a | fleißig | | szorgalmas | hard-working | Meine Schwester ist sehr fleißig.
a | faul | | lusta | lazy | Am Sonntag bin ich gern faul.
a | ängstlich | | félénk, ijedős | anxious, timid | Der Hund ist ängstlich.
a | neugierig | | kíváncsi | curious | Kinder sind neugierig.
`),

  theme("a2-relationships", "A2", 2, { hu: "Kapcsolatok", en: "Relationships" }, `
n | die Beziehung | Beziehungen | kapcsolat | relationship | Sie haben eine gute Beziehung.
n | die Freundschaft | Freundschaften | barátság | friendship | Unsere Freundschaft ist sehr alt.
n | der Bekannte / die Bekannte | Bekannten | ismerős | acquaintance | Ein Bekannter hat mir geholfen.
n | der Ehemann | Ehemänner | férj | husband | Ihr Ehemann arbeitet in Wien.
n | die Ehefrau | Ehefrauen | feleség | wife | Seine Ehefrau ist Ärztin.
n | die Ehe | Ehen | házasság | marriage | Die Ehe dauert schon 30 Jahre.
n | die Hochzeit | Hochzeiten | esküvő | wedding | Die Hochzeit ist im Juni.
n | der Verwandte / die Verwandte | Verwandten | rokon | relative | Am Wochenende kommen unsere Verwandten.
n | der Enkel / die Enkelin | Enkel / Enkelinnen | unoka | grandchild | Die Oma spielt mit ihrem Enkel.
n | der Neffe | Neffen | unokaöcs | nephew | Mein Neffe ist zehn.
n | die Nichte | Nichten | unokahúg | niece | Meine Nichte studiert in Bonn.
n | der Gast | Gäste | vendég | guest | Wir haben heute Abend Gäste.
n | der Nachwuchs | – | utód, gyermek(ek) | offspring | Sie erwarten Nachwuchs.
v | sich verlieben | er verliebt sich, hat sich verliebt | beleszeret | to fall in love | Er hat sich in Anna verliebt.
v | sich trennen | er trennt sich, hat sich getrennt | szakít, különválik | to split up | Sie haben sich getrennt.
v | sich streiten | er streitet sich, hat sich gestritten | veszekszik | to argue | Die Kinder streiten sich oft.
v | sich verstehen | er versteht sich, hat sich verstanden | kijön vkivel | to get on | Ich verstehe mich gut mit meiner Schwester.
v | sich kümmern um | er kümmert sich, hat sich gekümmert | gondoskodik vkiről | to look after | Sie kümmert sich um ihre Mutter.
v | küssen | | csókol | to kiss | Er küsst seine Frau.
v | umarmen | | megölel | to hug | Die Oma umarmt die Kinder.
v | sich verabreden | er verabredet sich, hat sich verabredet | megbeszél egy találkozót | to arrange to meet | Ich habe mich mit Tom verabredet.
v | sich entschuldigen | er entschuldigt sich, hat sich entschuldigt | bocsánatot kér | to apologise | Er hat sich bei mir entschuldigt.
v | vertrauen | | megbízik vkiben | to trust | Ich vertraue dir.
a | verliebt | | szerelmes | in love | Die beiden sind sehr verliebt.
a | getrennt | | külön; különváltan | separated | Meine Eltern leben getrennt.
a | befreundet | | barátok | friends (with someone) | Wir sind seit der Schule befreundet.
`),

  theme("a2-celebrations", "A2", 3, { hu: "Ünnepek és események", en: "Holidays and events" }, `
n | der Feiertag | Feiertage | ünnepnap | public holiday | Am Montag ist ein Feiertag.
x | Weihnachten | | karácsony | Christmas | Weihnachten feiern wir mit der Familie.
x | Ostern | | húsvét | Easter | Zu Ostern suchen die Kinder Eier.
x | Silvester | | szilveszter | New Year's Eve | Silvester feiern wir mit Freunden.
n | das Neujahr | – | újév | New Year's Day | Neujahr ist ein Feiertag.
n | das Geschenk | Geschenke | ajándék | present, gift | Danke für das schöne Geschenk!
n | die Einladung | Einladungen | meghívás; meghívó | invitation | Danke für die Einladung!
n | die Feier | Feiern | ünnepség | celebration | Die Feier beginnt um acht.
n | die Torte | Torten | torta | gateau, cake | Zum Geburtstag gibt es eine Torte.
n | die Kerze | Kerzen | gyertya | candle | Auf dem Tisch stehen Kerzen.
n | der Glückwunsch | Glückwünsche | jókívánság | congratulations | Herzlichen Glückwunsch zum Geburtstag!
n | die Überraschung | Überraschungen | meglepetés | surprise | Das ist aber eine Überraschung!
n | die Veranstaltung | Veranstaltungen | rendezvény | event | Die Veranstaltung ist kostenlos.
v | feiern | | ünnepel | to celebrate | Wir feiern deinen Geburtstag.
v | gratulieren | | gratulál | to congratulate | Ich gratuliere dir zur Prüfung!
v | schenken | | ajándékoz | to give (as a present) | Was schenkst du deiner Mutter?
v | sich bedanken | er bedankt sich, hat sich bedankt | megköszön | to say thank you | Ich bedanke mich für die Hilfe.
v | stattfinden | es findet statt, hat stattgefunden | megrendezik, sor kerül rá | to take place | Das Fest findet im Park statt.
v | absagen | er sagt ab, hat abgesagt | lemond | to cancel | Leider muss ich den Termin absagen.
v | zusagen | er sagt zu, hat zugesagt | elfogad (meghívást) | to accept | Hast du schon zugesagt?
x | Frohe Weihnachten | | Boldog karácsonyt! | Merry Christmas! | Frohe Weihnachten und ein gutes neues Jahr!
x | Prost | | Egészségedre! (koccintáskor) | Cheers! | Prost, auf deine Gesundheit!
`),

  theme("a2-housing", "A2", 4, { hu: "Lakhatás és bérlés", en: "Housing and renting" }, `
n | der Vermieter / die Vermieterin | Vermieter / Vermieterinnen | főbérlő | landlord, landlady | Der Vermieter wohnt im Erdgeschoss.
n | der Mieter / die Mieterin | Mieter / Mieterinnen | bérlő | tenant | Die Mieter sind sehr ruhig.
n | der Mietvertrag | Mietverträge | bérleti szerződés | tenancy agreement | Ich unterschreibe den Mietvertrag.
n | die Nebenkosten | – | rezsi | utility costs | Die Nebenkosten sind 150 Euro.
n | die Kaution | Kautionen | kaució | deposit | Die Kaution sind drei Monatsmieten.
n | die Heizung | Heizungen | fűtés | heating | Die Heizung ist kaputt.
n | der Strom | – | áram | electricity | Der Strom ist sehr teuer.
n | das Erdgeschoss | Erdgeschosse | földszint | ground floor | Die Wohnung liegt im Erdgeschoss.
n | der Keller | Keller | pince | cellar, basement | Das Fahrrad steht im Keller.
n | das Dach | Dächer | tető | roof | Das Dach muss repariert werden.
n | der Flur | Flure | előszoba, folyosó | hall, corridor | Die Schuhe stehen im Flur.
n | die Anzeige | Anzeigen | hirdetés | advert | Ich habe die Wohnung über eine Anzeige gefunden.
n | der Quadratmeter | Quadratmeter | négyzetméter | square metre | Die Wohnung hat 60 Quadratmeter.
n | das Hochhaus | Hochhäuser | toronyház | high-rise | Wir wohnen in einem Hochhaus.
n | die Garage | Garagen | garázs | garage | Das Auto steht in der Garage.
n | der Hausmeister / die Hausmeisterin | Hausmeister / Hausmeisterinnen | gondnok | caretaker | Der Hausmeister repariert die Tür.
n | die Hausordnung | Hausordnungen | házirend | house rules | Laut Hausordnung ist ab 22 Uhr Ruhe.
v | einziehen | er zieht ein, ist eingezogen | beköltözik | to move in | Wir ziehen am Ersten ein.
v | ausziehen | er zieht aus, ist ausgezogen | kiköltözik | to move out | Er ist bei seinen Eltern ausgezogen.
v | vermieten | | kiad (bérbe) | to let, to rent out | Sie vermieten ein Zimmer.
v | besichtigen | | megtekint | to view | Wann kann ich die Wohnung besichtigen?
v | heizen | | fűt | to heat | Im Winter heizen wir viel.
a | möbliert | | bútorozott | furnished | Das Zimmer ist möbliert.
a | gemütlich | | otthonos, kényelmes | cosy | Das Wohnzimmer ist sehr gemütlich.
a | modern | | modern | modern | Die Küche ist modern.
a | eng | | szűk | narrow, cramped | Der Flur ist sehr eng.
`),

  theme("a2-household", "A2", 5, { hu: "Háztartás és javítás", en: "Household and repairs" }, `
n | der Haushalt | Haushalte | háztartás | household | Wir teilen uns die Arbeit im Haushalt.
n | der Müll | – | szemét | rubbish | Bringst du bitte den Müll raus?
n | der Mülleimer | Mülleimer | szemetes | bin | Der Mülleimer ist voll.
n | die Wäsche | – | mosnivaló; ruhanemű | laundry | Ich hänge die Wäsche auf.
n | der Staubsauger | Staubsauger | porszívó | vacuum cleaner | Der Staubsauger ist laut.
n | das Geschirr | – | edény | dishes | Das Geschirr ist schon sauber.
n | die Spülmaschine | Spülmaschinen | mosogatógép | dishwasher | Stell die Teller in die Spülmaschine.
n | der Backofen | Backöfen | sütő | oven | Der Kuchen ist im Backofen.
n | die Steckdose | Steckdosen | konnektor | socket | Wo ist hier eine Steckdose?
n | das Licht | Lichter | fény; villany | light | Mach bitte das Licht an.
n | die Glühbirne | Glühbirnen | villanykörte | light bulb | Die Glühbirne ist kaputt.
n | das Werkzeug | Werkzeuge | szerszám | tool | Das Werkzeug liegt im Keller.
n | der Handwerker / die Handwerkerin | Handwerker / Handwerkerinnen | szerelő, mesterember | tradesperson | Der Handwerker kommt am Donnerstag.
n | der Schaden | Schäden | kár | damage | Der Schaden ist nicht groß.
v | reparieren | | megjavít | to repair | Kannst du mein Fahrrad reparieren?
v | aufräumen | er räumt auf, hat aufgeräumt | rendet rak | to tidy up | Räum bitte dein Zimmer auf!
v | saugen | | porszívóz | to vacuum | Ich sauge jeden Samstag.
v | bügeln | | vasal | to iron | Ich bügle die Hemden.
v | abtrocknen | er trocknet ab, hat abgetrocknet | eltöröl, megszárít | to dry (dishes) | Kannst du bitte abtrocknen?
v | wegwerfen | er wirft weg, hat weggeworfen | kidob | to throw away | Wirf das alte Brot nicht weg!
v | trennen | | szétválaszt | to separate, to sort | Wir trennen den Müll.
v | einschalten | er schaltet ein, hat eingeschaltet | bekapcsol | to switch on | Schalte bitte den Fernseher ein.
v | ausschalten | er schaltet aus, hat ausgeschaltet | kikapcsol | to switch off | Schalte das Licht aus, wenn du gehst.
v | funktionieren | | működik | to work (function) | Die Waschmaschine funktioniert nicht.
a | defekt | | hibás, rossz | faulty | Die Heizung ist defekt.
a | nass | nasser / nässer | nedves, vizes | wet | Die Wäsche ist noch nass.
a | trocken | | száraz | dry | Die Wäsche ist schon trocken.
`),

  theme("a2-cooking", "A2", 6, { hu: "Főzés és alapanyagok", en: "Cooking and ingredients" }, `
n | das Rezept | Rezepte | recept (főzéshez vagy orvosi) | recipe; prescription | Kannst du mir das Rezept geben?
n | die Zutat | Zutaten | hozzávaló | ingredient | Welche Zutaten brauchen wir?
n | das Mehl | – | liszt | flour | Für den Kuchen brauche ich Mehl.
n | das Öl | Öle | olaj | oil | Ich brate das Fleisch in Öl.
n | der Pfeffer | – | bors | pepper | Salz und Pfeffer, bitte.
n | die Sahne | – | tejszín | cream | Möchtest du Sahne zum Kuchen?
n | der Quark | – | túró | quark (curd cheese) | Ich esse Quark mit Obst.
n | das Rindfleisch | – | marhahús | beef | Das Gulasch ist aus Rindfleisch.
n | das Schweinefleisch | – | sertéshús | pork | Ich esse kein Schweinefleisch.
n | die Paprika | Paprikas | paprika | pepper (vegetable); paprika | Die Paprika ist rot.
n | die Karotte | Karotten | sárgarépa | carrot | Kinder essen gern Karotten.
n | der Knoblauch | – | fokhagyma | garlic | Die Soße hat viel Knoblauch.
n | die Zitrone | Zitronen | citrom | lemon | Tee mit Zitrone, bitte.
n | die Erdbeere | Erdbeeren | eper | strawberry | Im Juni gibt es Erdbeeren.
n | die Birne | Birnen | körte | pear | Die Birne ist sehr süß.
n | die Traube | Trauben | szőlő | grape | Ich kaufe ein Kilo Trauben.
n | die Soße | Soßen | szósz | sauce | Die Soße ist zu scharf.
n | die Pfanne | Pfannen | serpenyő | frying pan | Das Ei ist in der Pfanne.
n | die Schüssel | Schüsseln | tál | bowl | Gib die Zutaten in eine Schüssel.
v | braten | er brät, hat gebraten | süt (serpenyőben) | to fry | Ich brate das Fleisch.
v | backen | er backt, hat gebacken | süt (sütőben) | to bake | Wir backen einen Kuchen.
v | schneiden | er schneidet, hat geschnitten | vág | to cut | Schneide die Zwiebel klein.
v | mischen | | összekever | to mix | Mischen Sie Mehl und Zucker.
v | probieren | | megkóstol; kipróbál | to taste; to try | Probier mal die Suppe!
a | scharf | schärfer, am schärfsten | csípős; éles | spicy; sharp | Das Essen ist zu scharf.
a | salzig | | sós | salty | Die Suppe ist zu salzig.
a | sauer | saurer, am sauersten | savanyú | sour | Die Zitrone ist sauer.
a | frisch | | friss | fresh | Das Brot ist ganz frisch.
`),

  theme("a2-eating-out", "A2", 7, { hu: "Étteremben", en: "Eating out" }, `
n | die Speisekarte | Speisekarten | étlap | menu | Die Speisekarte, bitte.
n | die Rechnung | Rechnungen | számla | bill | Die Rechnung, bitte!
n | das Trinkgeld | Trinkgelder | borravaló | tip | Wie viel Trinkgeld gibt man hier?
n | die Vorspeise | Vorspeisen | előétel | starter | Als Vorspeise nehme ich die Suppe.
n | das Hauptgericht | Hauptgerichte | főétel | main course | Was möchten Sie als Hauptgericht?
n | die Nachspeise | Nachspeisen | desszert | dessert | Zur Nachspeise gibt es Eis.
n | das Gericht | Gerichte | étel, fogás | dish | Das ist ein typisches Gericht aus Bayern.
n | die Portion | Portionen | adag | portion | Die Portion ist sehr groß.
n | das Eis | – | fagylalt; jég | ice cream; ice | Ich nehme ein Eis mit Sahne.
n | die Pommes | – | sült krumpli | chips, fries | Einmal Pommes mit Ketchup, bitte.
n | die Reservierung | Reservierungen | foglalás | reservation | Ich habe eine Reservierung auf den Namen Kovács.
n | der Imbiss | Imbisse | büfé, gyorsétterem | snack bar | Mittags esse ich am Imbiss.
n | die Kantine | Kantinen | menza | canteen | In der Kantine ist das Essen günstig.
n | der Vegetarier / die Vegetarierin | Vegetarier / Vegetarierinnen | vegetáriánus | vegetarian | Meine Schwester ist Vegetarierin.
v | reservieren | | foglal | to reserve | Ich möchte einen Tisch reservieren.
v | empfehlen | er empfiehlt, hat empfohlen | ajánl | to recommend | Was können Sie empfehlen?
v | servieren | | felszolgál | to serve | Das Essen wird gleich serviert.
v | sich beschweren | er beschwert sich, hat sich beschwert | panaszt tesz | to complain | Ich möchte mich beschweren.
a | besetzt | | foglalt | taken, occupied | Ist dieser Platz besetzt?
a | vegetarisch | | vegetáriánus | vegetarian | Haben Sie auch vegetarische Gerichte?
x | getrennt oder zusammen | | külön vagy együtt? (fizetésnél) | separately or together? (paying) | Getrennt oder zusammen? – Zusammen, bitte.
x | Guten Appetit | | Jó étvágyat! | Enjoy your meal! | Guten Appetit!
x | Stimmt so | | A többi a magáé. | Keep the change. | Das macht 18 Euro. – Hier sind 20, stimmt so.
`),

  theme("a2-shopping", "A2", 8, { hu: "Vásárlás és reklamáció", en: "Shopping and complaints" }, `
n | das Kaufhaus | Kaufhäuser | áruház | department store | Im Kaufhaus gibt es alles.
n | das Einkaufszentrum | Einkaufszentren | bevásárlóközpont | shopping centre | Am Samstag ist das Einkaufszentrum voll.
n | die Kundenkarte | Kundenkarten | törzsvásárlói kártya | loyalty card | Haben Sie eine Kundenkarte?
n | der Kassenbon | Kassenbons | blokk | receipt | Bitte heben Sie den Kassenbon auf.
n | die Quittung | Quittungen | nyugta | receipt | Kann ich eine Quittung bekommen?
n | die Garantie | Garantien | garancia | guarantee | Das Handy hat zwei Jahre Garantie.
n | die Umkleidekabine | Umkleidekabinen | próbafülke | changing room | Die Umkleidekabine ist dort hinten.
n | die Marke | Marken | márka | brand | Welche Marke ist das?
n | die Qualität | Qualitäten | minőség | quality | Die Qualität ist sehr gut.
n | der Rabatt | Rabatte | kedvezmény | discount | Heute gibt es zehn Prozent Rabatt.
n | die Auswahl | – | választék | choice, selection | Die Auswahl ist sehr groß.
n | die Ware | Waren | áru | goods | Die Ware kommt morgen.
n | die Reklamation | Reklamationen | reklamáció | complaint | Ich habe eine Reklamation.
n | die Bestellung | Bestellungen | rendelés | order | Die Bestellung ist angekommen.
n | die Lieferung | Lieferungen | szállítás | delivery | Die Lieferung dauert drei Tage.
v | umtauschen | er tauscht um, hat umgetauscht | kicserél | to exchange | Kann ich die Hose umtauschen?
v | zurückgeben | er gibt zurück, hat zurückgegeben | visszaad | to return | Ich möchte das Buch zurückgeben.
v | liefern | | szállít | to deliver | Wir liefern auch am Samstag.
v | aussuchen | er sucht aus, hat ausgesucht | kiválaszt | to pick out | Such dir etwas aus!
v | passen | | illik; megfelel (méret) | to fit; to suit | Die Jacke passt mir nicht.
v | sich entscheiden | er entscheidet sich, hat sich entschieden | dönt | to decide | Ich kann mich nicht entscheiden.
a | modisch | | divatos | fashionable | Die Jacke ist sehr modisch.
a | altmodisch | | régimódi | old-fashioned | Der Mantel ist ein bisschen altmodisch.
a | preiswert | | jutányos | good value | Der Mantel ist sehr preiswert.
a | ausverkauft | | elfogyott | sold out | Die Schuhe sind leider ausverkauft.
x | im Sonderangebot | | akciós | on special offer | Der Kaffee ist heute im Sonderangebot.
`),

  theme("a2-directions", "A2", 9, { hu: "Tájékozódás", en: "Finding your way" }, `
n | der Weg | Wege | út | way, path | Können Sie mir den Weg zeigen?
n | die Richtung | Richtungen | irány | direction | In welche Richtung muss ich gehen?
n | der Stadtplan | Stadtpläne | várostérkép | city map | Hast du einen Stadtplan?
n | die Kreuzung | Kreuzungen | kereszteződés | junction, crossroads | An der Kreuzung gehen Sie links.
n | die Brücke | Brücken | híd | bridge | Gehen Sie über die Brücke.
n | der Eingang | Eingänge | bejárat | entrance | Der Eingang ist hinten.
n | der Ausgang | Ausgänge | kijárat | exit | Wo ist der Ausgang?
n | das Gebäude | Gebäude | épület | building | Das Gebäude ist sehr hoch.
n | die Gegend | Gegenden | környék | area | Die Gegend ist sehr ruhig.
n | der Stadtteil | Stadtteile | városrész | district | In welchem Stadtteil wohnst du?
n | die Innenstadt | Innenstädte | belváros | town centre | Die Innenstadt ist voller Touristen.
n | die Altstadt | Altstädte | óváros | old town | Die Altstadt ist sehr schön.
n | das Schild | Schilder | tábla | sign | Folgen Sie dem Schild.
n | der Norden | – | észak | north | Hamburg liegt im Norden.
n | der Süden | – | dél | south | München liegt im Süden.
n | der Osten | – | kelet | east | Die Sonne geht im Osten auf.
n | der Westen | – | nyugat | west | Köln liegt im Westen.
v | abbiegen | er biegt ab, ist abgebogen | bekanyarodik | to turn | Biegen Sie an der Ampel rechts ab.
v | überqueren | | átkel | to cross | Überqueren Sie die Straße.
v | sich verlaufen | er verläuft sich, hat sich verlaufen | eltéved (gyalog) | to get lost | Ich habe mich verlaufen.
v | folgen | er folgt, ist gefolgt | követ | to follow | Folgen Sie mir bitte!
x | gegenüber | | szemben | opposite | Die Post ist gegenüber vom Bahnhof.
x | neben | | mellett | next to | Die Bank ist neben dem Café.
x | hinter | | mögött | behind | Der Parkplatz ist hinter dem Haus.
x | vor | | előtt | in front of; before | Ich warte vor dem Kino.
x | entlang | | mentén, végig | along | Gehen Sie die Straße entlang.
x | bis zu | | -ig | up to, as far as | Gehen Sie bis zur Kirche.
x | um die Ecke | | a sarkon túl | round the corner | Der Supermarkt ist gleich um die Ecke.
`),

  theme("a2-travel", "A2", 10, { hu: "Utazás és szállás", en: "Travel and accommodation" }, `
n | die Unterkunft | Unterkünfte | szállás | accommodation | Wir suchen eine günstige Unterkunft.
n | die Pension | Pensionen | panzió | guest house | Wir übernachten in einer kleinen Pension.
n | die Jugendherberge | Jugendherbergen | ifjúsági szálló | youth hostel | Die Jugendherberge ist billig.
n | der Campingplatz | Campingplätze | kemping | campsite | Der Campingplatz liegt am See.
n | das Einzelzimmer | Einzelzimmer | egyágyas szoba | single room | Ich hätte gern ein Einzelzimmer.
n | das Doppelzimmer | Doppelzimmer | kétágyas szoba | double room | Das Doppelzimmer kostet 90 Euro.
n | die Rezeption | Rezeptionen | recepció | reception | Fragen Sie an der Rezeption.
n | die Übernachtung | Übernachtungen | éjszakázás (szálláson) | overnight stay | Eine Übernachtung kostet 60 Euro.
n | die Halbpension | – | félpanzió | half board | Wir haben Halbpension gebucht.
n | das Reisebüro | Reisebüros | utazási iroda | travel agency | Wir buchen die Reise im Reisebüro.
n | der Tourist / die Touristin | Touristen / Touristinnen | turista | tourist | Im Sommer kommen viele Touristen.
n | die Sehenswürdigkeit | Sehenswürdigkeiten | látnivaló | sight, attraction | Welche Sehenswürdigkeiten gibt es hier?
n | die Führung | Führungen | vezetés (idegenvezetés) | guided tour | Die Führung beginnt um zehn.
n | das Gepäck | – | csomag, poggyász | luggage | Wo kann ich mein Gepäck lassen?
n | der Rucksack | Rucksäcke | hátizsák | rucksack | Mein Rucksack ist sehr schwer.
n | die Grenze | Grenzen | határ | border | An der Grenze müssen wir warten.
n | das Ausland | – | külföld | abroad | Ich war noch nie im Ausland.
n | der Strand | Strände | strand, tengerpart | beach | Wir liegen den ganzen Tag am Strand.
n | die Insel | Inseln | sziget | island | Wir machen Urlaub auf einer Insel.
v | buchen | | lefoglal | to book | Ich habe das Hotel online gebucht.
v | übernachten | | megszáll, éjszakázik | to stay overnight | Wir übernachten bei Freunden.
v | packen | | csomagol | to pack | Hast du schon den Koffer gepackt?
v | sich erholen | er erholt sich, hat sich erholt | kipiheni magát | to relax, to recover | Im Urlaub möchte ich mich erholen.
v | sich sonnen | er sonnt sich, hat sich gesonnt | napozik | to sunbathe | Wir sonnen uns am Strand.
a | inklusive | | -val együtt, benne van | included | Das Frühstück ist inklusive.
x | Gute Reise | | Jó utat! | Have a good trip! | Gute Reise und viel Spaß!
`),

  theme("a2-traffic", "A2", 11, { hu: "Közlekedés és autó", en: "Traffic and cars" }, `
n | der Verkehr | – | forgalom | traffic | Am Morgen ist viel Verkehr.
n | der Stau | Staus | dugó | traffic jam | Wir stehen im Stau.
n | der Unfall | Unfälle | baleset | accident | Auf der Autobahn gab es einen Unfall.
n | die Autobahn | Autobahnen | autópálya | motorway | Auf der Autobahn fahren wir schnell.
n | der Führerschein | Führerscheine | jogosítvány | driving licence | Ich mache gerade den Führerschein.
n | die Tankstelle | Tankstellen | benzinkút | petrol station | Wir müssen zur Tankstelle.
n | das Benzin | – | benzin | petrol | Das Benzin ist teurer geworden.
n | der Parkplatz | Parkplätze | parkoló | car park, parking space | Ich finde keinen Parkplatz.
n | das Parkhaus | Parkhäuser | parkolóház | multi-storey car park | Wir parken im Parkhaus.
n | die Verspätung | Verspätungen | késés | delay | Der Zug hat zehn Minuten Verspätung.
n | die Verbindung | Verbindungen | (közlekedési) kapcsolat, járat | connection | Gibt es eine direkte Verbindung nach Graz?
n | der Fahrplan | Fahrpläne | menetrend | timetable | Laut Fahrplan kommt der Bus um acht.
n | die Monatskarte | Monatskarten | havibérlet | monthly ticket | Ich habe eine Monatskarte.
n | der Fahrgast | Fahrgäste | utas | passenger | Die Fahrgäste steigen aus.
n | die Panne | Pannen | lerobbanás, műszaki hiba | breakdown | Wir hatten eine Panne auf der Autobahn.
n | das Motorrad | Motorräder | motorkerékpár | motorbike | Mein Bruder fährt Motorrad.
n | der Lkw | Lkws | teherautó | lorry, truck | Vor uns fährt ein Lkw.
v | parken | | parkol | to park | Hier dürfen Sie nicht parken.
v | tanken | | tankol | to fill up | Ich muss noch tanken.
v | einsteigen | er steigt ein, ist eingestiegen | beszáll | to get in | Bitte schnell einsteigen!
v | aussteigen | er steigt aus, ist ausgestiegen | kiszáll | to get out | An der nächsten Haltestelle steige ich aus.
v | verpassen | | lekésik | to miss | Ich habe den Bus verpasst.
v | erreichen | | elér | to reach; to catch | Wir haben den Zug noch erreicht.
v | halten | er hält, hat gehalten | megáll; tart | to stop; to hold | Der Zug hält nicht in Linz.
a | direkt | | közvetlen | direct | Der Zug fährt direkt nach Wien.
a | gefährlich | | veszélyes | dangerous | Die Straße ist im Winter gefährlich.
`),

  theme("a2-health", "A2", 12, { hu: "Egészség és orvosnál", en: "Health and at the doctor's" }, `
n | die Krankheit | Krankheiten | betegség | illness | Er hat eine schwere Krankheit.
n | die Erkältung | Erkältungen | megfázás | cold | Ich habe eine Erkältung.
n | die Grippe | – | influenza | flu | Die halbe Klasse hat Grippe.
n | der Husten | – | köhögés | cough | Der Husten ist schon besser.
n | der Schnupfen | – | nátha | runny nose, cold | Ich habe Schnupfen.
n | die Allergie | Allergien | allergia | allergy | Ich habe eine Allergie gegen Katzen.
n | die Verletzung | Verletzungen | sérülés | injury | Die Verletzung ist nicht schlimm.
n | die Spritze | Spritzen | injekció | injection | Der Arzt gibt mir eine Spritze.
n | die Krankmeldung | Krankmeldungen | betegszabadság-igazolás | sick note | Ich brauche eine Krankmeldung für die Firma.
n | die Versichertenkarte | Versichertenkarten | biztosítási kártya | health insurance card | Ihre Versichertenkarte, bitte.
n | die Krankenkasse | Krankenkassen | egészségbiztosító | health insurance fund | Welche Krankenkasse haben Sie?
n | das Wartezimmer | Wartezimmer | váróterem | waiting room | Bitte nehmen Sie im Wartezimmer Platz.
n | der Zahnarzt / die Zahnärztin | Zahnärzte / Zahnärztinnen | fogorvos | dentist | Ich habe Angst vor dem Zahnarzt.
n | der Notarzt / die Notärztin | Notärzte / Notärztinnen | mentőorvos | emergency doctor | Rufen Sie den Notarzt!
n | der Krankenwagen | Krankenwagen | mentőautó | ambulance | Der Krankenwagen kommt sofort.
n | die Sprechstunde | Sprechstunden | rendelési idő | consulting hours | Die Sprechstunde ist von 8 bis 12 Uhr.
n | die Salbe | Salben | kenőcs | ointment | Nehmen Sie diese Salbe zweimal am Tag.
v | untersuchen | | megvizsgál | to examine | Der Arzt untersucht das Kind.
v | sich verletzen | er verletzt sich, hat sich verletzt | megsérül | to hurt oneself | Ich habe mich am Knie verletzt.
v | husten | | köhög | to cough | Das Kind hustet die ganze Nacht.
v | sich hinlegen | er legt sich hin, hat sich hingelegt | lefekszik | to lie down | Leg dich ein bisschen hin.
v | einnehmen | er nimmt ein, hat eingenommen | bevesz (gyógyszert) | to take (medicine) | Nehmen Sie die Tabletten nach dem Essen ein.
v | sich ausruhen | er ruht sich aus, hat sich ausgeruht | pihen | to rest | Sie müssen sich ausruhen.
a | schlimm | | rossz, súlyos | bad, serious | Ist es schlimm?
a | gebrochen | | törött | broken | Sein Arm ist gebrochen.
a | erkältet | | megfázott | having a cold | Ich bin erkältet.
a | schwanger | | terhes, várandós | pregnant | Meine Schwester ist schwanger.
a | übel | | rosszul (hányingerrel) | sick, nauseous | Mir ist übel.
`),
];
