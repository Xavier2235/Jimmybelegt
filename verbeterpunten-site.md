# Verbeterpunten margotbelegt.nl

Checklist van punten die tijdens het bouwen van de tools en de audit van de verkooppagina opvielen. Allemaal behapbaar, maar samen tillen ze de professionele indruk flink op.

> 💡 Voor de cursuspagina staat een complete, strakke herbouw klaar in deze map: `cursus-starten-met-beleggen.html` — zelfde content, alle onderstaande punten al verwerkt, in de merkstijl van de tools. Direct te hosten (GitHub Pages/Netlify) met de bestaande Podia-checkout als koopknop.

## Vormgeving & consistentie (verkooppagina + site-breed)

- [ ] **Kleurpalet is versnipperd**: petrol/donkerblauwe header, donkergroene knoppen ("Kopen", "LIVE NOW!"-vlak), felle zalm-vlakken en beige secties door elkaar. Kies één vast palet (beige `#FFF2E5`, paarsrood `#B20059`, groen `#CCD8B9`, zalm `#FFAB91`, geel `#FFD374`, inkt `#2D2A26` — zoals in de tools) en pas dat overal toe, ook op knoppen.
- [ ] **Typografie wisselt per sectie**: de cursuspagina gebruikt een serif-letter voor lopende tekst, andere pagina's een sans-serif. Overal dezelfde combinatie aanhouden (bijv. Poppins voor koppen + één schreefloze bodyletter).
- [ ] **"LIVE NOW!"-banner** op de rekentoolpagina: Engels én in een afwijkend donkergroen vlak. Vervangen door Nederlands ("Nieuw!") in een merkkleur — of weglaten nu de tool live is.
- [ ] **Kop "Rekentool 50/ 30/ 20 regel"**: losse spaties na de schuine strepen; strakker als "Rekentool 50/30/20-regel".
- [ ] **Reviews-sectie** staat op een donkerblauw vlak met kleine witte kaartjes en mini-lettertjes — oogt onrustig en leest slecht. Op licht vlak zetten met grotere kaarten (zie de herbouw voor een voorbeeld).
- [ ] **Menu staat dubbel in de pagina** (mobiele en desktopversie worden allebei geladen). Waarschijnlijk een Podia-thema-instelling; checken en één versie tonen.

## Cursusaantallen & naamgeving (verkooppagina)

- [ ] **De telling klopt nergens met elkaar**: kop zegt "in 5 uur tijd", productinfo "10 lessen", de FAQ "vijf modules", en het cursusoverzicht toont 6 modules + intro + 3 bonussen. Eén telling kiezen en overal doorvoeren — voorstel: **"10 lessen (intro + 6 modules + 3 bonussen) · ± 5 uur"**.
- [ ] **FAQ noemt "de cursus Mom Invest"** — de oude naam. Vervangen door *Starten met beleggen*.
- [ ] **Jessica's review linkt naar `podia.com`** (de generieke Podia-homepage) in plaats van naar de coachingpagina.

## Compliance (belangrijk, verkooppagina)

- [ ] **Claim "…groeit het bij andere vrouwen met 7–10% per jaar!"** leest als een belofte. Herformuleren naar een historisch gemiddelde mét voorbehoud, bijv.: *"wereldwijd gespreid beleggen groeide historisch met gemiddeld zo'n 7% per jaar — geen garantie voor de toekomst."*
- [ ] **Screenshots met broker-namen en rendementen** ("BUX · rendement 31,9%", "Evi van Landschot: passief beleggen 9,63%") suggereren te behalen resultaten en noemen concrete aanbieders. Risicovol als reclame-uiting; vervangen door neutrale visuals (bijv. de grafiek uit de tool Sparen vs. beleggen).
- [ ] **Disclaimer ontbreekt op de verkooppagina.** Het vaste blok uit de tools ("…geen financieel of beleggingsadvies…") ook daar in de footer opnemen.

## Teksten & typo's

- [ ] **2× "Cursus Staren met beleggen"** — typo ("Staren" i.p.v. "Starten") in de reviews/testimonials. Even zoeken op "Staren" en corrigeren.
- [ ] **FAQ verwijst naar "Mom Invest" met "vijf modules"**, terwijl de cursus inmiddels *Starten met beleggen* heet en uit **10 lessen** bestaat. FAQ-antwoord actualiseren.
- [ ] **Afgekapt e-mailadres in de FAQ**: er staat "margot_bele" — het volledige e-mailadres tonen (of er een klikbare mailto-link van maken).
- [ ] **Volgersaantal inconsistent**: homepage zegt **17k**, de rekentoolpagina **15,6k**. Eén getal aanhouden (of afronden naar "17k+") en op één plek beheren.

## Links & URL's

- [ ] **URL "1-1-inspratiesessie"** — typo in de URL zelf ("inspratie" i.p.v. "inspiratie"). Nieuwe nette URL aanmaken en de oude laten doorverwijzen, zodat bestaande links blijven werken.
- [ ] **Podcast-URL is een UUID-slug** (lange reeks letters/cijfers). Vervangen door een leesbare slug zoals `/podcast`, goed voor delen én vindbaarheid.

## Prijzen & aanbod

- [ ] **Cursusprijs inconsistent**: in de Excel-rekentool staat **€39**, op de site **€37**. Eén prijs aanhouden en de Excel bijwerken (of andersom).

## Conversie

- [ ] **Kids-wachtlijst loopt via een mailto-link** in plaats van een echt inschrijfformulier. Vervangen door een opt-in (bijv. een Podia-formulier of nieuwsbrieflijst), anders gaan aanmeldingen verloren en bouw je geen lijst op.

## Suggestie (geen fout)

- [ ] De nieuwe webtools uit deze map als vaste plek opnemen in de link-in-bio en op de site — ze geven direct waarde vóór de e-mailmuur en leiden warm door naar de Excel-download en de cursus.
