import { brand } from '../main.js';
import { initCoachingAanvraagFormulier } from '../components/multiStepForm.js';

const form = document.getElementById('aanvraag-formulier');
if (form) {
  initCoachingAanvraagFormulier(form, brand);
  const verwachting = document.getElementById('verwachting');
  const teller = document.getElementById('char-count');
  verwachting?.addEventListener('input', () => { teller.textContent = String(verwachting.value.length); });
}
