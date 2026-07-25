// Vult elk disclaimer-component met de merkstandaardtekst, of een expliciet
// override-tekst via het data-disclaimer-tekst-attribuut op dezelfde node.
export function initDisclaimers(brand) {
  document.querySelectorAll('[data-component="disclaimer"]').forEach((el) => {
    const override = el.getAttribute('data-disclaimer-tekst');
    const p = el.querySelector('p') || el.appendChild(document.createElement('p'));
    p.innerHTML = `<strong>Disclaimer.</strong> ${override || brand.disclaimerStandaard}`;
  });
}
