const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
function closeMenu(returnFocus = false) {
  navigation?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.innerHTML = 'Menú <span aria-hidden="true">+</span>';
  if (returnFocus) menuButton?.focus();
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.innerHTML = open
    ? 'Cerrar <span aria-hidden="true">−</span>'
    : 'Menú <span aria-hidden="true">+</span>';
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true')
    closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document
      .querySelectorAll('[data-filter]')
      .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    document.querySelectorAll('.projects-list .project-card').forEach((card) => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) count++;
    });
    const status = document.querySelector('.result-count');
    if (status) status.textContent = `${count} ${count === 1 ? 'nota' : 'notas'} en esta selección`;
  });
});
const contactForm = document.querySelector('#project-form');
if (contactForm) {
  document.querySelector('#prepare-consultation').disabled = false;
  const requestedInterest = new URLSearchParams(location.search).get('interes');
  const interest = ['wrapping', 'ppf'].includes(requestedInterest)
    ? 'presencial'
    : requestedInterest;
  const select = contactForm.elements.interes;
  if ([...select.options].some((option) => option.value === interest)) select.value = interest;
  const reference = new URLSearchParams(location.search).get('referencia');
  if (reference) contactForm.elements.referencia.value = reference.slice(0, 120);
  else if (requestedInterest === 'wrapping')
    contactForm.elements.referencia.value = 'Formación en wrapping';
  else if (requestedInterest === 'ppf') contactForm.elements.referencia.value = 'Clear PPF';
  contactForm.addEventListener('input', () => {
    document.querySelector('#form-result').hidden = true;
  });
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = String(data.get('nombre')).trim();
    const message = String(data.get('mensaje')).trim();
    if (!name || !message) {
      const field = !name ? contactForm.elements.nombre : contactForm.elements.mensaje;
      field.setCustomValidity('Escribe algo más que espacios.');
      field.reportValidity();
      field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
      return;
    }
    const label = select.options[select.selectedIndex].text;
    const reference = String(data.get('referencia') || '').trim();
    const experience = String(data.get('experiencia') || '').trim();
    const text = `Hola, Track Creativo. Soy ${name}.\nMe interesa: ${label}.${reference ? `\nCurso, técnica o material: ${reference}` : ''}${experience ? `\nMi experiencia: ${experience}` : ''}\n\n${message}`;
    const result = document.querySelector('#form-result');
    document
      .querySelector('#whatsapp-link')
      .setAttribute('href', `https://wa.me/34655588489?text=${encodeURIComponent(text)}`);
    result.hidden = false;
    result.focus();
  });
}

document.querySelectorAll('.course-finder').forEach((finder) => {
  finder.querySelectorAll('[data-path]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.path;
      finder
        .querySelectorAll('[data-path]')
        .forEach((control) => control.setAttribute('aria-pressed', String(control === button)));
      finder.querySelectorAll('[data-path-panel]').forEach((panel) => {
        const active = panel.dataset.pathPanel === selected;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
      const panel = finder.querySelector(`[data-path-panel="${selected}"]`);
      const titles = [...panel.querySelectorAll('h4')].map((heading) => heading.textContent);
      finder.querySelector('.finder-status').textContent =
        `Programas para explorar: ${titles.join(' y ')}.`;
    });
  });
});

document.querySelectorAll('.observation-lab').forEach((lab) => {
  lab.querySelectorAll('[data-observation]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.observation;
      lab
        .querySelectorAll('[data-observation]')
        .forEach((control) =>
          control.setAttribute('aria-pressed', String(control.dataset.observation === selected)),
        );
      lab.querySelectorAll('[data-observation-panel]').forEach((panel) => {
        const active = panel.dataset.observationPanel === selected;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
      lab.querySelector('.observation-status').textContent = lab.querySelector(
        `[data-observation-panel="${selected}"] h3`,
      ).textContent;
    });
  });
});
