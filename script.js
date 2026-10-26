const revealItems = document.querySelectorAll('.reveal');

const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = themeToggle?.querySelector('.theme-label');

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeLabel && themeToggle) {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    themeLabel.textContent = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`;
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
  }
}

setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  localStorage.setItem('site-theme', nextTheme);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('mobile-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
}

const slides = document.querySelectorAll('.hero-slide');
if (slides.length) {
  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 3500);
}

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.case-study');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));

    portfolioCards.forEach((card) => {
      const matches = selected === 'all' || card.dataset.category === selected;
      card.style.display = matches ? '' : 'none';
    });
  });
});

const modalMarkup = `
  <div class="contact-modal" id="contactModal" aria-hidden="true">
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <h3 id="modalTitle">Message sent</h3>
      <p>Thank you for reaching out. Momodu Hamza will get back to you shortly.</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" data-close-modal>Close</button>
      </div>
    </div>
  </div>
`;

if (!document.getElementById('contactModal')) {
  document.body.insertAdjacentHTML('beforeend', modalMarkup);
}

const contactModal = document.getElementById('contactModal');

function openModal() {
  if (contactModal) {
    contactModal.classList.add('active');
    contactModal.setAttribute('aria-hidden', 'false');
  }
}

function closeModal() {
  if (contactModal) {
    contactModal.classList.remove('active');
    contactModal.setAttribute('aria-hidden', 'true');
  }
}

document.querySelectorAll('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', openModal);
});

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', closeModal);
});

contactModal?.addEventListener('click', (event) => {
  if (event.target === contactModal) {
    closeModal();
  }
});

function setFormFeedback(form, type, message) {
  const feedback = form.querySelector('.form-feedback');
  if (!feedback) return;

  feedback.classList.remove('success', 'error');
  feedback.classList.add(type);
  feedback.textContent = message;
  feedback.hidden = false;
}

document.querySelectorAll('[data-contact-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim() || '';
    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
    const service = form.querySelector('[name="service"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value.trim() || '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) {
      setFormFeedback(form, 'error', 'Please enter your full name.');
      return;
    }

    if (!emailPattern.test(email)) {
      setFormFeedback(form, 'error', 'Please enter a valid email address.');
      return;
    }

    if (service === '') {
      setFormFeedback(form, 'error', 'Please select the service you need.');
      return;
    }

    if (message.length < 10) {
      setFormFeedback(form, 'error', 'Please add a short project description with at least 10 characters.');
      return;
    }

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = `Thanks, ${name}!`;
    }

    const modalText = contactModal?.querySelector('p');
    if (modalText) {
      const contactSummary = phone ? ` from ${email} (${phone})` : ` from ${email}`;
      modalText.textContent = `Your inquiry for ${service} has been drafted${contactSummary}. I will review your project details and respond soon.\n\n${message}`;
    }

    setFormFeedback(form, 'success', 'Your message is ready to send. I will get back to you soon.');
    openModal();
    form.reset();
  });
});
