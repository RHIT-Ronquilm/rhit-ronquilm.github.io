/* ============================================================
   PORTFOLIO — script.js
   Shared logic for all pages.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------
    // MOBILE NAV TOGGLE
    // --------------------------------------------------------
    const hamburger = document.querySelector('.nav-hamburger');
    const navbar    = document.querySelector('.navbar');

    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
        });

        // Close mobile menu when a nav link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('menu-open');
            });
        });
    }

    // --------------------------------------------------------
    // PROJECTS PAGE — Accordion
    // Opens project info above the grid without navigating away.
    // --------------------------------------------------------
    const accordion = document.getElementById('projectAccordion');
    const accClose  = document.getElementById('accordionClose');
    const accTitle  = document.getElementById('accTitle');
    const accTag    = document.getElementById('accTag');
    const accDesc   = document.getElementById('accDesc');
    const accExtra  = document.getElementById('accExtra');
    const accImage  = document.getElementById('accImage');
    const grid      = document.getElementById('projectGrid');

    const projectCards = document.querySelectorAll('.project-card[data-title]');

    let activeCard = null;

    if (accordion && projectCards.length) {

        function openAccordion(card) {
            accTitle.textContent = card.dataset.title;
            accTag.textContent   = card.dataset.tag;
            accDesc.textContent  = card.dataset.desc;
            accExtra.innerHTML   = card.dataset.extra || '';
            if (accImage) accImage.src = card.dataset.img || '';

            if (activeCard) activeCard.classList.remove('project-card--active');
            card.classList.add('project-card--active');
            activeCard = card;

            grid.before(accordion);
            accordion.style.display = 'block';
        }

        function closeAccordion() {
            accordion.style.display = 'none';
            if (activeCard) {
                activeCard.classList.remove('project-card--active');
                activeCard = null;
            }
        }

        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                if (activeCard === card) {
                    closeAccordion();
                } else {
                    openAccordion(card);
                }
            });
        });

        if (accClose) {
            accClose.addEventListener('click', closeAccordion);
        }
    }
    // --------------------------------------------------------
    // CONTACT FORM — mailto fallback
    // Builds a mailto: link and opens the user's email client.
    // --------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formStatus  = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('contactName').value.trim();
            const email   = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all fields.';
                formStatus.className   = 'form-status form-status--error';
                return;
            }

            // Simple email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formStatus.textContent = 'Please enter a valid email address.';
                formStatus.className   = 'form-status form-status--error';
                return;
            }

            // Build mailto URI
            const TO = 'Ronquilm@rose-hulman.edu';
            const subject = encodeURIComponent(`Message from ${name} (Portfolio Contact)`);
            const body    = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\n${message}`
            );
            const mailto  = `mailto:${TO}?subject=${subject}&body=${body}`;

            // Use location.href for better browser compatibility
            window.location.href = mailto;

            // Feedback
            formStatus.textContent = 'Your email client should open now. If not, email me directly at ' + TO;
            formStatus.className   = 'form-status form-status--success';

            // Reset form
            contactForm.reset();
        });
    }

});
