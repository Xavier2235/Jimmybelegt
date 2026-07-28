// Bootstrap voor de landingspagina: mini-widget van de vlaggenschiptool,
// toolkaarten, social proof en FAQ — allemaal client-side gerenderd.
//
// De social-proof-citaten en FAQ-vraag 3 zijn DEMO-tekst — duidelijk fictief
// (geen namen, geen achternamen, geen cijfers), bedoeld om de layout van deze
// verkoopdemo compleet te laten voelen. Vervang ze door echte reacties zodra
// die er zijn. Zoek op "DEMO-TEKST" om ze terug te vinden.
import { brand, vulLijst } from '../main.js';
import { initWatHadJeNuGehadWidget } from '../tools/watHadJeNuGehad.js';

initWatHadJeNuGehadWidget(document.getElementById('landing-tool'));

const TOOLKAARTEN = [
  ['01', 'wat-had-je-nu-gehad', 'Wat had je nu gehad?', 'Reken een eenmalige inleg door met illustratieve reeksen.'],
  ['02', 'box-3', 'Box 3-tool', 'Bereken je box 3-belasting via het forfait plus tegenbewijs.'],
  ['03', 'inflatie', 'Inflatietool', 'Zie wat je geld aan koopkracht verliest over tijd.'],
];
vulLijst(document.getElementById('landing-tool-kaarten'), TOOLKAARTEN, ([nr, slug, titel, tekst]) => {
  const a = document.createElement('a');
  a.className = 'card card-link';
  a.href = `/Jimmybelegt/rekentools/${slug}`;
  a.innerHTML = `<span class="card-num">${nr}</span><h3>${titel}</h3><p class="text-muted">${tekst}</p><div class="card-meta"><span>Start &rarr;</span></div>`;
  return a;
});

// DEMO-TEKST — fictieve, illustratieve citaten (geen echte gebruikers)
const SOCIAL_PROOF = [
  ['Eindelijk een tool die me niet meteen iets probeert te verkopen &mdash; ik snap nu tenminste waar ik sta.', 'M.', 'Rekentool-gebruiker'],
  ['Ik dacht dat box 3 alleen voor mensen met veel vermogen was. Bleek dus niet zo te zijn.', 'R.', 'Rekentool-gebruiker'],
  ['Kort, geen jargon, en ik kon meteen met mijn eigen cijfers spelen.', 'S.', 'Rekentool-gebruiker'],
];
vulLijst(document.getElementById('social-proof-lijst'), SOCIAL_PROOF, ([quote, naam, rol]) => {
  const div = document.createElement('div');
  div.className = 'card testimonial-card';
  div.innerHTML = `<p class="testimonial-quote">&ldquo;${quote}&rdquo;</p>
    <div class="testimonial-wie"><span class="testimonial-avatar" aria-hidden="true">${naam}</span><span class="text-muted fs-small">${rol}</span></div>`;
  return div;
});

const FAQ = [
  ['Is dit financieel advies?', 'Nee. Alle tools op deze site zijn educatief en illustratief — er wordt geen persoonlijk beleggingsadvies gegeven.'],
  ['Kost het iets om de tools te gebruiken?', 'Nee, alle rekentools zijn gratis te gebruiken.'],
  ['Waar komen de cijfers vandaan?', 'Bij de Box 3-tool uit de officiële 2026-parameters van de Belastingdienst (met bron en status per cijfer). Bij de andere tools stel je zelf de aannames in — die zijn nergens door ons als vaststaand feit gepresenteerd. Zie de <a class="link" href="/transparantie">transparantiepagina</a> voor het volledige overzicht.'],
];
vulLijst(document.getElementById('faq-lijst'), FAQ, ([vraag, antwoord]) => {
  const details = document.createElement('details');
  details.className = 'accordion-item';
  details.innerHTML = `<summary>${vraag}</summary><div class="accordion-body">${antwoord}</div>`;
  return details;
});
