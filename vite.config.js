import { defineConfig } from 'vite';
import { resolve, dirname, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, renameSync, rmSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, p);

// Elke sleutel bepaalt het pad van het gebouwde bestand in /dist (dus ook de
// live URL op Vercel, bijv. sleutel "rekentools/box-3" → /rekentools/box-3.html,
// en Vercel serveert dat automatisch op de schone URL /rekentools/box-3).
const paginas = {
  main: r('index.html'),
  rekentools: r('src/pages/rekentools.html'),
  'rekentools/wat-had-je-nu-gehad': r('src/pages/rekentools/wat-had-je-nu-gehad.html'),
  'rekentools/box-3': r('src/pages/rekentools/box-3.html'),
  'rekentools/inflatie': r('src/pages/rekentools/inflatie.html'),
  'rekentools/pensioengat': r('src/pages/rekentools/pensioengat.html'),
  'rekentools/positiegrootte': r('src/pages/rekentools/positiegrootte.html'),
  'rekentools/kosten': r('src/pages/rekentools/kosten.html'),
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
// als de productie-build op Vercel — geen los "dev-pad" om te onthouden.
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

// Build-plugin: Vite plaatst HTML-outputs op basis van hun bronpad
// (dist/src/pages/...), niet op de rollupOptions.input-sleutel. Deze plugin
// verplaatst elk gebouwd .html-bestand na de build naar de schone,
// gewenste locatie (bijv. dist/rekentools/box-3.html) — exact het pad
// dat Vercel als live URL serveert.
function schoneUrlsInBuild(outDir = 'dist') {
  return {
    name: 'schone-urls-build',
    closeBundle() {
      const distRoot = r(outDir);
      for (const [naam, absPad] of Object.entries(paginas)) {
        const relBron = absPad.slice(__dirname.length + 1).split(sep).join('/');
        const bronPad = join(distRoot, relBron);
        const doelPad = naam === 'main' ? join(distRoot, 'index.html') : join(distRoot, `${naam}.html`);
        if (existsSync(bronPad) && bronPad !== doelPad) {
          mkdirSync(dirname(doelPad), { recursive: true });
          renameSync(bronPad, doelPad);
        }
      }
      const overgeblevenSrc = join(distRoot, 'src');
      if (existsSync(overgeblevenSrc)) rmSync(overgeblevenSrc, { recursive: true, force: true });
    },
  };
}

export default defineConfig({
  plugins: [schoneUrlsInDev(), schoneUrlsInBuild()],
  build: {
    rollupOptions: { input: paginas },
  },
});
