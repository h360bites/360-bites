const revealItems = document.querySelectorAll('.reveal');

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

    if (isOpen) {
      mainNav.style.display = 'flex';
      mainNav.style.position = 'absolute';
      mainNav.style.top = '82px';
      mainNav.style.left = '16px';
      mainNav.style.right = '16px';
      mainNav.style.padding = '16px';
      mainNav.style.background = 'rgba(17, 28, 49, 0.96)';
      mainNav.style.border = '1px solid rgba(255, 255, 255, 0.12)';
      mainNav.style.borderRadius = '18px';
      mainNav.style.flexDirection = 'column';
      mainNav.style.alignItems = 'flex-start';
    } else {
      mainNav.style.display = '';
      mainNav.style.position = '';
      mainNav.style.top = '';
      mainNav.style.left = '';
      mainNav.style.right = '';
      mainNav.style.padding = '';
      mainNav.style.background = '';
      mainNav.style.border = '';
      mainNav.style.borderRadius = '';
      mainNav.style.flexDirection = '';
      mainNav.style.alignItems = '';
    }
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

document.querySelectorAll('[data-contact-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.querySelector('[name="name"]')?.value || 'there';
    const email = form.querySelector('[name="email"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
      modalTitle.textContent = `Thanks, ${name}!`;
    }

    const modalText = contactModal?.querySelector('p');
    if (modalText) {
      modalText.textContent = `Your message has been received${email ? ' from ' + email : ''}. I will respond soon.\n\n${message}`;
    }

    openModal();
    form.reset();
  });
});
