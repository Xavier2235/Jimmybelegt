// Inline SVG-grafieken, zelf gegenereerd — geen chart-library.
// Twee vormen: een lijngrafiek met hover-tooltip, en een gestapelde staaf.
import { euro } from '../format.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (naam, attrs = {}) => {
  const e = document.createElementNS(NS, naam);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
};

function mooiePlafond(v) {
  if (v <= 0) return 1;
  const macht = 10 ** Math.floor(Math.log10(v));
  for (const f of [1, 2, 5, 10]) if (f * macht >= v) return f * macht;
  return 10 * macht;
}
// Onder de 10 mag een decimaal getoond worden, anders vallen bijv. 0,5 en 1
// samen op hetzelfde afgeronde as-label bij een zeer kleine schaal (o.a. als
// beide staven €0 zijn en de "mooie" bovengrens maar 1 of 2 euro is).
const kortEuro = (v) => (v >= 1e6 ? `${(v / 1e6).toLocaleString('nl-NL', { maximumFractionDigits: 1 })} mln` :
  v >= 1000 ? `${Math.round(v / 1000).toLocaleString('nl-NL')}k` :
  v > 0 && v < 10 ? v.toLocaleString('nl-NL', { maximumFractionDigits: 1 }) : `${Math.round(v)}`);

/**
 * Lijngrafiek met kruisdraad-tooltip.
 * @param {HTMLElement} container
 * @param {{series: {label:string, kleur:string, punten:number[], gestippeld?:boolean}[],
 *          xLabels: (string|number)[], watermerk?: string}} opties
 */
