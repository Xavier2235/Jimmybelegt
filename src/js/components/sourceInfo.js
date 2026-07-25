// Bronvermelding-component: info-icoon dat bij klik/hover de bron en status
// van een parameter toont. Gebruik: maakSourceInfo({ bron, status, toelichting })
// en voeg het resultaat toe naast het label van het invoerveld.
let volgnummer = 0;

export function maakSourceInfo({ bron, status, toelichting }) {
  volgnummer += 1;
  const id = `bron-info-${volgnummer}`;
  const wrap = document.createElement('span');
  wrap.className = 'bron-info';

  const knop = document.createElement('button');
  knop.type = 'button';
  knop.className = 'bron-info-knop';
  knop.setAttribute('aria-expanded', 'false');
  knop.setAttribute('aria-describedby', id);
  knop.textContent = 'i';
  knop.setAttribute('aria-label', 'Toon bron en status van dit cijfer');

  const panel = document.createElement('span');
  panel.className = 'bron-info-panel';
  panel.id = id;
  panel.setAttribute('role', 'tooltip');
  const statusLabel = status === 'definitief' ? 'Definitief' : 'Voorlopig';
  panel.innerHTML = `<span>Bron: ${bron}</span>` +
    (toelichting ? `<br><span>${toelichting}</span>` : '') +
    `<br><span class="status status-${status}">${statusLabel}</span>`;

  const sluit = (event) => {
    if (wrap.contains(event.target)) return;
    panel.removeAttribute('data-open');
    knop.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', sluit);
  };

  knop.addEventListener('click', () => {
    const open = panel.hasAttribute('data-open');
    if (open) {
      panel.removeAttribute('data-open');
      knop.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', sluit);
    } else {
      panel.setAttribute('data-open', '');
      knop.setAttribute('aria-expanded', 'true');
      document.addEventListener('click', sluit);
    }
  });

  wrap.append(knop, panel);
  return wrap;
}
