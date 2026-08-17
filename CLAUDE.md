# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Luis Ronquillo's personal portfolio site — a static, no-build, no-framework HTML/CSS/JS site (`index.html`, `experience.html`, `projects.html`, `resume.html`, `contact.html`, one shared `style.css`, one shared `script.js`). There is no package.json, no build step, no linter, no test suite. To preview a change, just open the relevant `.html` file directly in a browser (or use `start ""` on Windows) and refresh — no server needed.

A standalone `about.html` used to exist but was removed (2026-08-17): it duplicated the About Me content already on `index.html` almost verbatim, no other page linked to it (it was only reachable via its own nav link — a dead end), and its one genuinely extra bit of content (a Skills tag list) already lives on `resume.html`. If a request implies bringing back a dedicated About page, confirm what it should contain that index.html's About section doesn't, rather than restoring the old duplicate.

**Lightbox**: `openLightbox(src)` / `closeLightbox()` are global functions defined in `script.js` (outside the `DOMContentLoaded` wrapper, so inline `onclick="openLightbox(this.src)"` attributes anywhere can call them) — they null-guard on `#lightbox`/`#lightboxImg` not existing, so it's safe to call from a page that hasn't added the markup. To use it on a page, add `<div id="lightbox" onclick="closeLightbox()">...<img id="lightboxImg">...</div>` before the `<script src="script.js">` tag (copy the block from `projects.html` or `experience.html`). Originally this lived as a duplicate inline `<script>` block only in `projects.html`; it was promoted to `script.js` when `experience.html` needed to open its certificate image the same way instead of navigating to it in a new tab.

Every page's `<head>` carries Open Graph / Twitter Card meta tags (title, description, `og:image` pointing at `assets/images/og-share-card.png`, absolute `og:url`/`twitter:*` using the `https://lronquillo.com/` domain) so links shared on LinkedIn/social render a proper preview card instead of a bare gray box. When adding a new page or changing a page's title, add/update the matching meta block too — copy the pattern from an existing page's `<head>` rather than reinventing it.

**Deployment**: this repo is `RHIT-Ronquilm/rhit-ronquilm.github.io` on GitHub — pushing to `main` deploys automatically via GitHub Pages. A `CNAME` file points the custom domain `lronquillo.com` at it (the `.github.io` URL 301-redirects there). **Only commit/push when the user explicitly asks** — after making edits, open the file locally so the user can review in-browser first.

Note: local git is authenticated as a personal GitHub account, not the repo-owning org account — if a push is ever rejected with a permission error, that's a local credential/collaborator-access issue on the user's end, not a code problem.

## Architecture: the project card system (projects.html)

This is the one genuinely non-trivial piece of the site. Every project is a `<div class="project-card">` with data attributes read by `script.js` at click time — there is no per-project markup duplication for the detail view:

- `data-title`, `data-tag` (`"School Project"` / `"Internship"` / `"Personal"` — this exact string doubles as the category filter key), `data-img` (header/primary image), `data-desc`, `data-extra` (raw HTML, rendered via `innerHTML` into the narrow left column next to the image — keep this to short key:value lines like tools/company/cost, since it's only half-width).
- `data-details` (optional, raw HTML, rendered via `innerHTML` into `#accDetails`): a full-width section below the two-column header, for long-form multi-paragraph write-ups (the CNC mill and SCARA arm cards are the reference examples). Use the `.acc-extra-h4` / `.acc-extra-p` / `.acc-extra-list` CSS classes (in `style.css`) for section headers/paragraphs/bullet lists so they read as one consistent system rather than ad hoc inline styling. **Don't put long-form content in `data-extra`** — it lives in the half-width left column next to the image, so anything more than a few key:value lines badly unbalances the two-column layout (huge blank space under the shorter image column). Short quick-facts stay in `data-extra`; everything past that goes in `data-details`.
- `data-gallery` (optional): comma-separated image URLs. When present, clicking a card populates a thumbnail strip (`.acc-gallery-thumb`) below the hero image in the shared accordion (`#accGallery`); clicking a thumbnail swaps it into the big image spot (`#accImage`) — it does **not** open anything new. The hint text "Click a photo to view it larger" only shows when there's more than one image.
- Clicking a card calls `openAccordion(card)` in `script.js`, which populates one shared `#projectAccordion` block (moved in the DOM via `grid.before(accordion)`) rather than each card owning its own detail markup.

**Legacy pattern to avoid**: three old cards (Landing Gear Link, FM Radio, V6 Engine) use a `data-content="full"|"radio"|"v6"` flag that toggles a large hardcoded extended section (`#accExtended`, `#accExtendedRadio`, `#accExtendedV6`) with hand-written stats/specs, a video, etc. This was flagged in an earlier review as an inconsistent, hard-to-maintain pattern — **do not use it for new cards**. New rich content should go through `data-extra` (arbitrary HTML) and `data-gallery` instead.

**Top-level grid visibility**: `#projectGrid` is `display:none` by default. Three category tiles (`#categoryGrid .category-card`, `data-filter` matching a `data-tag` value) and one red `#allProjectsBar` reveal it — a tile reveals it *filtered*, the bar always reveals it *unfiltered* (it is not a toggle). A separate `#gridCloseBtn` (styled to match, sits directly under the All Projects bar) is the only thing that hides the grid again, regardless of how it was opened. Don't reintroduce toggle behavior on the All Projects bar — that was explicitly fixed after confusing the two.

**Internship-only cards**: the 9 individual ProAmpac project cards that were once held pending confidentiality review have been cleared (as of the review completed 2026-08-16) and now live as normal top-level cards in the grid like everything else — no more hold wrapper, no more admin-gate. The one exception is the "ProAmpac — R&D Engineering Internship" summary card (`id="project-proampac-summary"`), which the user asked to keep but *not* show in the unfiltered "All Projects" view — it's flagged with `data-internship-only="true"`, and `revealGrid()` in `script.js` special-cases that attribute: hidden when `filterTag` is null (All Projects / category tiles other than Internship), shown only when the Internship category tile is active. The hash-auto-open handler checks the same attribute to pick the right filter before clicking the target card. If a future round of ProAmpac (or other employer) content needs to go on hold again pending review, the previous pattern (a `display:none` wrapper with id ending in `-hold`, a project-card exclusion filter in `script.js`, and an admin-gate modal) is a reasonable template to recreate — see git history around the ProAmpac cards for a worked example.

**Card ordering is a deliberate ranking**, not just chronological — cards are ordered by recruiter impact (ambitious self-directed work like the CNC mill and SCARA arm builds are pulled toward the front even as work-in-progress, ahead of routine tasks). If asked to add/reorder projects, ask what tier a new project belongs in rather than defaulting to appending at the end. The homepage's 6 featured project-preview cards (`index.html`) are meant to mirror the current top picks from `projects.html` — update both together.

**Deep links**: `index.html` and `experience.html` link into specific projects via `projects.html#project-N`. `script.js`'s `DOMContentLoaded` hash handler reveals the grid (filtered to Internship if the target card is `data-internship-only`) and auto-clicks the matching card `id`. If a card is renumbered or deleted, grep the whole repo for its `#project-N` id before assuming nothing else references it.

## Resume preview (resume.html)

`resume.html` shows a rendered PNG (`assets/images/resume-preview.png`) inside `.resume-embed`, not an `<iframe src="assets/resume.pdf">`. An iframe embed was tried first, but the browser's built-in PDF viewer controls its own internal zoom/centering and ignores container CSS in ways that couldn't be reliably fixed from the page's own stylesheet (tried a fixed iframe height, then `aspect-ratio` tricks on the iframe and the container — both still left uneven black dead space around the page, because the fit/centering logic lives inside the iframe's opaque native viewer, not in anything `style.css` can reach). A plain `<img>` of the rendered page sidesteps that entirely — normal CSS sizing, identical across browsers, no dead space possible.

