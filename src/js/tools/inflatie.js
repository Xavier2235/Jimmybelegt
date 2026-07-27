// Tool 3 — Inflatietool. Geen officiële historische CPI-reeks meegeleverd,
// dus inflatie is een expliciete, door de gebruiker instelbare aanname (geen
// vaststaand feit). Bandbreedte = gevoeligheid rond die aanname (±1%-punt).
// Geen gate: dit is de vrij deelbare tool.
import { koppelRangeVelden } from '../components/rangeInput.js';
import { tekenLijnGrafiek } from '../components/chart.js';
import { initDeelKnop, leesQuery } from '../components/shareLink.js';
import { euro, percentage } from '../format.js';

const NU_JAAR = new Date().getFullYear();

function koopkracht(bedrag, jaar, inflatiePct) {
  const jarenVerschil = Math.max(0, NU_JAAR - jaar);
  return bedrag / (1 + inflatiePct / 100) ** jarenVerschil;
}

// Toont hoe de koopkracht van het oorspronkelijke (nominale) bedrag ieder jaar
// afneemt, van het startjaar tot nu — bij de ingestelde inflatie-aanname.
function koopkrachtReeks(bedrag, startjaar, inflatiePct) {
  const punten = [];
  const jaren = [];
  for (let jaar = startjaar; jaar <= NU_JAAR; jaar += 1) {
    punten.push(bedrag / (1 + inflatiePct / 100) ** (jaar - startjaar));
    jaren.push(jaar);
  }
  return { punten, jaren };
}

export function initInflatiePagina() {
  const root = document.querySelector('[data-tool="inflatie"]');
  if (!root) return;

  const q = leesQuery();
  if (q.get('bedrag')) root.querySelector('[data-veld="bedrag"] input[type="range"]').value = q.get('bedrag');
  if (q.get('jaar')) root.querySelector('[data-veld="jaar"] input[type="range"]').value = q.get('jaar');
  if (q.get('inflatie')) root.querySelector('[data-veld="inflatie"] input[type="range"]').value = q.get('inflatie');
  koppelRangeVelden(root);

  root.querySelectorAll('[data-nu-jaar]').forEach((elNode) => { elNode.textContent = NU_JAAR; });
  const chartContainer = root.querySelector('[data-uitvoer="grafiek"]');

  function herberekenen() {
    const bedrag = Number(root.querySelector('[data-veld="bedrag"] input[type="range"]').value);
    const jaar = Number(root.querySelector('[data-veld="jaar"] input[type="range"]').value);
    const inflatie = Number(root.querySelector('[data-veld="inflatie"] input[type="range"]').value);

    const uitkomsten = [inflatie + 1, inflatie, Math.max(0, inflatie - 1)]
      .map((r) => koopkracht(bedrag, jaar, r))
      .sort((a, b) => a - b);

    root.querySelector('[data-band="laag"]').textContent = euro(uitkomsten[0]);
    root.querySelector('[data-band="midden"]').textContent = euro(uitkomsten[1]);
    root.querySelector('[data-band="hoog"]').textContent = euro(uitkomsten[2]);

    if (chartContainer) {
      const { punten, jaren } = koopkrachtReeks(bedrag, jaar, inflatie);
      tekenLijnGrafiek(chartContainer, {
        series: [{ label: 'Koopkracht', kleur: 'var(--c-accent)', punten }],
        xLabels: jaren,
      });
    }

    const verliesPct = bedrag > 0 ? 100 - (uitkomsten[1] / bedrag) * 100 : 0;
    root.querySelector('[data-uitvoer="verlies-pct"]').textContent = percentage(verliesPct);
    root.querySelectorAll('[data-uitvoer="verlies-pct-herhaald"]').forEach((elNode) => {
      elNode.textContent = percentage(verliesPct);
    });
  }

  root.addEventListener('veldwijziging', herberekenen);
  initDeelKnop(root.querySelector('[data-actie="deel"]'), () => ({
    bedrag: root.querySelector('[data-veld="bedrag"] input[type="range"]').value,
    jaar: root.querySelector('[data-veld="jaar"] input[type="range"]').value,
    inflatie: root.querySelector('[data-veld="inflatie"] input[type="range"]').value,
  }));

  herberekenen();
}
