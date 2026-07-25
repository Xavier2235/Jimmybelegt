// Generieke stap-motor: voortgangsbalk, stapnavigatie, per-stap validatie.
// De kwalificatiescore voor het coachingformulier staat onderaan dit bestand —
// dat is de enige plek waar bedrijfslogica (de score) hoort, los van de motor.

export function initMeerstapsFormulier(form) {
  const stappen = Array.from(form.querySelectorAll('.form-stap'));
  const bollen = Array.from(form.querySelectorAll('.form-voortgang .stap-bol'));
  let huidig = 0;

  function render() {
    stappen.forEach((s, i) => s.classList.toggle('actief', i === huidig));
    bollen.forEach((b, i) => {
      b.classList.toggle('actief', i === huidig);
      b.classList.toggle('voltooid', i < huidig);
    });
    form.querySelectorAll('[data-stap-terug]').forEach((btn) => { btn.hidden = huidig === 0; });
  }

  function stapGeldig(index) {
    const velden = stappen[index].querySelectorAll('input[required], textarea[required]');
    for (const veld of velden) {
      if (veld.type === 'radio') {
        const groep = stappen[index].querySelectorAll(`input[name="${veld.name}"]`);
        if (!Array.from(groep).some((r) => r.checked)) { veld.focus(); return false; }
      } else if (veld.type === 'checkbox' && !veld.checked) {
        veld.focus(); return false;
      } else if (!veld.value.trim()) {
        veld.focus(); return false;
      }
    }
    return true;
  }

  form.querySelectorAll('[data-stap-volgende]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!stapGeldig(huidig)) {
        btn.closest('.form-stap')?.reportValidity?.();
        return;
      }
      if (huidig < stappen.length - 1) { huidig += 1; render(); window.scrollTo({ top: form.offsetTop - 80, behavior: 'smooth' }); }
    });
  });
  form.querySelectorAll('[data-stap-terug]').forEach((btn) => {
    btn.addEventListener('click', () => { if (huidig > 0) { huidig -= 1; render(); } });
  });

  render();
  return {
    isLaatsteStap: () => huidig === stappen.length - 1,
    huidigeStapGeldig: () => stapGeldig(huidig),
  };
}

/* ---------------------------------------------------------------
   Kwalificatiescore voor /coaching/aanvraag — 0 t/m 100, opgebouwd
   uit drie invoerwaarden. De puntenverdeling staat hier expliciet en
   leesbaar; de drempel komt uit brand.json (coaching.scoreDrempel).
--------------------------------------------------------------- */
export const SCOREPUNTEN = {
  ervaring: { geen: 0, 'minder-dan-1-jaar': 10, '1-3-jaar': 20, 'meer-dan-3-jaar': 30 },
  risicokapitaal: { 'onder-5000': 0, '5000-25000': 15, '25000-100000': 30, 'boven-100000': 40 },
  tijd: { 'onder-2-uur': 0, '2-5-uur': 10, '5-10-uur': 20, 'boven-10-uur': 30 },
};

export function berekenKwalificatieScore(form) {
  const waarde = (naam) => form.querySelector(`input[name="${naam}"]:checked`)?.value;
  const ervaring = SCOREPUNTEN.ervaring[waarde('ervaring')] ?? 0;
  const kapitaal = SCOREPUNTEN.risicokapitaal[waarde('risicokapitaal')] ?? 0;
  const tijd = SCOREPUNTEN.tijd[waarde('tijd')] ?? 0;
  return { totaal: ervaring + kapitaal + tijd, ervaring, kapitaal, tijd };
}

export function initCoachingAanvraagFormulier(form, brand) {
  const motor = initMeerstapsFormulier(form);
  const drempel = brand.coaching.scoreDrempel;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!motor.huidigeStapGeldig()) return;

    const data = new FormData(form);
    const score = berekenKwalificatieScore(form);
    const record = {
      antwoorden: Object.fromEntries(data.entries()),
      score,
      tijdstip: new Date().toISOString(),
    };
    // eslint-disable-next-line no-console
    console.log('[DEMO coaching-aanvraag]', record);
    const bestaand = JSON.parse(localStorage.getItem('demo-coaching-aanvragen') || '[]');
    bestaand.push(record);
    localStorage.setItem('demo-coaching-aanvragen', JSON.stringify(bestaand));

    const gekwalificeerd = score.totaal >= drempel;
    form.hidden = true;
    document.querySelector('.form-voortgang')?.setAttribute('hidden', '');
    const gekwalificeerdScherm = document.querySelector('[data-resultaat="gekwalificeerd"]');
    const vervolgScherm = document.querySelector('[data-resultaat="vervolg"]');
    if (gekwalificeerd && gekwalificeerdScherm) {
      gekwalificeerdScherm.hidden = false;
    } else if (vervolgScherm) {
      vervolgScherm.hidden = false;
    }
  });
}
