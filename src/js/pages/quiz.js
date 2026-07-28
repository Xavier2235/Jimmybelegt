// Beleggersprofiel-quiz — puur voor demo/engagement, geen echt risicoprofiel.
// Score 0-2 per vraag, 5 vragen -> totaal 0-10, verdeeld over 3 profielen.
import { initMeerstapsFormulier } from '../components/multiStepForm.js';

const form = document.getElementById('quiz-formulier');
if (form) {
  const motor = initMeerstapsFormulier(form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!motor.huidigeStapGeldig()) return;

    const data = new FormData(form);
    let totaal = 0;
    for (let i = 1; i <= 5; i += 1) totaal += Number(data.get(`q${i}`) ?? 0);

    const profiel = totaal <= 3 ? 'voorzichtig' : totaal <= 6 ? 'gebalanceerd' : 'ambitieus';

    form.hidden = true;
    document.querySelector('.form-voortgang')?.setAttribute('hidden', '');
    const resultaat = document.querySelector(`[data-profiel="${profiel}"]`);
    if (resultaat) {
      resultaat.hidden = false;
      resultaat.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}