**When `assets/resume.pdf` is updated, regenerate the preview image** (PyMuPDF is already used elsewhere in this project's workflow):
```python
import fitz
doc = fitz.open("assets/resume.pdf")
pix = doc[0].get_pixmap(matrix=fitz.Matrix(2.5, 2.5))  # ~2.5x zoom for a crisp web preview
pix.save("assets/images/resume-preview.png")
```
The Download Resume button still links to the real `assets/resume.pdf` — only the on-page preview is an image.

## Image/asset conventions

- All images live flat in `assets/images/`, named `<project-slug>-<detail>.jpg`, e.g. `proampac-packing-station-tube.jpg`, `hovercraft-mount-cad-engine1.jpg`, `personal-cnc-mill-parts.jpg`. Follow the existing prefix style (`proampac-`, `personal-`, `category-`, `bench-`, `hovercraft-`) so a project's images sort together.
- Source photos typically arrive as HEIC (iPhone) or as PNGs dropped in `~/Pictures/Screenshots` or `~/Pictures/Picture*.png` (the latter is Office's naming pattern when images are extracted from a pasted Word/PowerPoint doc) — check those locations by filename before asking the user to re-export anything.
- HEIC conversion needs `pillow-heif` (`pip install pillow-heif`, then `pillow_heif.register_heif_opener()` before `PIL.Image.open`). Videos recorded on iPhone are often HEVC-encoded (`hvc1`/`hvcC` in the file), which most desktop browsers won't play — transcode to H.264 with `imageio-ffmpeg`'s bundled binary (`pip install imageio-ffmpeg`, then call `imageio_ffmpeg.get_ffmpeg_exe()`) before embedding with `<video><source type="video/mp4">`.
- **Windows path gotcha**: when writing a Python script to be run via the Bash tool, always use a real Windows path (`r"C:\Users\..."`), never the Bash/MSYS-style `/c/Users/...` form — native Windows Python does not translate that prefix, and will silently create a bogus `C:\c\Users\...` directory tree instead of erroring. This has bitten this project before; if a script "succeeds" but files aren't where expected, check for a stray `C:\c\` first.
- A nested `.project-grid` placed *inside* another `.project-grid`'s cell (e.g. a future hold-container, per the pattern described above) needs an explicit `grid-column: 1 / -1` or it only ever gets one outer column's width to auto-fill into, and silently renders as a single column no matter the CSS.

## Content/IP notes

Some project content originates from a ProAmpac (employer) internal presentation marked confidential. Existing published copy was deliberately written in generalized, resume-safe language with client/vendor specifics stripped — don't reintroduce named clients, vendor names, or ProAmpac-internal document/machine numbers from source material without the user explicitly clearing it first.

As of 2026-08-16 the user completed a confidentiality review with his employer covering the 9 individual ProAmpac project cards and gave specific, per-card clearance instructions — e.g. strip named clients (Walmart, GAP) and machine names (Garant Maschinen Matador Series, PAC Jacket, A054 ECO-Jacket) from descriptions, swap out proprietary CAD/drawing images for either sanitized replacements or generic stand-ins, and append explicit "withheld for confidentiality" notes to a few cards (Precision Punch Mechanism Rebuild, Micro-Flute Nip Roller Redesign, Machine Safety Guard Design) where the underlying work still can't be fully described. Treat this as the model for future rounds: don't assume a blanket "it's all fine now" — future ProAmpac projects still need the same per-item clearance before publishing specifics.
