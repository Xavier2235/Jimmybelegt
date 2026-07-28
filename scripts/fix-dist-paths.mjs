// Verplaatst gebouwde HTML-bestanden van hun Vite-spiegelpad (dist/src/pages/...)
// naar hun schone URL-pad (dist/rekentools/box-3.html, dist/cursus.html, ...).
//
// Draait als EIGEN, VOLGENDE stap ná `vite build` — niet als Rollup/Vite-plugin-hook.
// Dat laatste (closeBundle/writeBundle) bleek in GitHub Actions-CI onbetrouwbaar:
// soms voltooide de hook niet vóór het build-proces afsloot, waardoor de artefact-
// upload de bestanden nog op hun oude pad aantrof. Een losse, sequentiële CLI-stap
// (npm's automatische "postbuild"-lifecycle-script) kan niet racen: Node garandeert
// dat dit script pas start nadat `npm run build` volledig is afgerond en beëindigd.
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');

const paginas = {
  main: join(ROOT, 'index.html'),
  rekentools: join(ROOT, 'src/pages/rekentools.html'),
  'rekentools/wat-had-je-nu-gehad': join(ROOT, 'src/pages/rekentools/wat-had-je-nu-gehad.html'),
  'rekentools/box-3': join(ROOT, 'src/pages/rekentools/box-3.html'),
  'rekentools/inflatie': join(ROOT, 'src/pages/rekentools/inflatie.html'),
  'rekentools/pensioengat': join(ROOT, 'src/pages/rekentools/pensioengat.html'),
  'rekentools/positiegrootte': join(ROOT, 'src/pages/rekentools/positiegrootte.html'),
  'rekentools/kosten': join(ROOT, 'src/pages/rekentools/kosten.html'),
  quiz: join(ROOT, 'src/pages/quiz.html'),
  cursus: join(ROOT, 'src/pages/cursus.html'),
  coaching: join(ROOT, 'src/pages/coaching.html'),
  'coaching/aanvraag': join(ROOT, 'src/pages/coaching/aanvraag.html'),
  over: join(ROOT, 'src/pages/over.html'),
  transparantie: join(ROOT, 'src/pages/transparantie.html'),
  voorwaarden: join(ROOT, 'src/pages/voorwaarden.html'),
  'checkout-demo': join(ROOT, 'src/pages/checkout-demo.html'),
  bedankt: join(ROOT, 'src/pages/bedankt.html'),
  bevestig: join(ROOT, 'src/pages/bevestig.html'),
  404: join(ROOT, 'src/pages/404.html'),
};

if (!existsSync(DIST)) {
  console.error(`[fix-dist-paths] FOUT: ${DIST} bestaat niet. Draai eerst "npm run build".`);
  process.exit(1);
}

let verplaatst = 0;
let misten = [];
for (const [naam, absPad] of Object.entries(paginas)) {
  const relBron = absPad.slice(ROOT.length + 1).split(sep).join('/');
  const bronPad = join(DIST, relBron);
  const doelPad = naam === 'main' ? join(DIST, 'index.html') : join(DIST, `${naam}.html`);
  if (bronPad === doelPad) continue; // main staat al goed
  if (existsSync(bronPad)) {
    mkdirSync(dirname(doelPad), { recursive: true });
    renameSync(bronPad, doelPad);
    verplaatst += 1;
  } else if (!existsSync(doelPad)) {
    misten.push({ naam, bronPad });
  }
}

const overgeblevenSrc = join(DIST, 'src');
if (existsSync(overgeblevenSrc)) rmSync(overgeblevenSrc, { recursive: true, force: true });

console.log(`[fix-dist-paths] ${verplaatst} pagina('s) verplaatst naar hun schone URL-pad.`);
if (misten.length) {
  console.error(`[fix-dist-paths] WAARSCHUWING: ${misten.length} pagina('s) niet gevonden op het verwachte bronpad:`);
  misten.forEach(({ naam, bronPad }) => console.error(`  - "${naam}" (verwacht: ${bronPad})`));
  process.exit(1); // laat de CI-build hard falen — beter een rode build dan een stille 404 live
}
