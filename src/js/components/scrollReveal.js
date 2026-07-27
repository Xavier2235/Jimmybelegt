// Zachte fade-up bij scroll voor secties ná de eerste (die staat al in beeld
// bij het laden, dus die slaan we over om een flits te voorkomen).
// Progressive enhancement: zonder JS blijft alles gewoon zichtbaar, want de
// 'reveal'-klasse (en daarmee opacity:0) wordt uitsluitend hier toegevoegd.
export function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const doelen = Array.from(document.querySelectorAll('main .section')).slice(1)
    .flatMap((sectie) => Array.from(sectie.querySelectorAll(':scope > .wrap, :scope > .wrap-wide')))
    .flatMap((wrap) => Array.from(wrap.children));

  if (!doelen.length || !('IntersectionObserver' in window)) return;

  doelen.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });

  doelen.forEach((el) => observer.observe(el));
}
