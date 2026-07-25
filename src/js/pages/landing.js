// Bootstrap voor de landingspagina: mini-widget van de vlaggenschiptool,
// toolkaarten, social proof en FAQ — allemaal client-side gerenderd.
import { brand, vulLijst } from '../main.js';
import { initWatHadJeNuGehadWidget } from '../tools/watHadJeNuGehad.js';

initWatHadJeNuGehadWidget(document.getElementById('landing-tool'));

const TOOLKAARTEN = [
  ['wat-had-je-nu-gehad', 'Wat had je nu gehad?', 'Reken een eenmalige inleg door met illustratieve reeksen.'],
  ['box-3', 'Box 3-tool', 'Bereken je box 3-belasting via het forfait plus tegenbewijs.'],
  ['inflatie', 'Inflatietool', 'Zie wat je geld aan koopkracht verliest over tijd.'],
];
vulLijst(document.getElementById('landing-tool-kaarten'), TOOLKAARTEN, ([slug, titel, tekst]) => {
  const a = document.createElement('a');
  a.className = 'card card-link';
  a.href = `/rekentools/${slug}`;
  a.innerHTML = `<h3>${titel}</h3><p class="text-muted">${tekst}</p><div class="card-meta"><span>Start &rarr;</span></div>`;
  return a;
});

const SOCIAL_PROOF = [
  '[PLACEHOLDER: voorbeeldcitaat 1]',
  '[PLACEHOLDER: voorbeeldcitaat 2]',
  '[PLACEHOLDER: voorbeeldcitaat 3]',
];
vulLijst(document.getElementById('social-proof-lijst'), SOCIAL_PROOF, (tekst) => {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `<p>&ldquo;${tekst}&rdquo;</p>`;
  return div;
});

const FAQ = [
  ['Is dit financieel advies?', 'Nee. Alle tools op deze site zijn educatief en illustratief — er wordt geen persoonlijk beleggingsadvies gegeven.'],
  ['Kost het iets om de tools te gebruiken?', 'Nee, alle rekentools zijn gratis te gebruiken.'],
  ['[PLACEHOLDER: vraag 3]', '[PLACEHOLDER: antwoord 3]'],
];
vulLijst(document.getElementById('faq-lijst'), FAQ, ([vraag, antwoord]) => {
  const details = document.createElement('details');
  details.className = 'accordion-item';
  details.innerHTML = `<summary>${vraag}</summary><div class="accordion-body">${antwoord}</div>`;
  return details;
});
