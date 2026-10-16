import { theme } from "../parse.js";

// B1 vocabulary, part 1. type | German | forms | Hungarian | English | example
// Only words that A1 and A2 don't teach yet.

export const B1_PART1 = [
  theme("b1-personality", "B1", 1, { hu: "Személyiség és viselkedés", en: "Personality and behaviour" }, `
n | die Persönlichkeit | Persönlichkeiten | személyiség | personality | Sie hat eine starke Persönlichkeit.
n | der Charakter | Charaktere | jellem | character | Er hat einen guten Charakter.
n | die Eigenschaft | Eigenschaften | tulajdonság | quality, trait | Geduld ist eine wichtige Eigenschaft.
n | das Verhalten | – | viselkedés | behaviour | Sein Verhalten war unmöglich.
n | die Geduld | – | türelem | patience | Mit Kindern braucht man viel Geduld.
n | das Selbstbewusstsein | – | önbizalom | self-confidence | Sie hat viel Selbstbewusstsein.
n | der Humor | – | humor | humour | Er hat einen tollen Humor.
n | die Stärke | Stärken | erősség | strength | Teamarbeit ist eine meiner Stärken.
n | die Schwäche | Schwächen | gyengeség | weakness | Ungeduld ist meine größte Schwäche.
v | sich verhalten | er verhält sich, hat sich verhalten | viselkedik | to behave | Er hat sich sehr höflich verhalten.
v | sich benehmen | er benimmt sich, hat sich benommen | viselkedik (illedelmesen) | to behave (oneself) | Benimm dich bitte!
a | geduldig | | türelmes | patient | Die Lehrerin ist sehr geduldig.
a | ungeduldig | | türelmetlen | impatient | Sei nicht so ungeduldig!
a | selbstbewusst | | magabiztos | self-confident | Sie tritt sehr selbstbewusst auf.
a | schüchtern | | félénk | shy | Als Kind war ich sehr schüchtern.
a | aufgeschlossen | | nyitott (új dolgokra) | open-minded | Sie ist neuen Ideen gegenüber aufgeschlossen.
a | ordentlich | | rendes, rendszerető | tidy, orderly | Mein Mitbewohner ist sehr ordentlich.
a | unordentlich | | rendetlen | untidy | Sein Zimmer ist immer unordentlich.
a | großzügig | | nagylelkű | generous | Meine Tante ist sehr großzügig.
a | geizig | | fukar | stingy | Sei doch nicht so geizig!
a | hilfsbereit | | segítőkész | helpful | Die Nachbarn sind sehr hilfsbereit.
a | rücksichtsvoll | | tapintatos, figyelmes | considerate | Bitte seien Sie rücksichtsvoll.
a | egoistisch | | önző | selfish | Er ist manchmal ein bisschen egoistisch.
a | ehrgeizig | | becsvágyó, ambiciózus | ambitious | Sie ist sehr ehrgeizig und will Chefin werden.
a | kreativ | | kreatív | creative | Meine Schwester ist sehr kreativ.
a | sympathisch | | szimpatikus | likeable | Der neue Kollege ist sehr sympathisch.
a | unhöflich | | udvariatlan | rude | Das war ziemlich unhöflich.
`),

  theme("b1-society", "B1", 2, { hu: "Társadalom és együttélés", en: "Society and living together" }, `
n | die Gesellschaft | Gesellschaften | társadalom | society | Wir leben in einer offenen Gesellschaft.
n | die Gemeinschaft | Gemeinschaften | közösség | community | Die Gemeinschaft hilft den Familien.
n | die Bevölkerung | – | lakosság | population | Die Bevölkerung wird immer älter.
n | der Bürger / die Bürgerin | Bürger / Bürgerinnen | polgár, állampolgár | citizen | Alle Bürger dürfen wählen.
n | der Einwohner / die Einwohnerin | Einwohner / Einwohnerinnen | lakos | inhabitant | Die Stadt hat 100.000 Einwohner.
n | die Generation | Generationen | nemzedék | generation | Die junge Generation denkt anders.
n | die Jugend | – | ifjúság | youth | In meiner Jugend habe ich viel Sport gemacht.
n | der Rentner / die Rentnerin | Rentner / Rentnerinnen | nyugdíjas | pensioner | Mein Vater ist seit einem Jahr Rentner.
n | die Kultur | Kulturen | kultúra | culture | Ich interessiere mich für andere Kulturen.
n | die Tradition | Traditionen | hagyomány | tradition | Das ist eine alte Tradition.
n | die Religion | Religionen | vallás | religion | In Deutschland gibt es viele Religionen.
n | die Heimat | – | szülőföld, otthon | home (country) | Ungarn ist meine Heimat.
n | der Migrant / die Migrantin | Migranten / Migrantinnen | bevándorló | migrant | Viele Migranten lernen Deutsch.
n | die Integration | – | beilleszkedés, integráció | integration | Die Sprache ist wichtig für die Integration.
n | das Vorurteil | Vorurteile | előítélet | prejudice | Wir müssen Vorurteile abbauen.
n | die Toleranz | – | tolerancia | tolerance | Toleranz ist sehr wichtig.
n | die Gleichberechtigung | – | egyenjogúság | equality | Gleichberechtigung von Mann und Frau ist ein Grundrecht.
n | die Armut | – | szegénység | poverty | Armut ist ein großes Problem.
n | der Reichtum | – | gazdagság | wealth | Der Reichtum ist ungleich verteilt.
n | das Ehrenamt | Ehrenämter | önkéntes munka | voluntary work | Sie arbeitet im Ehrenamt im Altenheim.
n | die Nachbarschaft | Nachbarschaften | szomszédság | neighbourhood | In unserer Nachbarschaft helfen sich alle.
v | sich integrieren | er integriert sich, hat sich integriert | beilleszkedik | to integrate | Er hat sich schnell integriert.
v | zusammenleben | er lebt zusammen, hat zusammengelebt | együtt él | to live together | Wir leben seit drei Jahren zusammen.
v | sich engagieren | er engagiert sich, hat sich engagiert | szerepet vállal, elkötelezi magát | to get involved | Sie engagiert sich für den Umweltschutz.
v | unterstützen | | támogat | to support | Meine Eltern unterstützen mich.
a | fremdenfeindlich | | idegenellenes | xenophobic | Fremdenfeindliche Kommentare werden gelöscht.
a | sozial | | szociális | social | Sie arbeitet in einem sozialen Beruf.
a | gesellschaftlich | | társadalmi | social, societal | Das ist ein gesellschaftliches Problem.
`),

  theme("b1-career", "B1", 3, { hu: "Karrier és szakma", en: "Career and profession" }, `
n | die Karriere | Karrieren | karrier | career | Sie hat eine tolle Karriere gemacht.
n | die Branche | Branchen | ágazat | sector, industry | In welcher Branche arbeiten Sie?
n | der Betrieb | Betriebe | üzem, vállalat | company, business | Der Betrieb hat 50 Mitarbeiter.
n | das Unternehmen | Unternehmen | vállalat | company | Das Unternehmen sucht neue Fachkräfte.
n | die Fachkraft | Fachkräfte | szakember | skilled worker | In der Pflege fehlen Fachkräfte.
n | die Qualifikation | Qualifikationen | képesítés | qualification | Welche Qualifikationen haben Sie?
n | die Kenntnis | Kenntnisse | ismeret | knowledge | Gute Deutschkenntnisse sind wichtig.
n | die Fähigkeit | Fähigkeiten | képesség | ability, skill | Sie hat viele Fähigkeiten.
n | die Verantwortung | – | felelősség | responsibility | Er trägt viel Verantwortung.
n | die Aufgabe | Aufgaben | feladat | task, duty | Zu meinen Aufgaben gehört die Planung.
n | die Leistung | Leistungen | teljesítmény | performance, achievement | Die Firma ist mit seiner Leistung zufrieden.
n | die Beförderung | Beförderungen | előléptetés | promotion | Sie hat eine Beförderung bekommen.
n | die Gehaltserhöhung | Gehaltserhöhungen | fizetésemelés | pay rise | Ich bitte um eine Gehaltserhöhung.
n | die Probezeit | Probezeiten | próbaidő | probation period | Die Probezeit dauert sechs Monate.
n | die Stellenanzeige | Stellenanzeigen | álláshirdetés | job advert | Ich habe die Stellenanzeige im Internet gesehen.
n | die Arbeitslosigkeit | – | munkanélküliség | unemployment | Die Arbeitslosigkeit ist gesunken.
n | das Arbeitsamt | Arbeitsämter | munkaügyi hivatal | job centre | Er hat sich beim Arbeitsamt gemeldet.
n | der Auszubildende / die Auszubildende | Auszubildenden | szakmunkástanuló | apprentice, trainee | Wir haben drei Auszubildende.
n | die Gewerkschaft | Gewerkschaften | szakszervezet | trade union | Die Gewerkschaft fordert mehr Lohn.
n | der Streik | Streiks | sztrájk | strike | Wegen des Streiks fahren keine Züge.
v | befördern | | előléptet; szállít | to promote; to transport | Sie wurde zur Abteilungsleiterin befördert.
v | leiten | | vezet, irányít | to manage, to lead | Er leitet ein kleines Team.
v | streiken | | sztrájkol | to strike | Die Lokführer streiken heute.
v | sich weiterbilden | er bildet sich weiter, hat sich weitergebildet | továbbképzi magát | to do further training | Ich möchte mich weiterbilden.
a | verantwortlich | | felelős | responsible | Wer ist dafür verantwortlich?
a | erfolgreich | | sikeres | successful | Das Projekt war sehr erfolgreich.
a | qualifiziert | | képzett | qualified | Wir suchen qualifizierte Mitarbeiter.
a | befristet | | határozott idejű | fixed-term | Der Vertrag ist auf ein Jahr befristet.
a | unbefristet | | határozatlan idejű | permanent | Endlich habe ich einen unbefristeten Vertrag.
`),

  theme("b1-workplace", "B1", 4, { hu: "Munkahelyi kommunikáció", en: "Communication at work" }, `
n | das Projekt | Projekte | projekt | project | Das Projekt endet im Dezember.
n | das Ziel | Ziele | cél | goal, aim | Unser Ziel ist mehr Kundenzufriedenheit.
n | der Vorschlag | Vorschläge | javaslat | suggestion | Ich habe einen Vorschlag.
n | die Entscheidung | Entscheidungen | döntés | decision | Die Entscheidung fällt nächste Woche.
n | das Ergebnis | Ergebnisse | eredmény | result | Das Ergebnis ist sehr gut.
n | das Protokoll | Protokolle | jegyzőkönyv | minutes | Wer schreibt heute das Protokoll?
n | die Tagesordnung | Tagesordnungen | napirend | agenda | Was steht auf der Tagesordnung?
n | die Präsentation | Präsentationen | prezentáció | presentation | Morgen halte ich eine Präsentation.
n | das Team | Teams | csapat | team | Unser Team ist sehr international.
n | der Auftrag | Aufträge | megbízás, megrendelés | order, assignment | Wir haben einen großen Auftrag bekommen.
n | die Rückmeldung | Rückmeldungen | visszajelzés | feedback | Danke für die schnelle Rückmeldung.
n | der Konflikt | Konflikte | konfliktus | conflict | Im Team gibt es einen Konflikt.
n | die Kritik | Kritiken | kritika | criticism | Er kann keine Kritik akzeptieren.
n | der Stress | – | stressz | stress | Im Moment habe ich viel Stress.
v | besprechen | er bespricht, hat besprochen | megbeszél | to discuss | Das besprechen wir morgen.
v | planen | | tervez | to plan | Wir planen ein neues Projekt.
v | organisieren | | szervez | to organise | Sie organisiert die Feier.
v | präsentieren | | bemutat | to present | Er präsentiert die Ergebnisse.
v | sich einigen | er einigt sich, hat sich geeinigt | megegyezik | to agree | Wir haben uns auf einen Termin geeinigt.
v | kritisieren | | kritizál | to criticise | Der Chef kritisiert seine Arbeit.
v | sich melden | er meldet sich, hat sich gemeldet | jelentkezik, jelez | to get in touch | Ich melde mich morgen bei Ihnen.
v | weiterleiten | er leitet weiter, hat weitergeleitet | továbbít | to forward | Ich leite Ihnen die E-Mail weiter.
v | verschieben | er verschiebt, hat verschoben | elhalaszt; eltol | to postpone; to move | Wir müssen die Sitzung verschieben.
a | zuständig | | illetékes | responsible, in charge | Wer ist hier zuständig?
a | dringend | | sürgős | urgent | Es ist dringend!
a | gestresst | | stresszes | stressed | Ich bin total gestresst.
`),

  theme("b1-education", "B1", 5, { hu: "Oktatás és tanulmányok", en: "Education and studies" }, `
n | die Bildung | – | oktatás, műveltség | education | Bildung ist sehr wichtig.
n | das Schulsystem | Schulsysteme | iskolarendszer | school system | Das deutsche Schulsystem ist kompliziert.
n | der Abschluss | Abschlüsse | végzettség | qualification, degree | Welchen Schulabschluss haben Sie?
n | das Diplom | Diplome | diploma | diploma | Er hat ein Diplom in Informatik.
n | der Studiengang | Studiengänge | szak | degree programme | Welchen Studiengang hast du gewählt?
n | das Semester | Semester | félév | semester | Ich bin im dritten Semester.
n | die Vorlesung | Vorlesungen | előadás (egyetemi) | lecture | Die Vorlesung beginnt um zehn.
n | das Seminar | Seminare | szeminárium | seminar | Im Seminar diskutieren wir viel.
n | der Professor / die Professorin | Professoren / Professorinnen | professzor | professor | Die Professorin ist sehr streng.
n | das Stipendium | Stipendien | ösztöndíj | scholarship | Sie hat ein Stipendium bekommen.
n | die Prüfungsangst | – | vizsgadrukk | exam nerves | Vor Prüfungen habe ich immer Prüfungsangst.
n | das Wissen | – | tudás | knowledge | Wissen ist Macht.
n | die Erziehung | – | nevelés | upbringing | Die Erziehung der Kinder ist nicht leicht.
n | die Anmeldegebühr | Anmeldegebühren | jelentkezési díj | registration fee | Die Anmeldegebühr beträgt 50 Euro.
n | der Erfolg | Erfolge | siker | success | Viel Erfolg bei der Prüfung!
n | die Hausarbeit | Hausarbeiten | beadandó dolgozat | term paper | Ich schreibe eine Hausarbeit über Goethe.
v | erziehen | er erzieht, hat erzogen | nevel | to bring up | Sie haben ihre Kinder gut erzogen.
v | sich anmelden für | er meldet sich an, hat sich angemeldet | jelentkezik vmire | to sign up for | Ich habe mich für einen Kurs angemeldet.
v | abschließen | er schließt ab, hat abgeschlossen | befejez, elvégez | to complete | Sie hat ihr Studium abgeschlossen.
v | auswendig lernen | er lernt auswendig, hat auswendig gelernt | kívülről megtanul | to learn by heart | Ich lerne die Wörter auswendig.
v | zusammenfassen | er fasst zusammen, hat zusammengefasst | összefoglal | to summarise | Fassen Sie den Text zusammen.
v | sich verbessern | er verbessert sich, hat sich verbessert | javul | to improve | Mein Deutsch hat sich verbessert.
a | streng | | szigorú | strict | Unser Lehrer war sehr streng.
a | begabt | | tehetséges | talented | Das Kind ist sehr begabt.
a | theoretisch | | elméleti | theoretical | Der Kurs ist sehr theoretisch.
`),

  theme("b1-medicine", "B1", 6, { hu: "Egészségügy és orvoslás", en: "Healthcare and medicine" }, `
n | die Gesundheit | – | egészség | health | Gesundheit ist das Wichtigste.
n | das Symptom | Symptome | tünet | symptom | Welche Symptome haben Sie?
n | die Diagnose | Diagnosen | diagnózis | diagnosis | Die Diagnose ist noch nicht klar.
n | die Behandlung | Behandlungen | kezelés | treatment | Die Behandlung dauert drei Wochen.
n | die Therapie | Therapien | terápia | therapy | Die Therapie hilft ihm sehr.
n | die Operation | Operationen | műtét | operation | Die Operation ist gut verlaufen.
n | die Untersuchung | Untersuchungen | vizsgálat | examination | Die Untersuchung tut nicht weh.
n | die Impfung | Impfungen | védőoltás | vaccination | Brauche ich eine Impfung?
n | die Nebenwirkung | Nebenwirkungen | mellékhatás | side effect | Das Medikament hat kaum Nebenwirkungen.
n | die Dosis | Dosen | adag (gyógyszer) | dose | Nehmen Sie nicht mehr als die angegebene Dosis.
n | der Blutdruck | – | vérnyomás | blood pressure | Ihr Blutdruck ist zu hoch.
n | das Blut | – | vér | blood | Der Arzt nimmt mir Blut ab.
n | der Facharzt / die Fachärztin | Fachärzte / Fachärztinnen | szakorvos | specialist | Sie müssen zum Facharzt.
n | die Notaufnahme | Notaufnahmen | sürgősségi osztály | A&E, emergency room | Wir sind sofort in die Notaufnahme gefahren.
n | der Patient / die Patientin | Patienten / Patientinnen | beteg, páciens | patient | Der Patient muss im Bett bleiben.
n | die Pflege | – | ápolás, gondozás | care, nursing | Meine Oma braucht Pflege.
v | behandeln | | kezel | to treat | Der Arzt behandelt den Patienten.
v | operieren | | megoperál | to operate | Er muss am Knie operiert werden.
v | impfen | | beolt | to vaccinate | Die Kinder werden gegen Masern geimpft.
v | pflegen | | ápol, gondoz | to care for | Sie pflegt ihre kranke Mutter.
v | verschreiben | er verschreibt, hat verschrieben | felír (gyógyszert) | to prescribe | Der Arzt hat mir Tabletten verschrieben.
v | atmen | | lélegzik | to breathe | Atmen Sie tief ein.
v | bluten | | vérzik | to bleed | Die Wunde blutet.
a | chronisch | | krónikus | chronic | Sie hat eine chronische Krankheit.
a | ansteckend | | fertőző | contagious | Ist die Krankheit ansteckend?
a | verletzt | | sérült | injured | Bei dem Unfall wurde niemand verletzt.
a | bewusstlos | | eszméletlen | unconscious | Der Mann ist bewusstlos.
`),

  theme("b1-lifestyle", "B1", 7, { hu: "Életmód és táplálkozás", en: "Lifestyle and nutrition" }, `
n | die Ernährung | – | táplálkozás | nutrition, diet | Eine gesunde Ernährung ist wichtig.
n | die Diät | Diäten | diéta, fogyókúra | diet | Ich mache gerade eine Diät.
n | das Gewicht | – | súly | weight | Ich möchte mein Gewicht halten.
n | die Kalorie | Kalorien | kalória | calorie | Schokolade hat viele Kalorien.
n | das Vitamin | Vitamine | vitamin | vitamin | Obst hat viele Vitamine.
n | die Bewegung | – | mozgás | exercise, movement | Bewegung ist gut für die Gesundheit.
n | der Lebensstil | Lebensstile | életmód | lifestyle | Er hat einen gesunden Lebensstil.
n | die Gewohnheit | Gewohnheiten | szokás | habit | Rauchen ist eine schlechte Gewohnheit.
n | der Alkohol | – | alkohol | alcohol | Ich trinke keinen Alkohol.
n | die Zigarette | Zigaretten | cigaretta | cigarette | Er raucht zehn Zigaretten am Tag.
n | die Sucht | Süchte | függőség | addiction | Spielsucht ist eine Krankheit.
n | der Schlaf | – | alvás | sleep | Ich brauche acht Stunden Schlaf.
n | die Entspannung | – | kikapcsolódás, ellazulás | relaxation | Yoga ist gut zur Entspannung.
n | das Gleichgewicht | – | egyensúly | balance | Arbeit und Freizeit sollten im Gleichgewicht sein.
n | das Bio-Produkt | Bio-Produkte | bioprodukt | organic product | Ich kaufe gern Bio-Produkte.
n | das Fett | Fette | zsír | fat | Das Essen hat zu viel Fett.
v | abnehmen | er nimmt ab, hat abgenommen | fogy | to lose weight | Ich habe drei Kilo abgenommen.
v | zunehmen | er nimmt zu, hat zugenommen | hízik | to put on weight | Im Urlaub habe ich zugenommen.
v | sich ernähren | er ernährt sich, hat sich ernährt | táplálkozik | to eat (a diet) | Sie ernährt sich vegetarisch.
v | sich bewegen | er bewegt sich, hat sich bewegt | mozog | to move, to exercise | Du solltest dich mehr bewegen.
v | verzichten auf | er verzichtet, hat verzichtet | lemond vmiről | to do without | Ich verzichte auf Zucker.
a | fettig | | zsíros | greasy | Das Essen ist zu fettig.
a | ausgewogen | | kiegyensúlyozott | balanced | Eine ausgewogene Ernährung ist gesund.
a | süchtig | | függő | addicted | Er ist süchtig nach seinem Handy.
a | aktiv | | aktív | active | Meine Oma ist noch sehr aktiv.
a | ungesund | | egészségtelen | unhealthy | Fast Food ist ungesund.
`),

  theme("b1-neighbourhood", "B1", 8, { hu: "Lakókörnyezet és szomszédság", en: "Neighbourhood and home" }, `
n | die Wohngemeinschaft | Wohngemeinschaften | közös albérlet | shared flat | Ich wohne in einer Wohngemeinschaft.
n | der Mitbewohner / die Mitbewohnerin | Mitbewohner / Mitbewohnerinnen | lakótárs | flatmate | Meine Mitbewohnerin studiert Medizin.
n | das Eigentum | – | tulajdon | property | Die Wohnung ist mein Eigentum.
n | die Eigentumswohnung | Eigentumswohnungen | saját tulajdonú lakás | owner-occupied flat | Sie haben eine Eigentumswohnung gekauft.
n | die Lage | Lagen | fekvés, elhelyezkedés | location | Die Wohnung hat eine gute Lage.
n | die Umgebung | Umgebungen | környezet, környék | surroundings | In der Umgebung gibt es viele Geschäfte.
n | der Vorort | Vororte | külváros | suburb | Wir wohnen in einem Vorort von Wien.
n | die Ruhe | – | csend, nyugalom | quiet, peace | Ab 22 Uhr ist Ruhe im Haus.
n | der Lärm | – | zaj | noise | Der Lärm von der Straße stört mich.
n | der Streit | Streitigkeiten | vita, veszekedés | argument, dispute | Es gab Streit mit dem Nachbarn.
n | die Renovierung | Renovierungen | felújítás | renovation | Die Renovierung dauert zwei Monate.
n | das Treppenhaus | Treppenhäuser | lépcsőház | stairwell | Im Treppenhaus ist es dunkel.
n | der Briefkasten | Briefkästen | postaláda | letterbox | Ist Post im Briefkasten?
n | die Klingel | Klingeln | csengő | doorbell | Die Klingel ist kaputt.
n | der Umzug | Umzüge | költözés | move (house) | Der Umzug war sehr anstrengend.
v | renovieren | | felújít | to renovate | Wir renovieren die Küche.
v | streichen | er streicht, hat gestrichen | befest, kifest | to paint | Wir streichen die Wände weiß.
v | stören | | zavar | to disturb | Die laute Musik stört mich.
v | einrichten | er richtet ein, hat eingerichtet | berendez | to furnish | Wir richten das Wohnzimmer neu ein.
v | teilen | | megoszt | to share | Wir teilen uns die Küche.
a | zentral | | központi | central | Die Wohnung liegt sehr zentral.
a | renoviert | | felújított | renovated | Das Bad ist frisch renoviert.
a | geräumig | | tágas | spacious | Die Wohnung ist hell und geräumig.
a | ruhestörend | | csendháborító | disturbing the peace | Ruhestörender Lärm ist verboten.
a | anstrengend | | fárasztó | tiring, exhausting | Der Umzug war anstrengend.
`),

  theme("b1-consumption", "B1", 9, { hu: "Fogyasztás és pénzügyek", en: "Consumption and finances" }, `
n | der Verbraucher / die Verbraucherin | Verbraucher / Verbraucherinnen | fogyasztó | consumer | Die Verbraucher zahlen mehr für Energie.
n | der Konsum | – | fogyasztás | consumption | Der Konsum steigt jedes Jahr.
n | das Einkommen | Einkommen | jövedelem | income | Sein Einkommen ist sehr niedrig.
n | die Ausgabe | Ausgaben | kiadás | expense | Wir müssen unsere Ausgaben senken.
n | die Einnahme | Einnahmen | bevétel | income, takings | Die Einnahmen sind gestiegen.
n | das Budget | Budgets | költségvetés | budget | Unser Budget ist begrenzt.
n | die Schulden | – | adósság | debts | Er hat viele Schulden.
n | die Rate | Raten | részlet | instalment | Ich zahle das Auto in Raten.
n | das Abonnement | Abonnements | előfizetés | subscription | Ich habe das Abonnement gekündigt.
n | die Mahnung | Mahnungen | fizetési felszólítás | reminder (payment) | Ich habe eine Mahnung bekommen.
n | der Umtausch | – | csere (áru) | exchange | Ein Umtausch ist nur mit Kassenbon möglich.
n | die Werbeaktion | Werbeaktionen | reklámakció | promotion | Bei der Werbeaktion gibt es Gratisproben.
n | der Kostenvoranschlag | Kostenvoranschläge | költségbecslés | cost estimate | Der Handwerker macht einen Kostenvoranschlag.
v | sich leisten | er leistet sich, hat sich geleistet | megengedheti magának | to afford | Das kann ich mir nicht leisten.
v | verschwenden | | pazarol | to waste | Verschwende kein Geld!
v | sich lohnen | es lohnt sich, hat sich gelohnt | megéri | to be worth it | Der Kauf hat sich gelohnt.
v | finanzieren | | finanszíroz | to finance | Wie finanzierst du dein Studium?
v | schulden | | tartozik | to owe | Du schuldest mir noch 20 Euro.
a | sparsam | | takarékos | thrifty | Meine Eltern sind sehr sparsam.
a | finanziell | | pénzügyi | financial | Er hat finanzielle Probleme.
a | gratis | | ingyen | free (of charge) | Der Eintritt ist gratis.
a | überteuert | | túlárazott | overpriced | Die Getränke hier sind total überteuert.
a | monatlich | | havi, havonta | monthly | Die monatlichen Kosten sind hoch.
`),

  theme("b1-mobility", "B1", 10, { hu: "Utazás és mobilitás", en: "Travel and mobility" }, `
n | die Mobilität | – | mobilitás | mobility | Mobilität ist heute sehr wichtig.
n | das Verkehrsmittel | Verkehrsmittel | közlekedési eszköz | means of transport | Welches Verkehrsmittel nimmst du?
n | der öffentliche Verkehr | – | tömegközlekedés | public transport | Ich fahre mit dem öffentlichen Verkehr.
n | der Pendler / die Pendlerin | Pendler / Pendlerinnen | ingázó | commuter | Viele Pendler fahren jeden Tag nach München.
n | die Fahrt | Fahrten | út, utazás (járművel) | journey, ride | Die Fahrt dauert zwei Stunden.
n | der Aufenthalt | Aufenthalte | tartózkodás | stay | Wir wünschen Ihnen einen schönen Aufenthalt.
n | die Rundreise | Rundreisen | körutazás | tour | Wir machen eine Rundreise durch Italien.
n | die Pauschalreise | Pauschalreisen | csomagút | package holiday | Wir haben eine Pauschalreise gebucht.
n | die Stornierung | Stornierungen | lemondás (foglalásé) | cancellation | Die Stornierung ist kostenlos.
n | der Zoll | Zölle | vám | customs | Am Zoll müssen wir den Koffer öffnen.
n | die Sicherheitskontrolle | Sicherheitskontrollen | biztonsági ellenőrzés | security check | Die Sicherheitskontrolle dauert lange.
n | der Anschluss | Anschlüsse | csatlakozás | connection | Ich habe meinen Anschluss verpasst.
n | der Fahrradweg | Fahrradwege | kerékpárút | cycle path | In der Stadt gibt es viele Fahrradwege.
n | das Carsharing | – | autómegosztás | car sharing | Ich nutze Carsharing statt eines eigenen Autos.
n | die Ermäßigung | Ermäßigungen | kedvezmény | reduction | Studenten bekommen eine Ermäßigung.
v | pendeln | | ingázik | to commute | Ich pendle jeden Tag nach Wien.
v | stornieren | | lemond (foglalást) | to cancel | Ich möchte die Reise stornieren.
v | sich verspäten | er verspätet sich, hat sich verspätet | késik | to be late | Der Zug hat sich verspätet.
v | landen | er landet, ist gelandet | leszáll | to land | Das Flugzeug landet um 14 Uhr.
v | starten | er startet, ist gestartet | felszáll; indul | to take off; to start | Das Flugzeug startet pünktlich.
v | nutzen | | használ, igénybe vesz | to use | Ich nutze das Fahrrad für den Weg zur Arbeit.
v | sich orientieren | er orientiert sich, hat sich orientiert | tájékozódik | to find one's way | In einer neuen Stadt kann ich mich schlecht orientieren.
a | öffentlich | | nyilvános, köz- | public | Öffentliche Verkehrsmittel sind günstig.
a | umweltfreundlich | | környezetbarát | environmentally friendly | Das Fahrrad ist umweltfreundlich.
a | verspätet | | késve, késéssel | delayed | Der Flug ist verspätet.
a | barrierefrei | | akadálymentes | step-free, accessible | Der Bahnhof ist barrierefrei.
`),
];
