// DEMO-balk: sticky, sluitbaar per sessie (sessionStorage, dus terug bij nieuwe sessie).
const KEY = 'demobalk-gesloten';

export function initDemobar(brand) {
  const bar = document.querySelector('[data-component="demobar"]');
  if (!bar) return;

  const tekstEl = bar.querySelector('.demobar-tekst');
  if (tekstEl) tekstEl.textContent = brand.demoBalkTekst;

  if (sessionStorage.getItem(KEY) === '1') {
    bar.hidden = true;
    return;
  }

  const sluitKnop = bar.querySelector('.demobar-sluit');
  sluitKnop?.addEventListener('click', () => {
    bar.hidden = true;
    sessionStorage.setItem(KEY, '1');
  });
}
