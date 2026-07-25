// Drie tabs op één pagina — pure client-side tab-switching, toegankelijk
// via role="tablist"/"tab"/"tabpanel" en de bijbehorende ARIA-koppelingen.
const tabs = document.querySelectorAll('[role="tab"]');
const panelen = document.querySelectorAll('[role="tabpanel"]');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    panelen.forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  });
});

if (window.location.hash) {
  const doelTab = document.getElementById(`tabknop-${window.location.hash.slice(1)}`);
  doelTab?.click();
}
