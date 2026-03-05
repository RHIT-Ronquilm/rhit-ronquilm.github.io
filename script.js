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

            // Scroll to top of accordion
            setTimeout(() => {
                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
                const top = accordion.getBoundingClientRect().top + window.scrollY - navH - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }, 100);

            // Show extended content only for detailed projects
            const extended = document.getElementById('accExtended');
            if (extended) {
                extended.style.display = card.dataset.content === 'full' ? 'block' : 'none';
            }

            const extendedRadio = document.getElementById('accExtendedRadio');
            if (extendedRadio) {
                extendedRadio.style.display = card.dataset.content === 'radio' ? 'block' : 'none';
            }

            const extendedV6 = document.getElementById('accExtendedV6');
            if (extendedV6) {
                extendedV6.style.display = card.dataset.content === 'v6' ? 'block' : 'none';
            }

            // Set video speed
            const vid = document.getElementById('extVideo');
            if (vid) {
                vid.playbackRate = 4.0;
                vid.onplay = function() { this.playbackRate = 4.0; };
            }
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

        // If we landed on projects.html via a hash (e.g. #project-2), auto-open that accordion
        if (window.location.hash) {
            const targetId   = window.location.hash.replace('#', '');
            const targetCard = document.getElementById(targetId);
            if (targetCard && targetCard.dataset.title) {
                setTimeout(() => { targetCard.click(); }, 300);
            }
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