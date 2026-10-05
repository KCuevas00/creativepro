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

  // 3. Portfolio Category Lightbox / Gallery
  const portfolioItems = document.querySelectorAll('.portfolio-item, .open-lightbox');
  const lightbox = document.getElementById('lightbox');

  if (lightbox && portfolioItems.length > 0) {
    let lightboxImg = document.getElementById('lightbox-img');
    let lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');
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
      if (lightboxImg && lightboxImg.parentNode) {
        lightboxImg.parentNode.insertBefore(lightboxVideo, lightboxImg.nextSibling);
      }
    } else {
      lightboxVideo.muted = true;
      lightboxVideo.volume = 0;
    }

    // Real client project galleries by broad category
    const galleryData = {
      kitchens: [
        {
          video: 'videos/att.7Dz5lQcCSd0ddTf9VZRopP9xWM-3Atp0FnmpK_3CeE8.mp4',
          poster: 'photos/thumbs/att.7Dz5lQcCSd0ddTf9VZRopP9xWM-3Atp0FnmpK_3CeE8.jpg',
          title: 'Luxury Kitchen Island & Custom Cabinetry'
        },
        {
          video: 'videos/att.ucdAuTRRYabAZ8vkFyUzYQKstpuCozJaKjcC5Fg2-l0.mp4',
          poster: 'photos/thumbs/att.ucdAuTRRYabAZ8vkFyUzYQKstpuCozJaKjcC5Fg2-l0.jpg',
          title: 'Designer Quartz Countertops & Under-Cabinet Lighting'
        },
        {
          video: 'videos/att.8_YWMmqyAIp7lA5w8Ne7JRD0POWvu3PNwK841J3LADA.mp4',
          poster: 'photos/thumbs/att.8_YWMmqyAIp7lA5w8Ne7JRD0POWvu3PNwK841J3LADA.jpg',
          title: 'Warm Wood Kitchen Cabinetry & Custom Sink'
        },
        {
          video: 'videos/att.vfARFXoTnHJfOLqqF8W1_fSoY4aCxrxRsz4XRqmZS-Q.mp4',
          poster: 'photos/thumbs/att.vfARFXoTnHJfOLqqF8W1_fSoY4aCxrxRsz4XRqmZS-Q.jpg',
          title: 'Full Custom Island & Cabinet Installation'
        }
      ],
      bathrooms: [
        {
          src: 'videos/att.970gtKVesR1xjUGCgzqflV2OWC8aKJ6eQjcG_yd52OY.jpg',
          title: 'Walk-In Shower with Rain Head & Hexagon Mosaic Niche'
        },
        {
          video: 'videos/att.KTTjtNAtQ304b6EBsn0ZfpWx3SeXYvGI1veDeXCvkAE.mp4',
          poster: 'photos/thumbs/att.KTTjtNAtQ304b6EBsn0ZfpWx3SeXYvGI1veDeXCvkAE.jpg',
          title: 'Frameless Glass Shower Enclosure with Built-In Bench'
        },
        {
          video: 'videos/att.4WElZvAEzgX-9jBeF96TNk1SkMY1p260NkiwqzmOLss.mp4',
          poster: 'photos/thumbs/att.4WElZvAEzgX-9jBeF96TNk1SkMY1p260NkiwqzmOLss.jpg',
          title: 'LED Backlit Vanity Mirror & Contemporary Dark Vanity'
        },
        {
          src: 'videos/att.fWpCm0skN6ss4QCZNMa-juQdOCfMdO2ke7EJ_wlxbS0.jpg',
          title: 'Designer Glass Corner Enclosure & Custom Tile Floor'
        },
        {
          video: 'videos/att.xh4qp8SCjPj21yNXbsV1EXvaYIFRwcRiNh0OHsVXvJo.mp4',
          poster: 'photos/thumbs/att.xh4qp8SCjPj21yNXbsV1EXvaYIFRwcRiNh0OHsVXvJo.jpg',
          title: 'Contemporary Dual Sconce Vanity with Green Tile Accent'
        },
        {
          video: 'videos/att.1Bus7uS-LDiAKcWW4Q0RCi7qJPqbRxl7-NEH_yzDI6w.mp4',
          poster: 'photos/thumbs/att.1Bus7uS-LDiAKcWW4Q0RCi7qJPqbRxl7-NEH_yzDI6w.jpg',
          title: 'Modern Frameless Glass & Custom Tile Surround'
        },
        {
          video: 'videos/att.UEALgeMmISxrldGzCUQckqRfF_3mm2YDU3OMp9d1Nq8.mp4',
          poster: 'photos/thumbs/att.UEALgeMmISxrldGzCUQckqRfF_3mm2YDU3OMp9d1Nq8.jpg',
          title: 'Precision Tile Shower with Gold Trim Recessed Niche'
        },
        {
          video: 'videos/att.ztIJhiE4D11xlPTh6AveQ0mdYR0KpV1gbp6Nga0_jy8.mp4',
          poster: 'photos/thumbs/att.ztIJhiE4D11xlPTh6AveQ0mdYR0KpV1gbp6Nga0_jy8.jpg',
          title: 'Pebble Mosaic Shower Floor with Frameless Glass'
        }
      ],
      interiors: [
        {
          video: 'videos/att.GlD22ty3iYeMkHM0jeJJ-i3D_5D5A8P2i-yUYWIc48s.mp4',
          poster: 'photos/thumbs/att.GlD22ty3iYeMkHM0jeJJ-i3D_5D5A8P2i-yUYWIc48s.jpg',
          title: 'Finished Living Suite with Luxury Flooring & Trim'
        },
        {
          video: 'videos/att.iB3y3PqItc2d8NhAGWk6qJw_AZOaA0fVvFvn6cqfEuM.mp4',
          poster: 'photos/thumbs/att.iB3y3PqItc2d8NhAGWk6qJw_AZOaA0fVvFvn6cqfEuM.jpg',
          title: 'Custom Tile Flooring & Living Entryway'
        },
        {
          video: 'videos/att.2BalRMalskuFu9Mn4uZFyzM6aL0MqPrfYy8mgXWTwhc.mp4',
          poster: 'photos/thumbs/att.2BalRMalskuFu9Mn4uZFyzM6aL0MqPrfYy8mgXWTwhc.jpg',
          title: 'Open Concept Interior Renovation & Living Space'
        },
        {
          video: 'videos/att.I6n1MFW-43ozeKTnIQzqdx_wz3deWKS_8Sb8Z-VqA_c.mp4',
          poster: 'photos/thumbs/att.I6n1MFW-43ozeKTnIQzqdx_wz3deWKS_8Sb8Z-VqA_c.jpg',
          title: 'Interior Craftsman Details & Finishes'
        }
      ],
      exterior: [
        {
          video: 'videos/att.TTFdmFK19BSoTxBfkV49qam3r7C5KfbSv2dphpbWmT8.mp4',
          poster: 'photos/thumbs/att.TTFdmFK19BSoTxBfkV49qam3r7C5KfbSv2dphpbWmT8.jpg',
          title: 'Residential Structural Framing & Exterior Addition'
        },
        {
          video: 'videos/att.vOThgqi77WAdpZjVTtpznj-z0jqDS4Cf8kg8mphB5rM.mp4',
          poster: 'photos/thumbs/att.vOThgqi77WAdpZjVTtpznj-z0jqDS4Cf8kg8mphB5rM.jpg',
          title: 'Exterior Remodel & Backyard Home Extension'
        }
      ],
      other: [
        {
          src: 'photos/cpr_banner.png',
          title: 'Creative Pro Remodeling LLC - Juan Lozano, Master Craftsman'
        },
        {
          video: 'videos/att.B2qH864DE0tKtbHv6DN1pukQkO5QgNRpmHC5CipJw3Y.mp4',
          poster: 'photos/thumbs/att.B2qH864DE0tKtbHv6DN1pukQkO5QgNRpmHC5CipJw3Y.jpg',
          title: 'Custom Modern Bathroom Renovation with Sliding Glass'
        },
        {
          video: 'videos/att.xmAkLA4lv0BZXJTYUPI24WJwzXhDj28dN9jzkW4PFhQ.mp4',
          poster: 'photos/thumbs/att.xmAkLA4lv0BZXJTYUPI24WJwzXhDj28dN9jzkW4PFhQ.jpg',
          title: 'Frosted Glass Shower Enclosure Installation'
        },
        {
          src: 'photos/logo.png',
          title: 'Creative Pro Remodeling - Official 3D Metallic Emblem'
        }
      ]
    };

    let currentGallery = [];
    let currentIndex = 0;

    const updateLightbox = () => {
      if (!currentGallery.length) return;
      const item = currentGallery[currentIndex];

      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.style.display = 'none';
        lightboxVideo.src = '';
      }
      if (lightboxImg) {
        lightboxImg.style.display = 'none';
        lightboxImg.style.opacity = '0';
      }

      setTimeout(() => {
        if (item.video) {
          if (lightboxVideo) {
            lightboxVideo.src = item.video;
            if (item.poster) lightboxVideo.poster = item.poster;
            lightboxVideo.muted = true;
            lightboxVideo.volume = 0;
            lightboxVideo.style.display = 'block';
            lightboxVideo.style.opacity = '1';
            lightboxVideo.play().catch(() => {});
          }
        } else {
          if (lightboxImg) {
            lightboxImg.src = item.src;
            lightboxImg.alt = item.title;
            lightboxImg.style.display = 'block';
            lightboxImg.style.opacity = '1';
          }
        }
        if (lightboxCaption) lightboxCaption.textContent = item.title;
        if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} of ${currentGallery.length}`;
      }, 120);
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
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
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
        if (category) {
          openLightbox(category);
        }
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
