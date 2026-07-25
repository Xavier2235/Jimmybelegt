# Beleg Slim met Jim — dummy-website

Dit is een **dummy/mockup**: een complete mini-website (landingspagina + vijf gratis rekentools + een cursuspagina) voor een fictief merk genaamd **"Beleg Slim met Jim"**, gebouwd als demonstratie van wat het toolformat kan doen — geïnspireerd op het Instagram-account [@belegslim.metjim](https://www.instagram.com/belegslim.metjim/).

**Dit is géén live product.** Er is geen echt bedrijf, geen echte cursus en geen echte checkout achter deze site. Alles wat hieronder als "voorbeeldtekst" of "placeholder" gemarkeerd staat, moet vervangen worden voordat dit ooit publiek de deur uit gaat namens de echte Jim.

## Wat zit erin?

| Bestand | Wat het doet |
|---|---|
| `index.html` | De homepage: hero met geldlek-barometer, "Waarom beleggen?", alle tools en het (voorbeeld)verhaal van Jim |
| `50-30-20-rekentool.html` | Inkomen verdelen over Nodig / Toekomst / Leuk, met schuifjes en uitklapbare categorieën |
| `geldlek-scanner.html` | Maandbedragen invullen → zien wat dat "lek" waard kan worden als je het belegt |
| `beleggen-voor-je-kind.html` | Wat kan er voor een kind klaarstaan op de 18e verjaardag |
| `sparen-vs-beleggen.html` | Sparen vergeleken met beleggen, mét het effect van inflatie |
| `wat-kost-wachten.html` | Wat kost het om 1, 3 of 5 jaar te wachten met beleggen |
| `cursus-starten-met-beleggen.html` | Voorbeeld-verkooppagina voor een cursus (nog geen echt product) |

## Wat is er al gevalideerd en klopt?

- **Alle rekenformules** zijn hetzelfde als in het geverifieerde origineel (samengestelde groei, annuïteit-FV, inflatiecorrectie) — die zijn los van het merk en kloppen gewoon.
- **De kleuren** (smaragdgroen `#067A5E`, koraal `#D9542A`, goud `#C79A22` op een warme papieren achtergrond `#F3EFE6`) zijn met een validator gecheckt op contrast en kleurenblindveiligheid — vervang ze gerust, maar test nieuwe kleuren met dezelfde discipline.
- **Techniek**: één zelfstandig HTML-bestand per pagina, mobiel-first, geen tracking, geen dependencies buiten Google Fonts.

## Wat is nog placeholder en moet je vervangen?

Zoek in de bestanden op **"[Voorbeeldtekst]"**, **"(voorbeeld)"** en **TODO** om alles te vinden dat nog echte content nodig heeft:

- **Jims verhaal** (Over-sectie op de homepage + het quote-blok op de cursuspagina) — nu generieke placeholder-tekst, geen echt biografisch verhaal.
- **Foto** — er is bewust géén foto gebruikt (die zou een echt persoon moeten voorstellen, en die hadden we niet). In plaats daarvan staat er een simpel "J"-avatar-icoon. Vervang dat door een echte foto zodra die er is.
- **Volgersaantal, cursusprijs, lessenaantal** — allemaal ronde voorbeeldgetallen, geen echte cijfers.
- **Reviews/testimonials** op de cursuspagina — volledig verzonnen placeholders ("Voorbeeldnaam 1/2/3"), *niet* gebaseerd op echte klanten. Vervang door echte testimonials zodra die bestaan.
- **De "Ja, ik start vandaag"-koopknoppen** linken nergens naartoe (`href="#"`) — er is geen echte checkout. Zodra er een cursus + betaalpagina is, die link invullen.
- **Instagram-link** is wél echt: die verwijst naar [@belegslim.metjim](https://www.instagram.com/belegslim.metjim/).
- **Algemene voorwaarden / privacybeleid** in de footer zijn `#`-placeholders — die moeten naar echte pagina's zodra die bestaan (verplicht voordat je hier echt geld mee vraagt).
- **Excel-downloadlink** die in het origineel stond is verwijderd — die verwees naar een bestaand product van iemand anders. Als Jim een eigen weggever krijgt, kan die hier terugkomen.

## Hoe staat dit online?

Deze repository had al GitHub Pages aanstaan (van een eerder project) — die koppeling is intact gebleven, dus deze site staat automatisch live op:

**https://xavier2235.github.io/Margotbelegt/**

Elke push naar de `main`-branch verschijnt binnen ongeveer een minuut live, zonder verdere configuratie.

## Zelf teksten of bedragen aanpassen

Open een bestand in een tekstbewerker en zoek naar **INSTELLINGEN** — daar staan de categorieën, standaardwaarden en schuifbereiken duidelijk gemarkeerd. De rest van de pagina bestaat uit gewone leesbare HTML; verander geen tekst tussen `<` en `>`, dat is de "verpakking".
