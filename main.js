document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar scroll behavior
  const nav = document.querySelector('nav');
  if (nav && !nav.classList.contains('nav-solid')) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // 1b. Mobile Menu Toggle & Slide-out Drawer (NGSolutions architecture)
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  let navBackdrop = document.querySelector('.nav-backdrop');

  // Ensure backdrop element exists directly in document.body
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  } else if (navBackdrop.parentElement !== document.body) {
    document.body.appendChild(navBackdrop);
  }

  function openMobileMenu() {
    if (!navLinks) return;
    navLinks.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    if (mobileToggle) {
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('nav-drawer-open');
    if (nav) nav.classList.add('scrolled');
  }

  function closeMobileMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('nav-drawer-open');
    if (nav && window.scrollY <= 20 && !nav.classList.contains('nav-solid')) {
      nav.classList.remove('scrolled');
    }
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu();
      });
      navBackdrop.addEventListener('touchmove', (e) => {
        e.preventDefault();
      }, { passive: false });
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('.mobile-drawer-close')) {
        e.preventDefault();
        closeMobileMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active')) {
        if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // 1c. Ensure all videos on the site are strictly muted
  document.querySelectorAll('video').forEach((v) => {
    v.muted = true;
    v.volume = 0;
    if (v.hasAttribute('autoplay')) {
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  });

  // 2. Scroll Reveal Animations (fade-in, slide from left/right, scale)
  const revealElements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 3. Modern Web Gallery: Category Filtering & Lightbox (QueChido architecture)
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');

  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    let lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCat = document.getElementById('lightbox-cat');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Create video element dynamically if missing
    if (!lightboxVideo) {
      lightboxVideo = document.createElement('video');
      lightboxVideo.id = 'lightbox-video';
      lightboxVideo.controls = true;
      lightboxVideo.playsInline = true;
      lightboxVideo.muted = true;
      lightboxVideo.volume = 0;
      lightboxVideo.style.display = 'none';
      const wrap = lightbox.querySelector('.lightbox-media-wrap') || (lightboxImg && lightboxImg.parentNode);
      if (wrap) wrap.appendChild(lightboxVideo);
    } else {
      lightboxVideo.muted = true;
      lightboxVideo.volume = 0;
    }

    if (galleryGrid) {
      const allCards = Array.from(galleryGrid.querySelectorAll('.gallery-card'));
      let activeCards = allCards.slice();
      let currentLightboxIndex = 0;

      const catTiles = document.getElementById('cat-tiles');
      const gallerySection = document.getElementById('gallery-section');
      const galleryTitle = document.getElementById('gallery-title');
      const galleryCount = document.getElementById('gallery-count');
      const backBtn = document.getElementById('gallery-back');
      const catNames = {
        kitchens: 'Kitchens',
        bathrooms: 'Bathrooms',
        interiors: 'Interiors & Flooring',
        exterior: 'Exterior & Additions',
        'view-all': 'All Projects'
      };

      let currentFilterCategory = 'all';

      function updateCatTileCounts() {
        const counts = {};
        const currentCards = Array.from(galleryGrid.querySelectorAll('.gallery-card'));
        currentCards.forEach((card) => {
          const cat = (card.getAttribute('data-category') || '').toLowerCase();
          counts[cat] = (counts[cat] || 0) + 1;
        });
        document.querySelectorAll('.cat-tile[data-cat]').forEach((tile) => {
          const cat = (tile.getAttribute('data-cat') || '').toLowerCase();
          const count = counts[cat] || 0;
          const em = tile.querySelector('.cat-tile-info em');
          if (em) {
            em.innerHTML = `${count} ${count === 1 ? 'project' : 'projects'} &middot; View &rarr;`;
          }
        });
      }

      // category = 'all' shows the big squares; anything else shows that category's gallery
      function setFilter(category) {
        currentFilterCategory = category || 'all';
        const inGallery = !!catNames[category];
        const showAll = category === 'view-all';
        const currentCards = Array.from(galleryGrid.querySelectorAll('.gallery-card'));
        activeCards = [];
        currentCards.forEach((card) => {
          const match = inGallery && (showAll || card.getAttribute('data-category') === category);
          card.classList.toggle('is-hidden', !match);
          if (match) activeCards.push(card);
        });

        updateCatTileCounts();

        if (catTiles) catTiles.classList.toggle('is-hidden', inGallery);
        if (gallerySection) gallerySection.classList.toggle('is-open', inGallery);
        if (inGallery) {
          if (galleryTitle) galleryTitle.textContent = catNames[category];
          if (galleryCount) galleryCount.textContent = activeCards.length + (activeCards.length === 1 ? ' project' : ' projects');
        }

        try {
          const url = new URL(window.location);
          if (inGallery && !showAll) url.searchParams.set('cat', category);
          else if (showAll) url.searchParams.set('cat', 'view-all');
          else url.searchParams.delete('cat');
          window.history.replaceState({}, '', url);
        } catch (e) {}
      }

      window.cprSetGalleryFilter = setFilter;
      window.cprRefreshGalleryFilter = () => setFilter(currentFilterCategory);
      window.cprUpdateCatTileCounts = updateCatTileCounts;

      document.querySelectorAll('.cat-tile').forEach((tile) => {
        tile.addEventListener('click', () => {
          setFilter(tile.getAttribute('data-cat'));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });

      if (backBtn) {
        backBtn.addEventListener('click', () => {
          setFilter('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // Pre-select a category from the URL (e.g. ?cat=bathrooms from the homepage)
      const urlParams = new URLSearchParams(window.location.search);
      const initialCat = (urlParams.get('cat') || '').toLowerCase();
      if (window.CPR_ADMIN_ACTIVE) {
        setFilter(catNames[initialCat] ? initialCat : 'view-all');
      } else {
        setFilter(catNames[initialCat] ? initialCat : 'all');
      }

      function updateLightbox(index) {
        if (!activeCards.length) return;
        currentLightboxIndex = (index + activeCards.length) % activeCards.length;
        const card = activeCards[currentLightboxIndex];

        const type = card.getAttribute('data-type');
        const media = card.getAttribute('data-media');
        const poster = card.getAttribute('data-poster');
        const title = card.getAttribute('data-title') || '';
        const catName = card.getAttribute('data-catname') || '';

        if (lightboxVideo) {
          lightboxVideo.pause();
          lightboxVideo.style.display = 'none';
          lightboxVideo.src = '';
        }
        if (lightboxImg) {
          lightboxImg.style.display = 'none';
          lightboxImg.src = '';
        }

        setTimeout(() => {
          if (type === 'video') {
            if (lightboxVideo) {
              lightboxVideo.src = media;
              if (poster) lightboxVideo.poster = poster;
              lightboxVideo.muted = true;
              lightboxVideo.volume = 0;
              lightboxVideo.style.display = 'block';
              const p = lightboxVideo.play();
              if (p !== undefined) p.catch(() => {});
            }
          } else {
            if (lightboxImg) {
              lightboxImg.src = media;
              lightboxImg.alt = title;
              lightboxImg.style.display = 'block';
            }
          }

          if (lightboxCaption) {
            lightboxCaption.textContent = title;
            lightboxCaption.style.display = title ? 'block' : 'none';
          }
          if (lightboxCat) {
            lightboxCat.textContent = catName;
            lightboxCat.style.display = catName ? 'inline-block' : 'none';
          }
          if (lightboxCounter) {
            lightboxCounter.textContent = `${currentLightboxIndex + 1} of ${activeCards.length}`;
          }
        }, 60);
      }

      function openLightbox(indexInActive) {
        updateLightbox(indexInActive);
        lightbox.classList.add('is-active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        if (lightboxVideo) {
          lightboxVideo.pause();
          lightboxVideo.src = '';
        }
        lightbox.classList.remove('is-active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }

      function prevMedia() {
        updateLightbox(currentLightboxIndex - 1);
      }

      function nextMedia() {
        updateLightbox(currentLightboxIndex + 1);
      }

      galleryGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.gallery-card');
        if (!card) return;
        // If clicked on admin toolbar button inside card, don't trigger lightbox
        if (e.target.closest('.cpr-photo-toolbar-top')) return;
        
        const currentActive = Array.from(galleryGrid.querySelectorAll('.gallery-card:not(.is-hidden)'));
        const indexInActive = currentActive.indexOf(card);
        if (indexInActive !== -1) {
          activeCards = currentActive;
          openLightbox(indexInActive);
        }
      });

      closeBtn?.addEventListener('click', closeLightbox);
      prevBtn?.addEventListener('click', prevMedia);
      nextBtn?.addEventListener('click', nextMedia);

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-body') || e.target.classList.contains('lightbox-media-wrap')) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevMedia();
        if (e.key === 'ArrowRight') nextMedia();
      });
    }
  }

  // 4. Interactive Spotlight Cursor Luminescence (Apple AI / Linear style)
  const spotlightCards = document.querySelectorAll('.gallery-card, .gal-item, .portfolio-item, .precision-card, .tech-bar-card');
  if (spotlightCards.length) {
    const updateSpotlight = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    spotlightCards.forEach((card) => {
      card.addEventListener('pointermove', updateSpotlight, { passive: true });
    });
  }

  // 5. Hardware-Accelerated Dynamic Parallax Engine ("Scroll down -> Background moves up")
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  if (parallaxItems.length) {
    let ticking = false;

    const updateParallax = () => {
      // Disable on mobile/touch screens (< 768px) to prevent layout shift and inertia jitter
      if (window.innerWidth < 768) {
        parallaxItems.forEach((el) => {
          if (el.style.transform) el.style.transform = '';
        });
        ticking = false;
        return;
      }

      const vh = window.innerHeight;

      parallaxItems.forEach((el) => {
        const parent = el.closest('.hero, .parallax-showcase') || el.parentElement;
        const rect = parent.getBoundingClientRect();

        // Calculate only when container is near/within viewport
        if (rect.bottom >= -100 && rect.top <= vh + 100) {
          const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.35');
          const centerOffset = (rect.top + rect.height / 2) - (vh / 2);
          const translateY = centerOffset * speed;
          el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        }
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateParallax();
  }

  // 6. Desktop Hero Architectural House Slideshow Carousel
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrev = document.querySelector('.hero-prev');
  const heroNext = document.querySelector('.hero-next');

  if (heroSlides.length > 1) {
    let currentSlide = 0;
    let slideTimer = null;

    const showSlide = (index) => {
      if (index === currentSlide) return;
      const prevIndex = currentSlide;
      currentSlide = index;

      heroSlides.forEach((slide, i) => {
        if (i === prevIndex) {
          slide.classList.remove('active');
          slide.classList.add('prev');
        } else if (i === currentSlide) {
          slide.classList.remove('prev');
          slide.classList.add('active');
        } else {
          slide.classList.remove('active', 'prev');
        }
      });

      heroDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    const nextSlide = () => {
      const nextIndex = (currentSlide + 1) % heroSlides.length;
      showSlide(nextIndex);
    };

    const prevSlide = () => {
      const prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
      showSlide(prevIndex);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      slideTimer = setInterval(nextSlide, 5500);
    };

    const stopAutoSlide = () => {
      if (slideTimer) clearInterval(slideTimer);
    };

    heroNext?.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      startAutoSlide();
    });

    heroPrev?.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      startAutoSlide();
    });

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(i);
        startAutoSlide();
      });
    });

    // Start automated cycle
    startAutoSlide();
  }
});
