// De aannames-accordion staat standaard dicht en toont een teller ("5 aannames")
// in de kop. De teller wordt automatisch geteld op basis van het aantal <li>'s
// in de accordion-body, zodat de tekst nooit los raakt van de werkelijke lijst.
export function initAccordions() {
  document.querySelectorAll('[data-component="aannames-accordion"]').forEach((details) => {
    const teller = details.querySelector('.teller');
    const items = details.querySelectorAll('.accordion-body li');
    if (teller) teller.textContent = `${items.length} ${items.length === 1 ? 'aanname' : 'aannames'}`;
  });
}
