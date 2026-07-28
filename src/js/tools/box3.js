// Tool 2 — Box 3-berekening (forfaitaire spaarvariant, 2026-parameters).
// Elk gebruikt cijfer komt uit params-box3-2026.json met bron + status.
// Tweede kolom = tegenbewijsregeling op basis van het WERKELIJKE rendement
// dat de gebruiker zelf opgeeft (geen door ons aangenomen percentage).
import params from '../../data/params-box3-2026.json';
import { koppelRangeVelden } from '../components/rangeInput.js';
import { maakSourceInfo } from '../components/sourceInfo.js';
import { tekenGestapeldeStaven } from '../components/chart.js';
import { initMeerstapsFormulier } from '../components/multiStepForm.js';
import { euro, percentage } from '../format.js';

// Vermogen-bucket (uit de intake) -> indicatief totaalbedrag, en de
// verdelingskeuze -> spaargeld/beleggingen-aandeel. Puur voor het vooraf
// invullen van de calculator — de calculator zelf blijft daarna volledig
// aanpasbaar, niets wordt vastgezet.
const VERMOGEN_BEDRAG = { klein: 30000, midden: 100000, groot: 300000, 'zeer-groot': 750000 };
const VERDELING_AANDEEL_SPAARGELD = { spaargeld: 0.7, gelijk: 0.5, beleggingen: 0.3 };

function initBox3Intake(root) {
  const form = root.querySelector('#box3-intake');
  const resultaatDelen = Array.from(root.querySelectorAll('[data-box3-resultaat]'));
  if (!form || !resultaatDelen.length) return;

  const motor = initMeerstapsFormulier(form);
  const waarde = (naam) => form.querySelector(`input[name="${naam}"]:checked`)?.value;

  function zetVeld(naam, nieuweWaarde) {
    const input = root.querySelector(`[data-veld="${naam}"] input[type="range"]`);
    if (!input) return;
    input.value = String(Math.round(nieuweWaarde));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function toonResultaat() {
    form.hidden = true;
    resultaatDelen.forEach((el) => { el.hidden = false; });
    resultaatDelen[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!motor.huidigeStapGeldig()) return;

    const totaal = VERMOGEN_BEDRAG[waarde('intake-vermogen')] ?? 50000;
    const aandeelSpaargeld = VERDELING_AANDEEL_SPAARGELD[waarde('intake-verdeling')] ?? 0.5;
    const beleggingen = totaal * (1 - aandeelSpaargeld);

    zetVeld('spaargeld', totaal * aandeelSpaargeld);
    zetVeld('beleggingen', beleggingen);
    zetVeld('groene-beleggingen', waarde('intake-groen') === 'ja' ? Math.min(beleggingen * 0.2, 100000) : 0);
    zetVeld('schulden', waarde('intake-schulden') === 'ja' ? 10000 : 0);

    const partnerInput = root.querySelector(`input[name="fiscaal-partner"][value="${waarde('intake-partner') === 'ja' ? 'ja' : 'nee'}"]`);
    if (partnerInput) { partnerInput.checked = true; partnerInput.dispatchEvent(new Event('change', { bubbles: true })); }

    toonResultaat();
  });

  root.querySelector('#box3-intake-overslaan')?.addEventListener('click', toonResultaat);
}

function berekenBox3(input) {
  const partner = input.fiscaalPartner;
  const heffingsvrij = partner ? params.heffingsvrijVermogenFiscalePartners.waarde : params.heffingsvrijVermogen.waarde;
  const drempel = partner ? params.schuldendrempel.fiscalePartners : params.schuldendrempel.alleenstaand;
  const vrijstellingGroen = partner ? params.vrijstellingGroenBeleggen.fiscalePartners : params.vrijstellingGroenBeleggen.alleenstaand;

  const groenVrijgesteld = Math.min(input.groeneBeleggingen, vrijstellingGroen);
  const belegBelastbaar = Math.max(0, input.beleggingen - groenVrijgesteld);
  const schuldenAftrekbaar = Math.max(0, input.schulden - drempel);

  const bezittingen = input.spaargeld + input.beleggingen;
  const grondslagVoorVrijstelling = Math.max(0, bezittingen - schuldenAftrekbaar);
  const grondslagNaVrijstelling = Math.max(0, grondslagVoorVrijstelling - heffingsvrij);
  const verhouding = grondslagVoorVrijstelling > 0 ? grondslagNaVrijstelling / grondslagVoorVrijstelling : 0;

  const forfaitEuro = input.spaargeld * params.forfaitBanktegoeden.waarde
    + belegBelastbaar * params.forfaitBeleggingen.waarde
    - schuldenAftrekbaar * params.forfaitSchulden.waarde;
  const forfaitPercentage = grondslagVoorVrijstelling > 0 ? (forfaitEuro / grondslagVoorVrijstelling) * 100 : 0;

  const voordeelBelast = Math.max(0, forfaitEuro) * verhouding;
  const belasting = voordeelBelast * params.tarief.waarde;
  const effectieveDruk = grondslagVoorVrijstelling > 0 ? (belasting / grondslagVoorVrijstelling) * 100 : 0;

  // Tegenbewijs: zelfde verhouding toegepast op het werkelijke rendement.
  const werkelijkRendementEuro = grondslagVoorVrijstelling * (input.werkelijkRendement / 100);
  const werkelijkVoordeelBelast = Math.max(0, werkelijkRendementEuro) * verhouding;
  const werkelijkBelasting = werkelijkVoordeelBelast * params.tarief.waarde;

  return {
    grondslagVoorVrijstelling, grondslagNaVrijstelling, forfaitEuro, forfaitPercentage,
    belasting, effectieveDruk, werkelijkBelasting, heffingsvrij,
  };
}

