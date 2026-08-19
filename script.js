/* ============================================================
   PORTFOLIO — script.js
   Shared logic for all pages.
   ============================================================ */

// --------------------------------------------------------
// LIGHTBOX — global (called from inline onclick="" attributes
// on any page that includes a #lightbox element, e.g. project
// gallery images, accordion photos, the certificate link).
// --------------------------------------------------------
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lb.style.display = 'flex';
}
function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.style.display = 'none';
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------
    // CONFIDENTIALITY BADGE — auto-injected next to every "Internship"
    // project-tag pill (grid cards and homepage preview cards) so
    // redacted/thinner internship write-ups don't read as less
    // impressive work than they are. Matches by visible tag text
    // rather than a data-attribute so it covers both the full
    // data-driven cards on projects.html and the static preview
    // links on index.html.
    // --------------------------------------------------------
    const CONFIDENTIAL_BADGE_TEXT = '🔒 Some details withheld for confidentiality';
    document.querySelectorAll('.project-tag').forEach(tag => {
        if (tag.id === 'accTag') return; // accordion tag is handled separately in openAccordion()
        if (tag.textContent.trim() !== 'Internship') return;
        const badge = document.createElement('span');
        badge.className = 'confidential-badge';
        badge.textContent = CONFIDENTIAL_BADGE_TEXT;
        tag.after(badge);
    });

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
    const accConfidentialBadge = document.getElementById('accConfidentialBadge');
    const accDesc   = document.getElementById('accDesc');
    const accExtra  = document.getElementById('accExtra');
    const accDetails = document.getElementById('accDetails');
    const accImage  = document.getElementById('accImage');
    const accGallery = document.getElementById('accGallery');
    const accGalleryHint = document.getElementById('accGalleryHint');
    const grid      = document.getElementById('projectGrid');

    const projectCards = Array.from(document.querySelectorAll('.project-card[data-title]'));

    let activeCard = null;

    if (accordion && projectCards.length) {

        function openAccordion(card) {
            accTitle.textContent = card.dataset.title;
            accTag.textContent   = card.dataset.tag;
            if (accConfidentialBadge) {
                const isInternship = card.dataset.tag === 'Internship';
                accConfidentialBadge.textContent = isInternship ? '🔒 Some details withheld for confidentiality' : '';
                accConfidentialBadge.style.display = isInternship ? 'inline-block' : 'none';
            }
            accDesc.textContent  = card.dataset.desc;
            accExtra.innerHTML   = card.dataset.extra || '';
            if (accDetails) {
                const detailsHTML = card.dataset.details || '';
                accDetails.innerHTML = detailsHTML;
                accDetails.style.display = detailsHTML ? 'block' : 'none';
            }
            if (accImage) accImage.src = card.dataset.img || '';

            // Gallery thumbnails — clicking one swaps it into the big image spot
            if (accGallery) {
                accGallery.innerHTML = '';
                const galleryUrls = (card.dataset.gallery || '')
                    .split(',')
                    .map(u => u.trim())
                    .filter(Boolean);

                galleryUrls.forEach(url => {
                    const thumb = document.createElement('img');
                    thumb.src = url;
                    thumb.alt = card.dataset.title;
                    thumb.className = 'acc-gallery-thumb';
                    thumb.addEventListener('click', () => {
                        accImage.src = url;
                    });
                    accGallery.appendChild(thumb);
                });

                if (accGalleryHint) {
                    accGalleryHint.style.display = galleryUrls.length > 1 ? 'block' : 'none';
                }
            }

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

        // --------------------------------------------------------
        // CATEGORY TILES + "ALL PROJECTS" BAR + CLOSE BUTTON
        // The grid is hidden until a category tile or the All
        // Projects bar reveals it (optionally filtered by tag).
        // All Projects always shows everything unfiltered — it is
        // not a toggle. The Close button is the only way to hide
        // the grid again, regardless of how it was opened.
        // --------------------------------------------------------
        const categoryGrid   = document.getElementById('categoryGrid');
        const allProjectsBar = document.getElementById('allProjectsBar');
        const gridCloseBtn   = document.getElementById('gridCloseBtn');
        const topLevelCards = grid ? grid.querySelectorAll(':scope > .project-card') : [];

        function revealGrid(filterTag) {
            grid.style.display = 'grid';
            if (gridCloseBtn) gridCloseBtn.style.display = 'flex';

            topLevelCards.forEach(card => {
                // Internship-only cards (e.g. the ProAmpac R&D summary) are excluded
                // from the unfiltered "All Projects" view — only shown when the
                // Internship category tile is the active filter.
                if (card.dataset.internshipOnly === 'true') {
                    card.style.display = (filterTag === 'Internship') ? '' : 'none';
                    return;
                }
                const show = !filterTag || card.dataset.tag === filterTag;
                card.style.display = show ? '' : 'none';
            });

            setTimeout(() => {
                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
                const top = grid.getBoundingClientRect().top + window.scrollY - navH - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }, 100);
        }

        function collapseGrid() {
            grid.style.display = 'none';
            if (gridCloseBtn) gridCloseBtn.style.display = 'none';
            closeAccordion();
        }

        if (allProjectsBar && grid) {
            allProjectsBar.addEventListener('click', () => revealGrid(null));
        }

        if (gridCloseBtn && grid) {
            gridCloseBtn.addEventListener('click', collapseGrid);
        }

        if (categoryGrid && grid) {
            categoryGrid.querySelectorAll('.category-card').forEach(tile => {
                tile.addEventListener('click', () => {
                    revealGrid(tile.dataset.filter);
                });
            });
        }

        // If we landed on projects.html via a hash (e.g. #project-2), reveal
        // the full grid and auto-open that project. Internship-only cards
        // (e.g. the ProAmpac summary) need the Internship filter rather than
        // the unfiltered view to actually be visible.
        if (window.location.hash) {
            const targetId   = window.location.hash.replace('#', '');
            const targetCard = document.getElementById(targetId);
            if (targetCard && targetCard.dataset.title) {
                const filterTag = targetCard.dataset.internshipOnly === 'true' ? 'Internship' : null;
                revealGrid(filterTag);
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