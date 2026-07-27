// Tool 5 — Positiegrootte & risk-of-ruin. Zuivere rekenkunde, neutraal
// gepresenteerd: geen aanmoediging of ontmoediging, alleen de uitkomst.
// Monte Carlo met 5.000 iteraties voor de kans op -50% account.
import { koppelRangeVelden } from '../components/rangeInput.js';
import { tekenGestapeldeStaven } from '../components/chart.js';
import { euro, percentage } from '../format.js';

const ITERATIES = 5000;

function simuleer({ accountgrootte, risicoPct, winratePct, ratio, aantalTrades }) {
  const winrate = winratePct / 100;
  const risico = risicoPct / 100;
  let ruines = 0;
  const eindbalansen = new Array(ITERATIES);

  for (let i = 0; i < ITERATIES; i += 1) {
    let balans = accountgrootte;
    let geraakt = false;
    for (let t = 0; t < aantalTrades && balans > 0; t += 1) {
      const risicoBedrag = balans * risico;
      const win = Math.random() < winrate;
      balans += win ? risicoBedrag * ratio : -risicoBedrag;
      if (!geraakt && balans <= accountgrootte * 0.5) { geraakt = true; ruines += 1; }
    }
    eindbalansen[i] = Math.max(0, balans);
  }
  eindbalansen.sort((a, b) => a - b);
  const percentiel = (p) => eindbalansen[Math.min(ITERATIES - 1, Math.floor(p * ITERATIES))];
  return {
    kansOpRuine: ruines / ITERATIES,
    laag: percentiel(0.1),
    midden: percentiel(0.5),
    hoog: percentiel(0.9),
    eindbalansen,
  };
}

// Verdeelt de eindsaldi over een handvol gelijke bins voor een histogram —
// puur beschrijvend, geen aparte kansverdeling-aanname.
function histogram(eindbalansen, aantalBins = 8) {
  const max = Math.max(1, ...eindbalansen);
  const binBreedte = max / aantalBins;
  const bins = new Array(aantalBins).fill(0);
  eindbalansen.forEach((b) => {
    const idx = Math.min(aantalBins - 1, Math.floor(b / binBreedte));
    bins[idx] += 1;
  });
  return bins.map((count, i) => ({
    label: `€${Math.round((i * binBreedte) / 1000)}k+`,
    count,
  }));
}

export function initPositiegrootePagina() {
  const root = document.querySelector('[data-tool="positiegrootte"]');
  if (!root) return;
  koppelRangeVelden(root);

  const veld = (naam) => Number(root.querySelector(`[data-veld="${naam}"] input[type="range"]`).value);
  const chartContainer = root.querySelector('[data-uitvoer="grafiek"]');

  function herberekenen() {
    const accountgrootte = veld('accountgrootte');
    const risicoPct = veld('risico-per-trade');
    const winratePct = veld('winrate');
    const ratio = veld('ratio');
    const aantalTrades = veld('aantal-trades');

    const winrate = winratePct / 100;
    const evR = winrate * ratio - (1 - winrate);
    const risicoBedrag = accountgrootte * (risicoPct / 100);
    const evEuro = evR * risicoBedrag;
    const winrateBreakEven = (1 / (ratio + 1)) * 100;

    root.querySelector('[data-uitvoer="ev-per-trade"]').textContent = euro(evEuro, 2);
    root.querySelector('[data-uitvoer="winrate-breakeven"]').textContent = percentage(winrateBreakEven);

    const meldingEl = root.querySelector('[data-uitvoer="ev-melding"]');
    meldingEl.className = 'pill pill-neutraal';
    meldingEl.textContent = evR < 0
      ? 'Met deze invoer is de verwachtingswaarde negatief.'
      : 'Met deze invoer is de verwachtingswaarde positief.';

    const sim = simuleer({ accountgrootte, risicoPct, winratePct, ratio, aantalTrades });
    root.querySelector('[data-band="laag"]').textContent = euro(sim.laag);
    root.querySelector('[data-band="midden"]').textContent = euro(sim.midden);
    root.querySelector('[data-band="hoog"]').textContent = euro(sim.hoog);
    root.querySelector('[data-uitvoer="kans-ruine"]').textContent = percentage(sim.kansOpRuine * 100);

    if (chartContainer) {
      const bins = histogram(sim.eindbalansen);
      tekenGestapeldeStaven(chartContainer, {
        categorieen: bins.map(({ label, count }) => ({
          label,
          segmenten: [{ naam: 'Simulaties', waarde: count, kleur: 'var(--c-accent)' }],
        })),
        yFormat: (v) => Math.round(v).toLocaleString('nl-NL'),
      });
    }
  }

  root.addEventListener('veldwijziging', herberekenen);
  herberekenen();
}
