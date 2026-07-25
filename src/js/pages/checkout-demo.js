// Nep-checkout: geen echte betaalintegratie. Klik op een betaalknop logt
// de demo-bestelling en stuurt door naar /bedankt.
document.querySelectorAll('[data-betaal]').forEach((knop) => {
  knop.addEventListener('click', () => {
    // eslint-disable-next-line no-console
    console.log('[DEMO checkout]', { methode: knop.textContent.trim(), tijdstip: new Date().toISOString() });
    window.location.href = '/bedankt';
  });
});
