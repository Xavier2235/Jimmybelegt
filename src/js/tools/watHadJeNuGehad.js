// Tool 1 [FLAGSHIP] — "Wat had je nu gehad?"
// Rekent een eenmalige inleg door met FICTIEVE reeksen uit demo-series.json.
// Bandbreedte (laag/midden/hoog) = min/mediaan/max van de 3 reeksen voor
// dezelfde inleg + startjaar. De grafiek toont de gekozen reeks, met watermerk.
import demoSeries from '../../data/demo-series.json';
import { koppelRangeVelden } from '../components/rangeInput.js';
import { tekenLijnGrafiek, tekenGestapeldeStaven } from '../components/chart.js';
import { initDeelKnop, leesQuery } from '../components/shareLink.js';
import { euro } from '../format.js';

const LAATSTE_JAAR = 2024;

function eindwaardeReeks(bedrag, startjaar, reeksKey) {
  const rendementen = demoSeries.reeksen[reeksKey].jaarrendementen;
  let waarde = bedrag;
  const punten = [waarde];
  const jaren = [startjaar];
  for (let jaar = startjaar; jaar < LAATSTE_JAAR; jaar += 1) {
    const r = rendementen[String(jaar)] ?? 0;
    waarde *= 1 + r;
    punten.push(waarde);
    jaren.push(jaar + 1);
  }
  return { eindwaarde: waarde, punten, jaren };
}

function berekenBandbreedte(bedrag, startjaar) {
  const uitkomsten = ['A', 'B', 'C'].map((k) => eindwaardeReeks(bedrag, startjaar, k).eindwaarde);
  const gesorteerd = [...uitkomsten].sort((a, b) => a - b);
  return { laag: gesorteerd[0], midden: gesorteerd[1], hoog: gesorteerd[2] };
}

export function initWatHadJeNuGehadPagina() {
  const root = document.querySelector('[data-tool="wat-had-je-nu-gehad"]');
  if (!root) return;
  koppelRangeVelden(root);

  const bedragGroep = root.querySelector('[data-veld="bedrag"]');
  const startjaarGroep = root.querySelector('[data-veld="startjaar"]');
  const reeksInputs = root.querySelectorAll('input[name="reeks"]');
  const chartContainer = root.querySelector('[data-uitvoer="grafiek"]');
  const stapelContainer = root.querySelector('[data-uitvoer="stapel"]');
  const deelKnop = root.querySelector('[data-actie="deel"]');

  const q = leesQuery();
  if (q.get('bedrag')) bedragGroep.querySelector('input[type="range"]').value = q.get('bedrag');
  if (q.get('startjaar')) startjaarGroep.querySelector('input[type="range"]').value = q.get('startjaar');
  if (q.get('reeks')) reeksInputs.forEach((r) => { r.checked = r.value === q.get('reeks'); });
  koppelRangeVelden(root); // herformatteer numerieke velden na eventuele query-override

  function huidigeReeks() {
    return Array.from(reeksInputs).find((r) => r.checked)?.value || 'A';
  }

  function herberekenen() {
    const bedrag = Number(bedragGroep.querySelector('input[type="range"]').value);
    const startjaar = Number(startjaarGroep.querySelector('input[type="range"]').value);
    const reeksKey = huidigeReeks();

    const band = berekenBandbreedte(bedrag, startjaar);
    root.querySelector('[data-band="laag"]').textContent = euro(band.laag);
    root.querySelector('[data-band="midden"]').textContent = euro(band.midden);
    root.querySelector('[data-band="hoog"]').textContent = euro(band.hoog);

    const { eindwaarde, punten, jaren } = eindwaardeReeks(bedrag, startjaar, reeksKey);
    tekenLijnGrafiek(chartContainer, {
      series: [{ label: `Reeks ${reeksKey}`, kleur: 'var(--c-accent)', punten }],
      xLabels: jaren,
      watermerk: 'ILLUSTRATIEVE REEKS — GEEN ECHTE DATA',
    });

    const groei = Math.max(0, eindwaarde - bedrag);
    tekenGestapeldeStaven(stapelContainer, {
      categorieen: [{
        label: `${startjaar} → ${LAATSTE_JAAR}`,
        segmenten: [
          { naam: 'Ingelegd', waarde: bedrag, kleur: 'var(--c-chart-ingelegd)' },
          { naam: 'Groei', waarde: groei, kleur: 'var(--c-chart-groei)' },
        ],
      }],
    });
    root.querySelector('[data-uitvoer="ingelegd"]').textContent = euro(bedrag);
    root.querySelector('[data-uitvoer="groei"]').textContent = euro(groei);
  }

  root.addEventListener('veldwijziging', herberekenen);
  reeksInputs.forEach((r) => r.addEventListener('change', herberekenen));
  initDeelKnop(deelKnop, () => ({
    bedrag: bedragGroep.querySelector('input[type="range"]').value,
    startjaar: startjaarGroep.querySelector('input[type="range"]').value,
    reeks: huidigeReeks(),
  }));

  herberekenen();
}

// Compacte, direct-interactieve versie voor de landingspagina — zelfde
// rekenkern, geen grafiek/gate/accordion. "Niet achter een klik", zoals gevraagd.
export function initWatHadJeNuGehadWidget(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="card stack">
      <p class="card-eyebrow">Rekentool live &mdash; probeer het direct</p>
      <div class="veld" data-range-groep>
        <label for="widget-bedrag">Eenmalige inleg</label>
        <div class="range-rij">
          <input type="range" id="widget-bedrag" min="10" max="10000" step="10" value="1000">
          <div class="getal-invoer"><span>&euro;</span><input type="text" inputmode="decimal" aria-label="Bedrag"></div>
        </div>
        <span class="veld-hint">Startjaar 2010 &middot; Reeks A (illustratief) &mdash; volledige tool: /rekentools/wat-had-je-nu-gehad</span>
      </div>
      <div class="band-rij" data-uitvoer="bandbreedte">
        <div class="band-tegel band-tegel-laag"><p class="band-label">Laag</p><p class="band-waarde" data-band="laag">&euro; 0</p></div>
        <div class="band-tegel band-tegel-midden"><p class="band-label">Midden</p><p class="band-waarde" data-band="midden">&euro; 0</p></div>
        <div class="band-tegel band-tegel-hoog"><p class="band-label">Hoog</p><p class="band-waarde" data-band="hoog">&euro; 0</p></div>
      </div>
      <p class="fs-small text-muted">Op basis van fictieve illustratieve reeksen — geen historische data.</p>
    </div>`;
  koppelRangeVelden(container);
  const herberekenen = () => {
    const bedrag = Number(container.querySelector('#widget-bedrag').value);
    const band = berekenBandbreedte(bedrag, 2010);
    container.querySelector('[data-band="laag"]').textContent = euro(band.laag);
    container.querySelector('[data-band="midden"]').textContent = euro(band.midden);
    container.querySelector('[data-band="hoog"]').textContent = euro(band.hoog);
  };
  container.addEventListener('veldwijziging', herberekenen);
  herberekenen();
}
