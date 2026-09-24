// UI only. Authentication, entitlements and payments must be provided by the client's backend.
// Never treat these controls or a local browser flag as authorization to access paid media.
const library = document.querySelector('.library-catalogue');
if (library) {
  let category = 'all';
  const search = library.querySelector('#course-search');
  const normalize = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const updateCatalogue = () => {
    const query = normalize(search.value.trim());
    let visible = 0;
    library.querySelectorAll('[data-video-card]').forEach((card) => {
      const matchesCategory = category === 'all' || card.dataset.category === category;
      card.hidden = !matchesCategory || !normalize(card.dataset.title).includes(query);
      if (!card.hidden) visible++;
    });
    library.querySelectorAll('[data-video-shelf]').forEach((shelf) => {
      shelf.hidden = ![...shelf.querySelectorAll('[data-video-card]')].some((card) => !card.hidden);
    });
    library.querySelector('.library-empty').hidden = visible !== 0;
    library.querySelector('.library-results').textContent =
      `${visible} ${visible === 1 ? 'contenido disponible' : 'contenidos disponibles'}`;
  };
  library.querySelectorAll('[data-library-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      category = button.dataset.libraryFilter;
      library
        .querySelectorAll('[data-library-filter]')
        .forEach((control) => control.setAttribute('aria-pressed', String(control === button)));
      updateCatalogue();
    });
  });
  search.addEventListener('input', updateCatalogue);
}

const courseData = document.querySelector('#community-course-data');
if (courseData) {
  const courses = JSON.parse(courseData.textContent);
  const id = new URLSearchParams(location.search).get('curso');
  const course = courses.find((item) => item.id === id) || courses[0];
  let lessonIndex = 0;
  document.querySelector('#classroom-title').textContent = course.title;
  document.querySelector('#classroom-description').textContent = course.description;
  document.querySelector('#lesson-description').textContent = course.description;
  document.querySelector('#lesson-count').textContent = `${course.lessons.length} lecciones`;
  document.title = `${course.title} | Comunidad On Track`;
  const poster = document.querySelector('#classroom-poster');
  poster.querySelector('source')?.remove();
  const posterImage = poster.querySelector('img');
  posterImage.removeAttribute('srcset');
  posterImage.src = course.poster;
  posterImage.alt = course.title;
  const list = document.querySelector('#lesson-list');
  list.replaceChildren();
  course.lessons.forEach((lesson, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.lesson = String(index);
    for (const text of [String(index + 1).padStart(2, '0'), lesson, '▶']) {
      const span = document.createElement('span');
      span.textContent = text;
      button.append(span);
    }
    button.lastElementChild.setAttribute('aria-hidden', 'true');
    item.append(button);
    list.append(item);
  });
  const updateLesson = (announce = true) => {
    document.querySelector('#lesson-position').textContent =
      `LECCIÓN ${String(lessonIndex + 1).padStart(2, '0')}`;
    document.querySelector('#lesson-title').textContent = course.lessons[lessonIndex];
    list.querySelectorAll('button').forEach((button, index) => {
      if (index === lessonIndex) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    document.querySelector('#next-lesson').disabled = lessonIndex === course.lessons.length - 1;
    if (announce)
      document.querySelector('#lesson-status').textContent =
        `Lección seleccionada: ${course.lessons[lessonIndex]}. Acceso al vídeo con membresía.`;
  };
  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-lesson]');
    if (!button) return;
    lessonIndex = Number(button.dataset.lesson);
    updateLesson();
  });
  document.querySelector('#next-lesson').addEventListener('click', () => {
    if (lessonIndex < course.lessons.length - 1) lessonIndex++;
    updateLesson();
  });
  updateLesson(false);
}

document.querySelectorAll('[data-membership-form], [data-member-login]').forEach((form) => {
  const feedback = form.querySelector('.membership-feedback');
  form.querySelector('[type="submit"]').disabled = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    // No network request, charge, account creation or local credential storage in this preview.
    const password = form.querySelector('input[type="password"], #login-password');
    if (password) password.value = '';
    feedback.hidden = false;
    feedback.tabIndex = -1;
    feedback.focus();
  });
  form.addEventListener('input', () => {
    feedback.hidden = true;
  });
});
document.querySelector('[data-password-toggle]')?.addEventListener('click', (event) => {
  const button = event.currentTarget;
  const input = document.getElementById(button.getAttribute('aria-controls'));
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.textContent = show ? 'Ocultar' : 'Mostrar';
  button.setAttribute('aria-pressed', String(show));
});
