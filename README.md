# Beleg Slim met Jim — demo-website

Een volledig klikbare **DEMO**-website: vijf gratis rekentools, een cursus-salespagina, coaching-intake en de bijbehorende juridische/transparantiepagina's. Gebouwd als **verkoopdemo** — er is geen echt bedrijf, geen echte betaling en geen echte e-mailverzending achter deze site.

De codebase is vanaf dag 1 **white-label**: kleuren, fonts en teksten komen uit één mapje per merk, niet uit de HTML/CSS/JS-componenten zelf.

## Installatie

```bash
npm install
npm run dev       # ontwikkelserver op http://localhost:5173
npm run build     # statische build naar /dist
npm run preview   # serveert de /dist-build lokaal, exact zoals op Vercel
```

**Let op het verschil tussen `dev` en `preview`:** tijdens `npm run dev` draait een kleine plugin (`schoneUrlsInDev` in `vite.config.js`) die schone URL's zoals `/rekentools/box-3` naar het juiste bronbestand doorstuurt, zodat navigeren identiek aanvoelt aan productie. Wil je de site zien zoals hij écht op Vercel staat (inclusief de daadwerkelijke bestandsstructuur in `/dist`), gebruik dan `npm run build && npm run preview`.

## Mapstructuur

```
/
├─ index.html                  Landingspagina (Vite-entry op de root)
├─ vite.config.js              Multi-page build + schone-URL-plugins (dev én build)
├─ /public
│   ├─ favicon.svg
│   └─ /img                    Donkere placeholder-SVG's — geen stockfoto's, geen portretten
├─ /src
│   ├─ /brands
│   │   ├─ /_template          Leeg, gedocumenteerd voorbeeldmerk — kopieer dit voor een nieuw merk
│   │   └─ /jim                Actieve merk: kleuren (tokens.css) + teksten/prijzen (brand.json)
│   ├─ /css                    reset.css, base.css, components.css — allemaal token-gedreven
│   ├─ /js
│   │   ├─ main.js             Brand-injectie, navigatie, DEMO-balk-init — wordt op élke pagina geladen
│   │   ├─ format.js           Nederlandse getalnotatie (€ 1.234,56)
│   │   ├─ /components         Herbruikbare bouwstenen: demobar, disclaimer, sourceInfo, gate,
│   │   │                      accordion, rangeInput, chart (SVG), shareLink, multiStepForm
│   │   ├─ /tools               Rekenkern per tool (zuivere functies + DOM-koppeling)
│   │   └─ /pages               Kleine bootstrap-scripts per pagina (roepen de tools/componenten aan)
│   ├─ /data
│   │   ├─ params-box3-2026.json   Échte 2026-parameters, met bron + status per veld
│   │   └─ demo-series.json        FICTIEVE rendementsreeksen — zie waarschuwing in het bestand zelf
│   └─ /pages                   Alle .html-bronbestanden (Vite-entries, zie vite.config.js)
└─ README.md
```

> **`/src/js/pages/` en `/src/js/format.js` staan niet letterlijk in de oorspronkelijke opdracht-structuur.**
> Ik heb ze toegevoegd omdat losse pagina's (landing, rekentools-hub, coaching-aanvraag, voorwaarden-tabs, checkout-demo) een eigen klein stukje bootstrap-JS nodig hadden, en de Nederlandse getalnotatie op elke pagina terugkomt. Functioneel horen ze bij de "componenten"-laag; ik heb ze niet in `/components` gestopt omdat ze page-specifiek zijn, geen herbruikbare bouwsteen.

## Nieuw merk toevoegen in 4 stappen

1. **Kopieer** `/src/brands/_template/` naar `/src/brands/<merknaam>/`.
2. **Vul** `tokens.css` (kleuren, fonts, schaal) en `brand.json` (naam, teksten, prijzen) in — de comments in `_template/tokens.css` leggen elke variabele uit, inclusief de verplichte contrast-check.
3. **Wijzig** in `src/js/main.js` de twee importregels boven­aan naar de nieuwe merkmap:
   ```js
   import '../brands/<merknaam>/tokens.css';
   import brandDataRaw from '../brands/<merknaam>/brand.json';
   ```
4. **Draai** `npm run build` — klaar. Geen andere bestanden hoeven aangepast te worden: alle HTML/CSS/JS verwijst naar CSS-variabelen en `data-brand`-attributen, nooit naar een hardcoded merknaam, kleur of font.

## Wat is er al gevalideerd?

