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

  // 1b. Mobile Hamburger Menu Toggle
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-cta a');

  if (hamburgerBtn && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !hamburgerBtn.classList.contains('is-active');
      hamburgerBtn.classList.toggle('is-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenu.classList.toggle('is-active', isOpen);
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.classList.toggle('menu-open', isOpen);
      if (nav) {
        if (isOpen) {
          nav.classList.add('scrolled');
        } else if (window.scrollY <= 20 && !nav.classList.contains('nav-solid')) {
          nav.classList.remove('scrolled');
        }
      }
    };

    hamburgerBtn.addEventListener('click', () => toggleMenu());

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-active')) {
        toggleMenu(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820 && mobileMenu.classList.contains('is-active')) {
        toggleMenu(false);
      }
    });
  }

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

  // 3. Portfolio Category Lightbox / Gallery
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightbox = document.getElementById('lightbox');

  if (lightbox && portfolioItems.length > 0) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Galleries mapped by category
    const galleryData = {
      kitchens: [
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/09/Untitled-design-96-e1721845778419.webp',
          title: 'Modern Chef Kitchen with Waterfall Island'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/07/20260202-christykosnic-7-1024x683.jpg',
          title: 'Luxury Kitchen Remodel with Custom Cabinetry'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/05/20250602-christykosnic-29-1024x684.jpg',
          title: 'Coastal Blue Center Island & Quartz Countertops'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/03/DSC00731-1-1024x769.jpg',
          title: 'Open Concept Kitchen & Statement Pendant Lighting'
        }
      ],
      basements: [
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/03/DSC00767.jpg',
          title: 'Finished Basement Entertainment Lounge'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/03/DSC00773.jpg',
          title: 'Custom Wet Bar & Lounge Seating'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/03/DSC00776.jpg',
          title: 'Recessed Lighting & Modern Basement Flooring'
        }
      ],
      bathrooms: [
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2025/05/AV_250213_2134725-edit-2-1.jpg',
          title: 'Spa-Inspired Primary Bathroom with Natural Wood Vanity'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/07/IMG_0374.jpg',
          title: 'Freestanding Soaking Tub & Luxury Tile Flooring'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/07/20260414-31.jpg',
          title: 'Walk-In Shower with Frameless Glass Enclosure'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/04/ltnichols-32.jpg',
          title: 'Contemporary Dual Vanity with Brass Fixtures'
        }
      ],
      flooring: [
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/07/Flooring-e1785249613410.jpg',
          title: 'Wide Plank Luxury Hardwood Flooring'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/09/DSC_6530-Edit.jpg',
          title: 'Modern Foyer Flooring with Staircase Integration'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/05/DSC02682-1.jpg',
          title: 'Custom Hardwood & Designer Tile Transitions'
        }
      ],
      fireplaces: [
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/05/DSC_6447-Edit.jpg',
          title: 'Floor-to-Ceiling Stone Hearth Fireplace'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/04/IMG_0050.jpg',
          title: 'Modern Clean Surround & Architectural Accent Wall'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2025/10/34-web-or-mls-DSC08299-1-1024x683.jpg',
          title: 'Classic Living Room Fireplace Renovation'
        }
      ],
      additions: [
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/04/DSC04423.jpg',
          title: 'Light-Filled Sunroom Addition with Vaulted Ceilings'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/04/80-web-or-mls-DSC08539.jpg',
          title: 'Modern Multi-Room Home Addition'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2022/10/11-1024x681.jpg',
          title: 'Seamless Architectural Exterior Expansion'
        }
      ],
      porches: [
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/07/9312-hamilton-dr-fairfax-va-35-e1785250092223.jpg',
          title: 'Screened Porch & Composite Deck with Cedar Ceiling'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/05/DSC04416.jpg',
          title: 'Covered Outdoor Living Room & Entertaining Area'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/03/DSC00855.jpg',
          title: 'Elevated Backyard Deck with Black Modern Railings'
        }
      ],
      exteriors: [
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/04/80-web-or-mls-DSC08539.jpg',
          title: 'Full Exterior Transformation & Architectural Siding'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2026/04/3-web-or-mls-DSC08572-1.jpg',
          title: 'Front Porch Portico & Welcoming Entryway Facelift'
        },
        {
          src: 'https://designproremodeling.com/wp-content/uploads/2020/06/6-5.jpg',
          title: 'Craftsman Exterior Stone & Composite Accents'
        }
      ]
    };

    let currentGallery = [];
    let currentIndex = 0;

    const updateLightbox = () => {
      if (!currentGallery.length) return;
      const item = currentGallery[currentIndex];
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.title;
        lightboxCaption.textContent = item.title;
        lightboxCounter.textContent = `${currentIndex + 1} of ${currentGallery.length}`;
        lightboxImg.style.opacity = '1';
      }, 150);
    };

    const openLightbox = (category) => {
      currentGallery = galleryData[category] || [];
      if (!currentGallery.length) return;
      currentIndex = 0;
      updateLightbox();
      lightbox.classList.add('is-active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const prevImage = () => {
      if (!currentGallery.length) return;
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      updateLightbox();
    };

    const nextImage = () => {
      if (!currentGallery.length) return;
      currentIndex = (currentIndex + 1) % currentGallery.length;
      updateLightbox();
    };

    portfolioItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const category = item.getAttribute('data-category');
        openLightbox(category);
      });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', prevImage);
    nextBtn?.addEventListener('click', nextImage);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-body')) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }
});
