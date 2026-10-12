/* JavaScript Document

TemplateMo 616 Split Index

https://templatemo.com/tm-616-split-index

*/

// ── Navigation: Panel Swapping ──
const navLinks = document.querySelectorAll('[data-nav]');
const panels = document.querySelectorAll('.panel');
const canvasImages = document.querySelectorAll('.canvas-image');
const canvasContexts = document.querySelectorAll('.canvas-context');
const placeholder = document.getElementById('placeholder');
let currentPanel = 'work';
let currentSlide = -1;

function switchPanel(target) {
   if (target === currentPanel) return;
   currentPanel = target;
   currentSlide = -1;

   // Update nav active state
   navLinks.forEach(link => {
      link.classList.toggle('nav-active', link.dataset.nav === target);
   });

   // Switch left panel
   panels.forEach(panel => {
      panel.classList.toggle('panel-active', panel.id === 'panel-' + target);
   });

   // Reset canvas
   canvasImages.forEach(img => img.classList.remove('visible'));
   canvasContexts.forEach(ctx => ctx.classList.remove('visible'));

   if (target === 'work') {
      placeholder.classList.remove('hidden');
   } else {
      placeholder.classList.add('hidden');
      const contextImg = document.querySelector('[data-context="' + target + '"]');
      if (contextImg) {
         setTimeout(() => contextImg.classList.add('visible'), 80);
      }
   }
}

navLinks.forEach(link => {
   link.addEventListener('click', (e) => {
      e.preventDefault();
      switchPanel(link.dataset.nav);
   });
});

// ── Work: Hover Preview ──
const projectItems = document.querySelectorAll('.project-item');
const slides = document.querySelectorAll('.canvas-image');

projectItems.forEach(item => {
   item.addEventListener('mouseenter', () => {
      if (currentPanel !== 'work') return;
      const idx = parseInt(item.dataset.index, 10);
      if (idx === currentSlide) return;
      currentSlide = idx;

      placeholder.classList.add('hidden');

      slides.forEach(slide => {
         slide.classList.toggle('visible', parseInt(slide.dataset.slide, 10) === idx);
      });
   });
});

document.querySelector('#panel-work').addEventListener('mouseleave', () => {
   if (currentPanel !== 'work') return;
   currentSlide = -1;
   slides.forEach(s => s.classList.remove('visible'));
   placeholder.classList.remove('hidden');
});

// ── Mobile: Touch support ──
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
   projectItems.forEach(item => {
      item.addEventListener('click', (e) => {
         e.preventDefault();
         if (currentPanel !== 'work') return;
         const idx = parseInt(item.dataset.index, 10);

         // Second tap on an already-previewed project opens the modal
         if (item.classList.contains('active')) { openModal(item); return; }

         placeholder.classList.add('hidden');
         projectItems.forEach(i => i.classList.remove('active'));
         item.classList.add('active');

         slides.forEach(slide => {
            const match = parseInt(slide.dataset.slide, 10) === idx;
            slide.classList.toggle('visible', match);
            if (match && window.innerWidth <= 900) {
               slide.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest'
               });
            }
         });
      });
   });
}

// ── Project Modal ──
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalStack = document.getElementById('modalStack');
const modalCategory = document.getElementById('modalCategory');
const modalLive = document.getElementById('modalLive');
const modalGithub = document.getElementById('modalGithub');
let lastFocus = null;

function setLink(el, url) {
   if (url) { el.href = url; el.style.display = ''; }
   else { el.removeAttribute('href'); el.style.display = 'none'; }
}

function openModal(item) {
   lastFocus = document.activeElement;
   modalTitle.textContent = item.dataset.title;
   modalDesc.textContent = item.dataset.desc;
   modalStack.textContent = item.dataset.stack || '';
   modalCategory.textContent = item.querySelector('.project-category').textContent;
   setLink(modalLive, item.dataset.live);
   setLink(modalGithub, item.dataset.github);
   modal.classList.add('open');
   modal.setAttribute('aria-hidden', 'false');
   document.getElementById('modalClose').focus();
}

function closeModal() {
   modal.classList.remove('open');
   modal.setAttribute('aria-hidden', 'true');
   if (lastFocus) lastFocus.focus();
}

// Desktop / mouse: a click opens the modal (touch devices use the handler above)
if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
   projectItems.forEach(item => {
      item.addEventListener('click', (e) => {
         e.preventDefault();
         openModal(item);
      });
   });
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
