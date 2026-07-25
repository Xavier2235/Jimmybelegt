// E-mail gate: staat ALTIJD onder een al zichtbaar resultaat, blokkeert niets.
// Demo-gedrag: geen echte verzending. Logt naar console + localStorage,
// toont een alert en stuurt door naar /bevestig.
let volgnummer = 0;

export function initGates(brand) {
  document.querySelectorAll('[data-component="gate"]').forEach((gate) => {
    volgnummer += 1;
    const idBase = `gate-${volgnummer}`;
    const emailInput = gate.querySelector('input[type="email"]');
    const toestemmingInput = gate.querySelector('.gate-toestemming input[type="checkbox"]');
    const toestemmingLabel = gate.querySelector('.gate-toestemming label');
    const succesEl = gate.querySelector('.gate-succes');
    const form = gate.querySelector('form');
    if (!form || !emailInput || !toestemmingInput) return;

    emailInput.id = emailInput.id || `${idBase}-email`;
    toestemmingInput.id = toestemmingInput.id || `${idBase}-toestemming`;
    if (toestemmingLabel) {
      toestemmingLabel.setAttribute('for', toestemmingInput.id);
      toestemmingLabel.innerHTML =
        `${brand.gate.toestemmingTekst} — ik ga akkoord met de <a class="link" href="/voorwaarden#privacy">${brand.gate.privacyLinkTekst}</a>.`;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!emailInput.value || !toestemmingInput.checked) {
        if (!toestemmingInput.checked) toestemmingInput.focus();
        return;
      }
      const record = {
        pagina: location.pathname,
        email: emailInput.value,
        toestemming: toestemmingInput.checked,
        tijdstip: new Date().toISOString(),
      };
      // eslint-disable-next-line no-console
      console.log('[DEMO gate-inzending]', record);
      const bestaand = JSON.parse(localStorage.getItem('demo-gate-inzendingen') || '[]');
      bestaand.push(record);
      localStorage.setItem('demo-gate-inzendingen', JSON.stringify(bestaand));

      if (succesEl) {
        succesEl.style.display = 'block';
        succesEl.textContent = 'Verstuurd (demo) — er is niets echt verzonden.';
      }
      window.alert('DEMO: er wordt geen echte e-mail verstuurd. Je gaat nu naar de bevestigingspagina.');
      window.location.href = '/bevestig';
    });
  });
}
