/* =========================================
   Michelle Deerberg — Motivational Speaker
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- LANGUAGE SYSTEM ----------
    function t(key) {
        const lang = document.documentElement.lang || 'de';
        return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ||
               (TRANSLATIONS['de'] && TRANSLATIONS['de'][key]) || key;
    }

    function setLanguage(lang) {
        if (!TRANSLATIONS[lang]) return;

        // Update html lang attribute
        document.documentElement.lang = lang;

        // Update page title & meta description
        document.title = TRANSLATIONS[lang].page_title || document.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && TRANSLATIONS[lang].meta_desc) {
            metaDesc.setAttribute('content', TRANSLATIONS[lang].meta_desc);
        }

        // Update data-i18n elements (textContent)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang][key] !== undefined) {
                el.textContent = TRANSLATIONS[lang][key];
            }
        });

        // Update data-i18n-html elements (innerHTML)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (TRANSLATIONS[lang][key] !== undefined) {
                el.innerHTML = TRANSLATIONS[lang][key];
            }
        });

        // Update data-i18n-placeholder elements
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (TRANSLATIONS[lang][key] !== undefined) {
                el.setAttribute('placeholder', TRANSLATIONS[lang][key]);
            }
        });

        // Update data-lang-content sections (show/hide for legal pages)
        document.querySelectorAll('[data-lang-content]').forEach(el => {
            el.style.display = el.getAttribute('data-lang-content') === lang ? '' : 'none';
        });

        // Update active lang buttons (both desktop and mobile)
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('lang-btn--active', btn.getAttribute('data-lang') === lang);
        });

        // Save preference
        localStorage.setItem('preferredLanguage', lang);
    }

    function getInitialLanguage() {
        const saved = localStorage.getItem('preferredLanguage');
        if (saved && TRANSLATIONS[saved]) return saved;

        const browserLang = (navigator.language || '').split('-')[0];
        if (TRANSLATIONS[browserLang]) return browserLang;

        return 'de';
    }

    // Clone lang buttons into mobile nav
    const langSelector = document.getElementById('langSelector');
    const langSelectorMobile = document.getElementById('langSelectorMobile');

    if (langSelector && langSelectorMobile) {
        langSelectorMobile.innerHTML = langSelector.innerHTML;
    }

    // Attach click handlers to all lang buttons (desktop + mobile)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // Apply initial language
    const initialLang = getInitialLanguage();
    if (initialLang !== 'de') {
        setLanguage(initialLang);
    } else {
        // Mark the correct button as active
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('lang-btn--active', btn.getAttribute('data-lang') === 'de');
        });
    }

    // ---------- HEADER SCROLL ----------
    const header = document.getElementById('header');

    const onScroll = () => {
        header.classList.toggle('header--scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- HAMBURGER MENU ----------
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav--open');
        hamburger.classList.toggle('hamburger--active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav--open');
            hamburger.classList.remove('hamburger--active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // ---------- ACTIVE NAV LINK ----------
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav__link[href="#${id}"]`);

            if (link) {
                link.classList.toggle('nav__link--active', scrollY >= top && scrollY < top + height);
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ---------- FAQ ACCORDION ----------
    document.querySelectorAll('.faq__question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('faq__item--active');

            // Close all
            document.querySelectorAll('.faq__item--active').forEach(el => {
                el.classList.remove('faq__item--active');
                el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if it wasn't active)
            if (!isActive) {
                item.classList.add('faq__item--active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll(
        '.intro__text, .intro__image, .approach__text, .approach__image, ' +
        '.about__image, .about__text, ' +
        '.service-card, .extras, .why__text, .why__stats, ' +
        '.testimonial, .faq__list, .contact__info, .contact__form-wrapper'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- COUNTER ANIMATION ----------
    const counters = document.querySelectorAll('.stat__number');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.round(eased * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(el => counterObserver.observe(el));

    // ---------- CONTACT FORM ----------
    const form = document.getElementById('contactForm');

    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn');
        btn.textContent = t('form_sent');
        btn.style.background = '#2d6a4f';
        btn.style.borderColor = '#2d6a4f';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.textContent = t('form_submit');
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            form.reset();
        }, 3000);
    });

    // ---------- COOKIE BANNER ----------
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieReject = document.getElementById('cookieReject');
    const cookieCustomize = document.getElementById('cookieCustomize');
    const cookieOptions = document.getElementById('cookieOptions');
    const openCookieSettings = document.getElementById('openCookieSettings');

    if (cookieBanner) {
        const consent = localStorage.getItem('cookieConsent');

        if (!consent) {
            // Show banner after a short delay
            setTimeout(() => {
                cookieBanner.classList.add('cookie-banner--visible');
            }, 1000);
        }

        const hideBanner = () => {
            cookieBanner.classList.remove('cookie-banner--visible');
        };

        const saveConsent = (analytics, marketing) => {
            const prefs = { essential: true, analytics, marketing, timestamp: Date.now() };
            localStorage.setItem('cookieConsent', JSON.stringify(prefs));
            hideBanner();
        };

        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => saveConsent(true, true));
        }

        if (cookieReject) {
            cookieReject.addEventListener('click', () => saveConsent(false, false));
        }

        if (cookieCustomize) {
            cookieCustomize.addEventListener('click', () => {
                if (cookieOptions) {
                    const isVisible = cookieOptions.style.display !== 'none';
                    cookieOptions.style.display = isVisible ? 'none' : 'flex';
                    cookieCustomize.textContent = isVisible ? t('cookie_customize') : t('cookie_save');

                    // If saving preferences
                    if (isVisible) {
                        const analytics = document.getElementById('cookieAnalytics');
                        const marketing = document.getElementById('cookieMarketing');
                        saveConsent(
                            analytics ? analytics.checked : false,
                            marketing ? marketing.checked : false
                        );
                    }
                }
            });
        }

        // Re-open cookie settings from footer link
        if (openCookieSettings) {
            openCookieSettings.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('cookieConsent');
                if (cookieOptions) cookieOptions.style.display = 'none';
                if (cookieCustomize) cookieCustomize.textContent = t('cookie_customize');
                cookieBanner.classList.add('cookie-banner--visible');
            });
        }
    }

    // ---------- SMOOTH SCROLL (fallback) ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
