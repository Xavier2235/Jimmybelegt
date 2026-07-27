// Tool 4 — Pensioengat. "Al opgebouwd pensioen" is het bedrag dat de
// gebruiker zelf invult (bijv. van het eigen Mijnpensioenoverzicht,
// inclusief AOW) — wij verzinnen geen officieel AOW- of pensioenbedrag.
// Pensioenleeftijd (67) en uitkeerperiode (20 jaar) staan als vaste,
// expliciet benoemde aannames in de accordion — geen verzwegen aannames.
import { koppelRangeVelden } from '../components/rangeInput.js';
import { tekenGestapeldeStaven } from '../components/chart.js';
import { euro } from '../format.js';

const PENSIOENLEEFTIJD = 67;
const UITKEERPERIODE_JAREN = 20;
const SCENARIOS = [0.03, 0.06, 0.09];

function benodigdeMaandinleg(kapitaalDoel, rendement, jaren) {
  const i = rendement / 12;
  const n = Math.max(1, Math.round(jaren * 12));
  if (i === 0) return kapitaalDoel / n;
  return (kapitaalDoel * i) / ((1 + i) ** n - 1);
}

export function initPensioengatPagina() {
  const root = document.querySelector('[data-tool="pensioengat"]');
  if (!root) return;
  koppelRangeVelden(root);

  const veld = (naam) => Number(root.querySelector(`[data-veld="${naam}"] input[type="range"]`).value);
  const chartContainer = root.querySelector('[data-uitvoer="grafiek"]');

  function herberekenen() {
    const leeftijd = veld('leeftijd');
    const opgebouwd = veld('opgebouwd-pensioen');
    const gewenst = veld('gewenst-inkomen');
    const jarenTotPensioen = Math.max(1, PENSIOENLEEFTIJD - leeftijd);

    const tekortUitkomsten = [opgebouwd * 0.9, opgebouwd, opgebouwd * 1.1]
      .map((o) => Math.max(0, gewenst - o))
      .sort((a, b) => b - a); // hoogste tekort eerst = bij laagste opgebouwd bedrag
    const [tekortHoog, tekortMidden, tekortLaag] = tekortUitkomsten;

    root.querySelector('[data-band="laag"]').textContent = `${euro(tekortLaag)} / mnd`;
    root.querySelector('[data-band="midden"]').textContent = `${euro(tekortMidden)} / mnd`;
    root.querySelector('[data-band="hoog"]').textContent = `${euro(tekortHoog)} / mnd`;

    const kapitaalDoel = tekortMidden * 12 * UITKEERPERIODE_JAREN;
    const inleggen = SCENARIOS.map((r) => benodigdeMaandinleg(kapitaalDoel, r, jarenTotPensioen)).sort((a, b) => a - b);
    root.querySelector('[data-inleg="laag"]').textContent = `${euro(inleggen[0])} / mnd`;
    root.querySelector('[data-inleg="midden"]').textContent = `${euro(inleggen[1])} / mnd`;
    root.querySelector('[data-inleg="hoog"]').textContent = `${euro(inleggen[2])} / mnd`;
    root.querySelector('[data-uitvoer="jaren-tot-pensioen"]').textContent = jarenTotPensioen;

    if (chartContainer) {
      tekenGestapeldeStaven(chartContainer, {
        categorieen: [
          { label: 'Bij 9%', segmenten: [{ naam: 'Maandinleg', waarde: inleggen[0], kleur: 'var(--c-band-laag)' }] },
          { label: 'Bij 6%', segmenten: [{ naam: 'Maandinleg', waarde: inleggen[1], kleur: 'var(--c-band-midden)' }] },
          { label: 'Bij 3%', segmenten: [{ naam: 'Maandinleg', waarde: inleggen[2], kleur: 'var(--c-band-hoog)' }] },
        ],
      });
    }

    const brutojaarinkomen = veld('brutojaarinkomen');
    const pctVanBruto = brutojaarinkomen > 0 ? ((gewenst * 12) / brutojaarinkomen) * 100 : 0;
    root.querySelector('[data-uitvoer="pct-van-bruto"]').textContent = `${Math.round(pctVanBruto)}%`;
  }

  root.addEventListener('veldwijziging', herberekenen);
  herberekenen();
}
