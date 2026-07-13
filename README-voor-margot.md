# Jouw gratis webtools — handleiding

Hoi Margot! In deze map staan zes webpagina's die samen jouw gratis toolsuite vormen. Alles werkt op de telefoon (waar jouw Instagram-volgers vandaan komen), er hoeft niets gedownload te worden, en er zijn **geen maandkosten**: de tools zijn kant-en-klare bestanden zonder abonnementen, zonder cookies en zonder tracking.

## Wat zit erin?

| Bestand | Wat het doet |
|---|---|
| `index.html` | Overzichtspagina met alle vijf de tools |
| `50-30-20-rekentool.html` | De webversie van je Excel: inkomen verdelen over Nodig / Toekomst / Leuk |
| `geldlek-scanner.html` | Maandbedragen invullen → zien wat dat "lek" waard kan worden als je het belegt |
| `beleggen-voor-je-kind.html` | Wat kan er voor een kind klaarstaan op de 18e verjaardag |
| `sparen-vs-beleggen.html` | Sparen vergeleken met beleggen, mét het effect van inflatie |
| `wat-kost-wachten.html` | Wat kost het om 1, 3 of 5 jaar te wachten met beleggen |
| `cursus-starten-met-beleggen.html` | Strakke herbouw van je verkooppagina, met je bestaande Podia-koopknop |

Elke tool heeft een deelknop ("Kopieer mijn resultaat"), een link naar je Excel-download en een knop naar je cursus *Starten met beleggen*.

## Zo zet je een tool op je Podia-site

Podia kan zelf geen losse bestanden hosten, dus het gaat in twee stapjes: eerst zet je de bestanden gratis online, daarna plak je een klein stukje code in Podia.

### Stap 1 — Zet de bestanden gratis online (eenmalig, ± 2 minuten)

**Optie A — GitHub Pages (aanrader: de bestanden staan al op GitHub):**

1. Ga naar de repository op GitHub → **Settings** → **Pages**.
2. Kies bij "Build and deployment" → Source: **Deploy from a branch** → Branch: **main** / **(root)** → **Save**.
3. Na een minuutje staat alles live op `https://xavier2235.github.io/Margotbelegt/`. Elke tool heeft een eigen link, bijvoorbeeld `https://xavier2235.github.io/Margotbelegt/geldlek-scanner.html`.

Aanpassingen die naar GitHub worden gepusht staan daarna automatisch live — je hoeft niets opnieuw te uploaden.

**Optie B — Netlify (als je liever sleept):**

1. Ga naar [app.netlify.com/drop](https://app.netlify.com/drop) en maak een gratis account.
2. Sleep deze hele map (`margotbelegt-tools`) in het venster — je krijgt een adres zoals `https://jouwnaam.netlify.app`.

### Stap 2 — Plak de tool in een Podia-pagina

1. Open in Podia de pagina waar de tool moet komen en voeg een **Embed / eigen code**-blok toe (het blok waar je HTML in mag plakken).
2. Plak dit erin, met jouw eigen Netlify-adres:

```html
<iframe src="https://xavier2235.github.io/Margotbelegt/geldlek-scanner.html"
        style="width:100%;border:none;border-radius:20px;"
        height="2000"
        title="Geldlek-scanner — gratis tool van Margot Belegt"></iframe>
```

3. Het getal bij `height` bepaalt hoe hoog het venster is. Goede startwaarden (check even op je telefoon en maak het getal groter als de onderkant wegvalt):

| Tool | height |
|---|---|
| 50-30-20-rekentool | `3400` |
| geldlek-scanner | `2100` |
| beleggen-voor-je-kind | `1900` |
| sparen-vs-beleggen | `2200` |
| wat-kost-wachten | `1900` |

Je kunt ook gewoon rechtstreeks naar de link verwijzen vanuit je Instagram-bio of link-in-bio — de tools zijn volwaardige mobiele pagina's, met een nette voorvertoning als iemand de link deelt via WhatsApp of Instagram-DM.

## Zelf teksten, bedragen of categorieën aanpassen

Dat kan zonder programmeerkennis:

1. Open het bestand in een tekstbewerker (op een Mac: klik met rechts → Open met → **Teksteditor**; op Windows: **Kladblok**).
2. Zoek (Cmd+F / Ctrl+F) naar het woord **INSTELLINGEN**. Daar staat een duidelijk gemarkeerd blok, bijvoorbeeld:
   - de **categorieën** (gewoon tekstjes tussen aanhalingstekens — je kunt er toevoegen of weghalen),
   - de **richtlijn-percentages** (50/20/30),
   - de **standaardwaarden** voor rendement en looptijd.
3. Pas aan wat je wilt, sla op, en zet het bestand opnieuw online (push naar GitHub, of sleep de map opnieuw in Netlify).

Gewone teksten (koppen, uitlegblokken, de "Wist je dat"-tip) staan als leesbare zinnen in het bestand — die kun je met zoeken-en-vervangen aanpassen. **Tip:** verander niets aan tekst die tussen `<` en `>` staat; dat is de "verpakking".

## Goed om te weten

- **Alles is en blijft gratis** voor jou én je volgers: geen hosting-abonnement nodig (Netlify gratis is ruim voldoende voor dit soort pagina's).
- **Privacy:** de tools slaan niets op en versturen niets; alles wordt op de telefoon van de bezoeker zelf uitgerekend. Het enige externe verzoek is het lettertype (Google Fonts).
- **Disclaimer:** onderaan elke tool staat een vaste educatieve disclaimer en overal is het rendement een instelbare aanname — er worden nergens producten of brokers genoemd.
- **De kleuren** zijn jouw merkkleuren en staan bovenin elk bestand bij elkaar (zoek naar `--paarsrood`), dus een kleurwijziging is één plek aanpassen.

Veel plezier ermee! 💸✨
