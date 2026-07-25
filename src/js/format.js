// Nederlandse notatie overal: punt als duizendscheiding, komma als decimaal.
const eurFmt0 = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const eurFmt2 = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
const pctFmt1 = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 });
const getalFmt = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 0 });

export const euro = (v, decimalen = 0) => (decimalen === 2 ? eurFmt2 : eurFmt0).format(Number.isFinite(v) ? v : 0);
export const percentage = (v) => `${pctFmt1.format(Number.isFinite(v) ? v : 0)}%`;
export const getal = (v) => getalFmt.format(Number.isFinite(v) ? v : 0);

export function parseGetal(input) {
  if (typeof input === 'number') return input;
  const n = parseFloat(String(input).replace(/\s|\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}
