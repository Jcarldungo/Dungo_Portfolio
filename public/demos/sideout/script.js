document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
  navigation?.classList.toggle('is-open', open);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  const label = menuButton?.querySelector('.sr-only');
  if (label) label.textContent = 'Open menu';
}));

const dayButtons = [...document.querySelectorAll('.day-button')];
const typeButtons = [...document.querySelectorAll('.type-button')];
const sessionRows = [...document.querySelectorAll('.session-row')];
let selectedDay = 'all';
let selectedType = 'all';
const updateSessions = () => {
  let visibleCount = 0;
  sessionRows.forEach((row) => {
    const matches = (selectedDay === 'all' || row.dataset.sessionDay === selectedDay)
      && (selectedType === 'all' || row.dataset.sessionType === selectedType);
    row.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  document.querySelector('.no-sessions').hidden = visibleCount > 0;
};
dayButtons.forEach((button) => button.addEventListener('click', () => {
  selectedDay = button.dataset.day;
  dayButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  updateSessions();
}));
typeButtons.forEach((button) => button.addEventListener('click', () => {
  selectedType = button.dataset.type;
  typeButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  updateSessions();
}));

const dialog = document.querySelector('.booking-dialog');
const form = document.querySelector('.booking-form');
const completion = document.querySelector('.booking-complete');
const selectedSession = document.querySelector('.selected-session');
document.querySelectorAll('.reserve-button').forEach((button) => button.addEventListener('click', () => {
  selectedSession.textContent = button.dataset.session;
  form.reset();
  form.hidden = false;
  completion.hidden = true;
  dialog.showModal();
  document.querySelector('#guest-name').focus();
}));
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
document.querySelector('.done-button')?.addEventListener('click', () => dialog.close());
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  form.hidden = true;
  completion.hidden = false;
  completion.querySelector('h3').focus();
});
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
