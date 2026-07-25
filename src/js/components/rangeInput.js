// Koppelt elke range-slider aan zijn numerieke invoerveld binnen een
// [data-range-groep]-wrapper. Beide velden blijven synchroon; bij elke
// wijziging (van welke kant dan ook) vuurt een 'veldwijziging'-event met
// detail.waarde, zodat een tool altijd op dezelfde manier kan luisteren.
import { getal, parseGetal } from '../format.js';

export function koppelRangeVelden(root) {
  root.querySelectorAll('[data-range-groep]').forEach((groep) => {
    const range = groep.querySelector('input[type="range"]');
    const invoer = groep.querySelector('.getal-invoer input');
    if (!range || !invoer) return;
    const min = Number(range.min || 0);
    const max = Number(range.max || 100);
    const clamp = (v) => Math.min(max, Math.max(min, v));
    const meld = (waarde) => {
      groep.dispatchEvent(new CustomEvent('veldwijziging', { bubbles: true, detail: { waarde } }));
    };

    invoer.value = getal(Number(range.value));

    range.addEventListener('input', () => {
      invoer.value = getal(Number(range.value));
      meld(Number(range.value));
    });
    invoer.addEventListener('input', () => {
      const n = clamp(parseGetal(invoer.value));
      range.value = String(n);
      meld(n);
    });
    invoer.addEventListener('blur', () => {
      invoer.value = getal(Number(range.value));
    });
  });
}