export function tekenLijnGrafiek(container, { series, xLabels, watermerk }) {
  container.innerHTML = '';
  const svg = el('svg', { viewBox: '0 0 640 320', role: 'img' });
  const W = 640, H = 320;
  const maxY = mooiePlafond(Math.max(1, ...series.flatMap((s) => s.punten)) * 1.05);
  const padL = 56, padR = 16, padT = 16, padB = 34;
  const x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT;
  const T = xLabels.length - 1;
  const xAt = (i) => x0 + (x1 - x0) * (T === 0 ? 0 : i / T);
  const yAt = (v) => y0 - (y0 - y1) * (v / maxY);

  const stappen = 4;
  for (let i = 0; i <= stappen; i += 1) {
    const v = (maxY / stappen) * i;
    const yy = yAt(v);
    svg.append(el('line', { x1: x0, x2: x1, y1: yy, y2: yy, stroke: 'var(--c-border)', 'stroke-width': 1 }));
    const t = el('text', { x: x0 - 8, y: yy + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--c-text-muted)' });
    t.textContent = `€ ${kortEuro(v)}`;
    svg.append(t);
  }
  const xStap = T > 24 ? Math.ceil(T / 8) : T > 8 ? 2 : 1;
  for (let i = 0; i <= T; i += xStap) {
    const t = el('text', { x: xAt(i), y: y0 + 20, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--c-text-muted)' });
    t.textContent = xLabels[i];
    svg.append(t);
  }

  series.forEach((s) => {
    const d = s.punten.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join('');
    svg.append(el('path', {
      d, fill: 'none', stroke: s.kleur, 'stroke-width': 2.5,
      'stroke-linejoin': 'round', 'stroke-linecap': 'round',
      ...(s.gestippeld ? { 'stroke-dasharray': '6 4' } : {}),
    }));
  });

  if (watermerk) {
    const wm = el('text', { x: (x0 + x1) / 2, y: (y0 + y1) / 2, 'text-anchor': 'middle', class: 'chart-watermerk', transform: `rotate(-18 ${(x0 + x1) / 2} ${(y0 + y1) / 2})` });
    wm.textContent = watermerk;
    svg.append(wm);
  }

  // Hover-laag
  const kruis = el('g', { style: 'display:none' });
  const kruisLijn = el('line', { y1: y1, y2: y0, stroke: 'var(--c-border)', 'stroke-width': 1 });
  kruis.append(kruisLijn);
  const stippen = series.map((s) => {
    const c = el('circle', { r: 4.5, fill: s.kleur, stroke: 'var(--c-bg)', 'stroke-width': 2 });
    kruis.append(c);
    return c;
  });
  svg.append(kruis);

  const vangst = el('rect', { x: x0, y: y1, width: x1 - x0, height: y0 - y1, fill: 'transparent' });
  svg.append(vangst);

  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  tooltip.style.cssText = 'position:absolute;display:none;pointer-events:none;background:var(--c-surface-2);border:1px solid var(--c-border);border-radius:8px;padding:8px 10px;font-size:12px;white-space:nowrap;z-index:5;color:var(--c-text)';
  container.style.position = 'relative';

  function toon(evt) {
    const rect = svg.getBoundingClientRect();
    const px = (evt.clientX - rect.left) * (W / rect.width);
    const i = Math.max(0, Math.min(T, Math.round((px - x0) / ((x1 - x0) || 1) * T)));
    const xx = xAt(i);
    kruis.style.display = '';
    kruisLijn.setAttribute('x1', xx); kruisLijn.setAttribute('x2', xx);
    let html = `<strong>${xLabels[i]}</strong><br>`;
    series.forEach((s, idx) => {
      stippen[idx].setAttribute('cx', xx);
      stippen[idx].setAttribute('cy', yAt(s.punten[i]));
      html += `<span style="color:${s.kleur}">●</span> ${s.label}: ${euro(s.punten[i])}<br>`;
    });
    tooltip.innerHTML = html;
    tooltip.style.display = 'block';
    const schaal = rect.width / W;
    let tx = xx * schaal + 12;
    if (tx + 160 > rect.width) tx = xx * schaal - 172;
    tooltip.style.left = `${Math.max(0, tx)}px`;
    tooltip.style.top = '4px';
  }
  function verberg() { kruis.style.display = 'none'; tooltip.style.display = 'none'; }
  vangst.addEventListener('pointermove', toon);
  vangst.addEventListener('pointerdown', toon);
  vangst.addEventListener('pointerleave', verberg);

  container.append(svg, tooltip);
}

/**
 * Gestapelde staafgrafiek (verticaal, één staaf per categorie, twee segmenten).
 * @param {{label:string, segmenten:{waarde:number, kleur:string, naam:string}[]}[]} categorieen
 * @param {(v:number)=>string} [yFormat] - as-labels; standaard euro, geef een
 *   eigen formatter mee voor niet-geldwaarden (bijv. aantallen).
 */
export function tekenGestapeldeStaven(container, { categorieen, yFormat = (v) => `€ ${kortEuro(v)}` }) {
  container.innerHTML = '';
  const totalen = categorieen.map((c) => c.segmenten.reduce((a, s) => a + s.waarde, 0));
  const maxTotaal = mooiePlafond(Math.max(1, ...totalen) * 1.05);
  const W = 640, H = 320;
  const padL = 56, padR = 16, padT = 16, padB = 40;
  const x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT;
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' });

  for (let i = 0; i <= 4; i += 1) {
    const v = (maxTotaal / 4) * i;
    const yy = y0 - (y0 - y1) * (v / maxTotaal);
    svg.append(el('line', { x1: x0, x2: x1, y1: yy, y2: yy, stroke: 'var(--c-border)', 'stroke-width': 1 }));
    const t = el('text', { x: x0 - 8, y: yy + 4, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--c-text-muted)' });
    t.textContent = yFormat(v);
    svg.append(t);
  }

  const n = categorieen.length;
  const slotBreedte = (x1 - x0) / n;
  const staafBreedte = Math.min(72, slotBreedte * 0.5);

  categorieen.forEach((cat, i) => {
    const cx = x0 + slotBreedte * (i + 0.5);
    let yCursor = y0;
    cat.segmenten.forEach((seg) => {
      const hoogte = (y0 - y1) * (seg.waarde / maxTotaal);
      svg.append(el('rect', {
        x: cx - staafBreedte / 2, y: yCursor - hoogte, width: staafBreedte, height: Math.max(0, hoogte - 2),
        fill: seg.kleur, rx: 3,
      }));
      yCursor -= hoogte;
    });
    const label = el('text', { x: cx, y: y0 + 20, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--c-text)' });
    label.textContent = cat.label;
    svg.append(label);
  });

  container.append(svg);
}
