// Filtert de toolkaarten op thema — puur client-side, geen server nodig.
const knoppen = document.querySelectorAll('#hub-filters [data-filter]');
const kaarten = document.querySelectorAll('#hub-kaarten [data-thema]');

knoppen.forEach((knop) => {
  knop.addEventListener('click', () => {
    knoppen.forEach((k) => k.setAttribute('aria-pressed', String(k === knop)));
    const filter = knop.dataset.filter;
    kaarten.forEach((kaart) => {
      kaart.style.display = filter === 'alle' || kaart.dataset.thema === filter ? '' : 'none';
    });
  });
});