- **Kleurenpalet** (donker `#0B0B0D` + goud `#E0A93B` + koraal `#D9542A`) is gecheckt op WCAG AA-contrast en kleurenblindveiligheid (Machado-simulatie) vóór gebruik — alle categorische kleurparen halen de norm; waar goud een grens­geval was (het is een vast merkkleur, iets lichter dan het ideale donkere-modus-bereik) staan altijd directe tekstlabels erbij, nooit kleur als enige onderscheid.
- **Vier van de zes rekentools zijn met de hand doorgerekend** tegen de live-gerenderde uitkomst en kwamen exact overeen: Box 3 (€178 belasting bij de standaardinvoer), Positiegrootte (€12,50 verwachtingswaarde, 40% break-even-winrate), Wat had je nu gehad (€1.558 mediaan, €3.225 groei bij reeks A) en Pensioengat (€1.300/mnd tekort, €387/mnd benodigde inleg, 27 jaar tot pensioen). Onderweg is hierbij een echte bug gevonden en gefixt (zie "Bekende aannames" hieronder).
- **Alle 18 pagina's** zijn na de build gecontroleerd op dode interne links en ontbrekende assets — geen enkele gevonden.
- **Geen backend, geen externe dependencies** buiten Vite zelf en Google Fonts, zoals gevraagd.

## Wat ik zelf heb ingevuld (aannames — graag nalezen)

De opdracht gaf voor een paar tools iets minder input dan nodig is om de gevraagde uitvoer te berekenen. Ik heb dat opgelost door **nergens een feit te verzinnen**, maar in plaats daarvan expliciet een extra, door de gebruiker instelbare aanname of een in de "Aannames"-accordion benoemde vaste veronderstelling toe te voegen:

- **Box 3** — "als je werkelijk rendement lager was" (tegenbewijs) kan niet berekend worden zonder dat werkelijke rendement. Ik heb er een schuifje "Werkelijk rendement (jouw aanname)" bij gezet.
- **Inflatietool** — er was geen historische CPI-reeks meegeleverd. Het inflatiepercentage is nu een schuifje (standaard 2,5%), geen vaststaand feit.
- **Pensioengat** — er is geen officieel AOW-bedrag gebruikt. De gebruiker vult zelf zijn "al opgebouwd pensioen (incl. AOW)" in, bijvoorbeeld van mijnpensioenoverzicht.nl. Pensioenleeftijd (67) en uitkeerperiode (20 jaar) staan als vaste, met naam genoemde aannames in de accordion, niet verzwegen.
- **Alle 6 tools**: de bandbreedte (laag/midden/hoog) is steeds afgeleid uit de eigen invoer/aannames van de tool (bijv. de drie fictieve reeksen, of ±1 procentpunt rondom een ingestelde rendementsaanname) — nooit een los verzonnen spreidingspercentage.

## Wat je (of een jurist) nog moet aanleveren

Zoek in de bestanden op **`[PLACEHOLDER: ...]`** en **`[JURIDISCHE REVIEW VEREIST]`** om alles te vinden dat nog echte content nodig heeft:

- Alle cursusinhoud (modulenamen, prijzen — nu €297/€159/€109 als voorbeeld — garantietekst, FAQ).
- Coaching-teksten (4 stappen, "niet voor jou als", investeringsbandbreedte).
- Het "Over"-verhaal en het "Mijn belangen"-blok (structuur staat er, tekst is placeholder).
- **Algemene voorwaarden, disclaimer en privacyverklaring** op `/voorwaarden` — dit is bewust met `[JURIDISCHE REVIEW VEREIST]`-markers gelabeld en mag niet ongewijzigd de deur uit.
- De drie vergelijkingscategorieën op de inflatietool (nu lege placeholders, met opzet — ik heb geen prijzen van boodschappen/energie/huur verzonnen).
- Foto's: alle afbeeldingen in `/public/img` zijn abstracte donkere SVG-vlakken met een label (bijv. "[FOTO: portret Jim]"). Vervang ze door echte beelden zodra die er zijn.

## Lighthouse / automatische toetsenbord- en performancetests

Ik heb de site handmatig doorgerekend en gecontroleerd op dode links, console-fouten (via headless Chrome DOM-dumps) en kleurcontrast, maar **kon in deze omgeving geen Lighthouse-rapport draaien** (geen stabiele browserautomatisering beschikbaar). Structureel is er wel op geanticipeerd: semantische HTML, zichtbare focus-states (2px gouden outline overal), labels bij elke input, `prefers-reduced-motion`-vriendelijke transities, en geen enkele kleur die als enige informatiedrager dient. Draai zelf `npx lighthouse http://localhost:4321 --view` na `npm run build && npm run preview` om de exacte score te bevestigen.
