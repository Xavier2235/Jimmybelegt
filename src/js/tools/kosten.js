// Tool 6 — Kostenimpact. Broker-agnostisch: geen merknamen, geen
// vergelijkingstabel, geen uitgaande links. De gebruiker vult zelf
// percentages/kosten in. Bandbreedte via ±1%-punt rendementsgevoeligheid,
// zelfde conventie als de andere tools.
import { koppelRangeVelden } from '../components/rangeInput.js';
import { tekenGestapeldeStaven } from '../components/chart.js';
import { euro, percentage } from '../format.js';

function eindvermogen(startbedrag, maandinleg, jaren, jaarlijksRendement, terPct, transactiekostenPerJaar) {
  const nettoRendement = jaarlijksRendement - terPct / 100;
  const iMaand = (1 + nettoRendement) ** (1 / 12) - 1;
  let balans = startbedrag;
  for (let maand = 1; maand <= jaren * 12; maand += 1) {
    balans = balans * (1 + iMaand) + maandinleg;
    if (maand % 12 === 0) balans = Math.max(0, balans - transactiekostenPerJaar);
  }
  return balans;
}

export function initKostenPagina() {
  const root = document.querySelector('[data-tool="kosten"]');
  if (!root) return;
  koppelRangeVelden(root);

  const veld = (naam) => Number(root.querySelector(`[data-veld="${naam}"] input[type="range"]`).value);

  function herberekenen() {
    const startbedrag = veld('startbedrag');
    const maandinleg = veld('maandinleg');
    const jaren = veld('horizon');
    const brutorendement = veld('brutorendement') / 100;
    const ter = veld('ter');
    const kostenPerOrder = veld('transactiekosten');
    const ordersPerJaar = veld('orders-per-jaar');
    const transactiekostenPerJaar = kostenPerOrder * ordersPerJaar;

    const scenarios = [brutorendement + 0.01, brutorendement, Math.max(0, brutorendement - 0.01)];
    const zonderKosten = scenarios.map((r) => eindvermogen(startbedrag, maandinleg, jaren, r, 0, 0)).sort((a, b) => a - b);
    const metKosten = scenarios.map((r) => eindvermogen(startbedrag, maandinleg, jaren, r, ter, transactiekostenPerJaar)).sort((a, b) => a - b);

    root.querySelector('[data-band-zonder="laag"]').textContent = euro(zonderKosten[0]);
    root.querySelector('[data-band-zonder="midden"]').textContent = euro(zonderKosten[1]);
    root.querySelector('[data-band-zonder="hoog"]').textContent = euro(zonderKosten[2]);
    root.querySelector('[data-band-met="laag"]').textContent = euro(metKosten[0]);
    root.querySelector('[data-band-met="midden"]').textContent = euro(metKosten[1]);
    root.querySelector('[data-band-met="hoog"]').textContent = euro(metKosten[2]);

    const kostenImpact = Math.max(0, zonderKosten[1] - metKosten[1]);
    const kostenPct = zonderKosten[1] > 0 ? (kostenImpact / zonderKosten[1]) * 100 : 0;
    root.querySelector('[data-uitvoer="kosten-euro"]').textContent = euro(kostenImpact);
    root.querySelector('[data-uitvoer="kosten-pct"]').textContent = percentage(kostenPct);

    tekenGestapeldeStaven(root.querySelector('[data-uitvoer="grafiek"]'), {
      categorieen: [{
        label: `Na ${jaren} jaar`,
        segmenten: [
          { naam: 'Netto eindvermogen', waarde: metKosten[1], kleur: 'var(--c-accent)' },
          { naam: 'Weggegaan aan kosten', waarde: kostenImpact, kleur: 'var(--c-negative)' },
        ],
      }],
    });
  }

  root.addEventListener('veldwijziging', herberekenen);
  herberekenen();
}