export function initBox3Pagina() {
  const root = document.querySelector('[data-tool="box-3"]');
  if (!root) return;
  koppelRangeVelden(root);
  initBox3Intake(root);

  const veld = (naam) => root.querySelector(`[data-veld="${naam}"] input[type="range"]`);
  const partnerInputs = root.querySelectorAll('input[name="fiscaal-partner"]');

  function lees() {
    return {
      spaargeld: Number(veld('spaargeld').value),
      beleggingen: Number(veld('beleggingen').value),
      schulden: Number(veld('schulden').value),
      groeneBeleggingen: Number(veld('groene-beleggingen').value),
      werkelijkRendement: Number(veld('werkelijk-rendement').value),
      fiscaalPartner: Array.from(partnerInputs).find((r) => r.checked)?.value === 'ja',
    };
  }

  const chartContainer = root.querySelector('[data-uitvoer="grafiek"]');

  function herberekenen() {
    const input = lees();
    const uit = berekenBox3(input);
    root.querySelector('[data-uitvoer="belasting-forfait"]').textContent = euro(uit.belasting);
    root.querySelector('[data-uitvoer="belasting-werkelijk"]').textContent = euro(uit.werkelijkBelasting);
    root.querySelector('[data-uitvoer="druk"]').textContent = percentage(uit.effectieveDruk);
    root.querySelector('[data-uitvoer="grondslag"]').textContent = euro(uit.grondslagNaVrijstelling);
    root.querySelector('[data-uitvoer="forfait-percentage"]').textContent = percentage(uit.forfaitPercentage);

    if (chartContainer) {
      tekenGestapeldeStaven(chartContainer, {
        categorieen: [
          { label: 'Forfait', segmenten: [{ naam: 'Belasting', waarde: uit.belasting, kleur: 'var(--c-chart-groei)' }] },
          { label: 'Tegenbewijs', segmenten: [{ naam: 'Belasting', waarde: uit.werkelijkBelasting, kleur: 'var(--c-accent)' }] },
        ],
      });
    }

    const tegenbewijsMelding = root.querySelector('[data-uitvoer="tegenbewijs-melding"]');
    if (input.werkelijkRendement < uit.forfaitPercentage) {
      tegenbewijsMelding.textContent = `Jouw werkelijke rendement (${percentage(input.werkelijkRendement)}) ligt onder het forfaitaire percentage (${percentage(uit.forfaitPercentage)}) — de tegenbewijsregeling kan in jouw voordeel werken.`;
      tegenbewijsMelding.className = 'pill pill-status-positief';
    } else {
      tegenbewijsMelding.textContent = `Jouw werkelijke rendement (${percentage(input.werkelijkRendement)}) ligt niet onder het forfaitaire percentage — tegenbewijs levert hier geen voordeel op.`;
      tegenbewijsMelding.className = 'pill pill-neutraal';
    }
  }

  root.addEventListener('veldwijziging', herberekenen);
  partnerInputs.forEach((r) => r.addEventListener('change', herberekenen));

  // Bronvermelding per gebruikt parameter
  const bronLijst = root.querySelector('[data-uitvoer="bronnenlijst"]');
  if (bronLijst) {
    const rijen = [
      ['Tarief box 3', percentage(params.tarief.waarde * 100), params.tarief],
      ['Heffingsvrij vermogen (alleenstaand)', euro(params.heffingsvrijVermogen.waarde), params.heffingsvrijVermogen],
      ['Forfait banktegoeden', percentage(params.forfaitBanktegoeden.waarde * 100), params.forfaitBanktegoeden],
      ['Forfait beleggingen', percentage(params.forfaitBeleggingen.waarde * 100), params.forfaitBeleggingen],
      ['Forfait schulden', percentage(params.forfaitSchulden.waarde * 100), params.forfaitSchulden],
      ['Schuldendrempel (alleenstaand)', euro(params.schuldendrempel.alleenstaand), params.schuldendrempel],
      ['Vrijstelling groen beleggen (alleenstaand)', euro(params.vrijstellingGroenBeleggen.alleenstaand), params.vrijstellingGroenBeleggen],
    ];
    rijen.forEach(([naam, waarde, p]) => {
      const li = document.createElement('li');
      li.className = 'order-rij';
      const span = document.createElement('span');
      span.append(`${naam}: ${waarde}`, maakSourceInfo({ bron: p.bron, status: p.status, toelichting: p.toelichting }));
      li.append(span);
      bronLijst.append(li);
    });
  }

  herberekenen();
}
