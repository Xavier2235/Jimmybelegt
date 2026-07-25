// Zet de invoer van een tool in de querystring en leest 'm terug, zodat een
// gedeelde link exact dezelfde uitkomst toont. Puur client-side, geen server.
export function leesQuery() {
  return new URLSearchParams(window.location.search);
}

export function schrijfQuery(obj) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') params.set(k, v); });
  const url = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', url);
  return url;
}

export function initDeelKnop(knopEl, verzamelState) {
  if (!knopEl) return;
  knopEl.addEventListener('click', async () => {
    const state = verzamelState();
    const pad = schrijfQuery(state);
    const volledigeUrl = `${window.location.origin}${pad}`;
    try {
      await navigator.clipboard.writeText(volledigeUrl);
    } catch {
      // Klembord kan geweigerd worden (bijv. geen HTTPS-context bij lokaal testen) — link staat al in de adresbalk.
    }
    const bevestiging = knopEl.parentElement?.querySelector('.kopie-bevestiging');
    if (bevestiging) {
      bevestiging.style.display = 'inline';
      window.clearTimeout(bevestiging._timer);
      bevestiging._timer = window.setTimeout(() => { bevestiging.style.display = 'none'; }, 2500);
    }
  });
}
