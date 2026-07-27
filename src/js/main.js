// ============================================================
// main.js — wordt door ELKE pagina geladen. Init van merk, navigatie,
// DEMO-balk en de site-brede componenten (disclaimer, aannames-teller).
//
// EEN NIEUW MERK ACTIVEREN: verander alleen de twee importregels hieronder
// naar de map van het nieuwe merk. Verder hoeft niets aangepast te worden —
// zie README.md → "Nieuw merk toevoegen in 4 stappen".
// ============================================================
import '../brands/jim/tokens.css';
import brandDataRaw from '../brands/jim/brand.json';

import '../css/reset.css';
import '../css/base.css';
import '../css/components.css';

import { initDemobar } from './components/demobar.js';
import { initDisclaimers } from './components/disclaimer.js';
import { initAccordions } from './components/accordion.js';
import { initGates } from './components/gate.js';
import { initScrollReveal } from './components/scrollReveal.js';

export const brand = brandDataRaw;

// ---------- data-brand injectie ----------
// <span data-brand="hero.claim"></span>  → textContent = brand.hero.claim
// <a data-brand-href="instagramUrl">      → href = brand.instagramUrl
function padOphalen(obj, pad) {
  return pad.split('.').reduce((acc, sleutel) => (acc == null ? acc : acc[sleutel]), obj);
}

function injecteerBrandData() {
  document.querySelectorAll('[data-brand]').forEach((elNode) => {
    const waarde = padOphalen(brand, elNode.getAttribute('data-brand'));
    if (waarde != null) elNode.textContent = waarde;
  });
  document.querySelectorAll('[data-brand-href]').forEach((elNode) => {
    const waarde = padOphalen(brand, elNode.getAttribute('data-brand-href'));
    if (waarde == null) return;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waarde);
    elNode.setAttribute('href', isEmail ? `mailto:${waarde}` : waarde);
  });
  document.title = document.title.replace('{{merk}}', brand.naam);
}

// Helper voor pagina-specifieke scripts om een array uit brand.json als
// lijst te renderen zonder dat de generieke injector arrays hoeft te snappen.
export function vulLijst(container, items, renderItem) {
  if (!container) return;
  container.innerHTML = '';
  items.forEach((item, i) => container.appendChild(renderItem(item, i)));
}

// ---------- navigatie ----------
function initNavigatie() {
  const toggle = document.querySelector('.nav-toggle');
  const mobielMenu = document.querySelector('.mobile-nav');
  toggle?.addEventListener('click', () => {
    const open = mobielMenu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  const huidigPad = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach((a) => {
    const linkPad = new URL(a.href, window.location.origin).pathname.replace(/\/$/, '') || '/';
    if (linkPad === huidigPad) a.setAttribute('aria-current', 'page');
  });
}

function init() {
  injecteerBrandData();
  initNavigatie();
  initDemobar(brand);
  initDisclaimers(brand);
  initAccordions();
  initGates(brand);
  initScrollReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
