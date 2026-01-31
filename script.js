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
    // PROJECTS PAGE — Detail Panel
    // Opens project info at the TOP of the page without navigating away.
    // --------------------------------------------------------
    const detailPanel   = document.getElementById('project-detail');
    const detailClose   = document.getElementById('detailClose');
    const detailTitle   = document.getElementById('detailTitle');
    const detailTag     = document.getElementById('detailTag');
    const detailDesc    = document.getElementById('detailDesc');
    const detailExtra   = document.getElementById('detailExtra');
    const detailImage   = document.getElementById('detailImage');
    const detailPlaceholder = document.getElementById('detailPlaceholder');

    // All project cards on THIS page (projects.html uses data-* attributes)
    const projectCards  = document.querySelectorAll('.project-card[data-title]');

    if (detailPanel && projectCards.length) {

        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();

                // Pull data from card's data-* attributes
                const title   = card.dataset.title;
                const tag     = card.dataset.tag;
                const img     = card.dataset.img;
                const desc    = card.dataset.desc;
                const extra   = card.dataset.extra || '';

                // Populate detail panel
                detailTitle.textContent = title;
                detailTag.textContent   = tag;
                detailDesc.textContent  = desc;
                detailExtra.innerHTML   = extra;
                detailPlaceholder.textContent = card.querySelector('.project-card-placeholder')?.textContent || '';

                // Image: show if path exists, hide placeholder accordingly
                if (img) {
                    detailImage.src = img;
                    detailImage.alt = title;
                    detailImage.style.display = 'block';
                    // If image fails to load, placeholder stays visible
                    detailImage.onerror = function() {
                        this.style.display = 'none';
                    };
                } else {
                    detailImage.style.display = 'none';
                }

                // Show the panel
                detailPanel.classList.remove('project-detail--hidden');

                // Scroll smoothly to the detail panel (below navbar)
                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
                const rect = detailPanel.getBoundingClientRect();
                window.scrollTo({
                    top: window.scrollY + rect.top - navH,
                    behavior: 'smooth'
                });
            });
        });

        // Close button
        if (detailClose) {
            detailClose.addEventListener('click', () => {
                detailPanel.classList.add('project-detail--hidden');
            });
        }
    }

    // --------------------------------------------------------
    // INDEX PAGE — Project cards link to projects.html#id
    // These are plain <a> tags so they work natively — no JS needed.
    // --------------------------------------------------------

    // If we landed on projects.html via a hash (e.g. #project-2),
    // auto-open that project's detail panel after load.
    if (detailPanel && window.location.hash) {
        const targetId = window.location.hash.replace('#', '');
        const targetCard = document.getElementById(targetId);
        if (targetCard && targetCard.dataset.title) {
            // Simulate a click after a short delay so the page has rendered
            setTimeout(() => { targetCard.click(); }, 300);
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
            // Replace "your.email@example.com" with your actual email below:
            const TO = 'your.email@example.com';
            const subject = encodeURIComponent(`Message from ${name} (Portfolio Contact)`);
            const body    = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\n${message}`
            );
            const mailto  = `mailto:${TO}?subject=${subject}&body=${body}`;

            // Open in new tab (triggers user's email client)
            window.open(mailto, '_blank');

            // Feedback
            formStatus.textContent = 'Your email client should open now. If not, email me directly at ' + TO;
            formStatus.className   = 'form-status form-status--success';

            // Reset form
            contactForm.reset();
        });
    }

});
