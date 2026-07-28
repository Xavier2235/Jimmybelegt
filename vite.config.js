import { defineConfig } from 'vite';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, p);

// Elke sleutel bepaalt het pad van het gebouwde bestand in /dist (dus ook de
// live URL, bijv. sleutel "rekentools/box-3" → /rekentools/box-3.html).
// Let op: Vite plaatst de HTML-output zelf op basis van het bronpad
// (dist/src/pages/...), niet op deze sleutel. scripts/fix-dist-paths.mjs
// verplaatst de bestanden ná de build naar hun uiteindelijke, schone plek —
// zie dat bestand en de "postbuild"-regel in package.json voor de reden
// waarom dit als losse CLI-stap gebeurt en niet als Vite/Rollup-plugin-hook.
const paginas = {
  main: r('index.html'),
  rekentools: r('src/pages/rekentools.html'),
  'rekentools/wat-had-je-nu-gehad': r('src/pages/rekentools/wat-had-je-nu-gehad.html'),
  'rekentools/box-3': r('src/pages/rekentools/box-3.html'),
  'rekentools/inflatie': r('src/pages/rekentools/inflatie.html'),
  'rekentools/pensioengat': r('src/pages/rekentools/pensioengat.html'),
  'rekentools/positiegrootte': r('src/pages/rekentools/positiegrootte.html'),
  'rekentools/kosten': r('src/pages/rekentools/kosten.html'),
  quiz: r('src/pages/quiz.html'),
  cursus: r('src/pages/cursus.html'),
  coaching: r('src/pages/coaching.html'),
  'coaching/aanvraag': r('src/pages/coaching/aanvraag.html'),
  over: r('src/pages/over.html'),
  transparantie: r('src/pages/transparantie.html'),
  voorwaarden: r('src/pages/voorwaarden.html'),
  'checkout-demo': r('src/pages/checkout-demo.html'),
  bedankt: r('src/pages/bedankt.html'),
  bevestig: r('src/pages/bevestig.html'),
  404: r('src/pages/404.html'),
};

// Dev-server-plugin: rewrit schone URL's (/rekentools/box-3) naar hun
// werkelijke bronbestand, zodat `npm run dev` dezelfde padstructuur toont
// als de productie-build. Dit is request-middleware (geen build-hook), dus
// niet gevoelig voor de timing-problematiek die de build-kant wel had.
function schoneUrlsInDev() {
  const lookup = new Map();
  for (const [naam, absPad] of Object.entries(paginas)) {
    if (naam === 'main' || naam === '404') continue;
    lookup.set(`/${naam}`, `/${absPad.slice(__dirname.length + 1).split(sep).join('/')}`);
  }
  return {
    name: 'schone-urls-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pad] = req.url.split('?');
        const doel = lookup.get(pad);
        if (doel) req.url = doel + (req.url.slice(pad.length) || '');
        next();
      });
    },
  };
}

export default defineConfig({
  // Deze repo serveert via GitHub Pages op xavier2235.github.io/Jimmybelegt/
  // — een submap, geen domeinroot. Vite prefixt hiermee automatisch alle
  // eigen gebouwde asset-referenties (JS/CSS-bundels, favicon, og-beeld).
  base: '/Jimmybelegt/',
  plugins: [schoneUrlsInDev()],
  build: {
    rollupOptions: { input: paginas },
  },
});
