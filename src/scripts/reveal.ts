const REVEAL_THRESHOLD = 0.12;

export function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');
  if (targets.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: REVEAL_THRESHOLD },
  );

  targets.forEach((el) => observer.observe(el));
}
