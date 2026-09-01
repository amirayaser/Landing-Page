/* ============================================================
   SJ ADV. — Landing Page JavaScript
   Modules:
     1.  i18n (English + Arabic translations)
     2.  Theme system (dark/light + localStorage)
     3.  Language system (en/ar + localStorage + dir switching)
     4.  Navigation (scroll state, mobile menu, active link)
     5.  Scroll reveal (IntersectionObserver + failsafe)
     6.  Portfolio filter
     7.  Scroll progress + back-to-top
     8.  Smooth scroll for anchor links
     9.  Init
   ============================================================ */

(() => {
  'use strict';

  /* ============== 1. i18n ============== */
  const translations = {
    en: {
      'brand.tagline': 'CREATIVE BOARD ',

      'nav.home':         'Home',
      'nav.services':     'Services',
      'nav.about':        'About',
      'nav.work':         'Work',
      'nav.testimonials': 'Reviews',
      'nav.contact':      'Contact',
      'nav.cta':          'Start your project',

      'hero.eyebrow':       'Visual design that makes the difference',
      'hero.title.l1':      'I design your ideas',
      'hero.title.l2':      'and turn them into a strong brand',
      'hero.desc':          'Graphic designer specialized in social media design, visual identity, and ads — crafted to set your brand apart from the competition.',
      'hero.cta.primary':   'Contact me on WhatsApp',
      'hero.cta.secondary': 'View my work',
      'hero.socials.label': 'Follow me on:',
      'hero.badge.designs': 'designs delivered',
      'hero.badge.pixel':   'Precision in every detail',
      'hero.scroll':        'SCROLL',

      'services.eyebrow':  'My services',
      'services.title':    'Designs that express you',
      'services.desc':     'Carefully crafted visual solutions that give your brand a clear, professional presence.',
      'services.s1.title': 'Social Media Design',
      'services.s1.desc':  'Professional designs for social platforms that grab attention and drive engagement.',
      'services.s2.title': 'Visual Identity',
      'services.s2.desc':  'Logos and integrated visual identities that reflect your brand\'s personality.',
      'services.s3.title': 'Ad Design',
      'services.s3.desc':  'Professional ad creatives that increase your sales and highlight your services smartly.',
      'services.s4.title': 'Print Design',
      'services.s4.desc':  'Brochures, flyers, business cards, and everything print — delivered in high quality.',
      'services.s5.title': 'Video Design',
      'services.s5.desc':  'Creative motion graphics videos that deliver your message with impact.',

      'caps.eyebrow': 'Capabilities',
      'caps.title':   'What I create',
      'caps.desc':    'Five disciplines, one creative direction.',
      'caps.c1.title':'Social Campaigns',
      'caps.c1.tag':  'Design your message clearly',
      'caps.c2.title':'Digital Ads',
      'caps.c2.tag':  'Ads that drive results',
      'caps.c3.title':'Visual Identity',
      'caps.c3.tag':  'An identity that sticks',
      'caps.c4.title':'Print Design',
      'caps.c4.tag':  'Details that make the difference',
      'caps.c5.title':'Visual Content',
      'caps.c5.tag':  'Content that grabs attention',
      'caps.badge':   'complete projects',

      'work.eyebrow': 'My work',
      'work.title':   'Samples of my work',
      'work.desc':    'Selected pieces that show my approach: clear, bold, and consistent design.',
      'work.f.all':    'All',
      'work.f.social': 'Social Media',
      'work.f.ads':    'Ads',
      'work.f.brand':  'Identity',
      'work.f.other':  'Other',
      'work.p0.title': 'SJ ADV — Creative Identity',
      'work.p0.cat':   'Identity · Brand',
      'work.p1.title': 'Biology Equation',
      'work.p1.cat':   'Social · Education',
      'work.p2.title': 'Global YouTuber',
      'work.p2.cat':   'Ad · Creator',
      'work.p3.title': 'Lab Show',
      'work.p3.cat':   'Social · Entertainment',
      'work.p4.title': 'Programming Star',
      'work.p4.cat':   'Ad · Education',
      'work.p5.title': 'The Challenge',
      'work.p5.cat':   'Social · Show',
      'work.p6.title': 'Episode One',
      'work.p6.cat':   'Other · Drama',
      'work.more':     'View more work',

      'about.eyebrow': 'About me',
      'about.title':   'My passion is turning ideas into designs that make a difference',
      'about.p1':      'Graphic designer with experience in visual identity, social media, and ad design. I believe good design communicates the message clearly and gives the brand a real visual presence.',
      'about.stat1':   'designs delivered',
      'about.stat2':   'happy clients',
      'about.stat3':   'years experience',
      'about.badge':   'complete projects',
      'about.cta':     'Contact me',

      'testi.eyebrow': 'Client reviews',
      'testi.title':   'What my clients say',
      'testi.desc':    'Real feedback from clients I\'ve worked with.',
      'testi.t1.text': 'Fast execution and precise attention to detail. The result was better than I expected, and the communication was highly professional.',
      'testi.t1.name': 'Mohammed',
      'testi.t1.role': 'Business Owner',
      'testi.t2.text': 'The social media designs started making a real difference for us. Clear ideas, clean work, and excellent commitment.',
      'testi.t2.name': 'Sara',
      'testi.t2.role': 'Marketing Manager',
      'testi.t3.text': 'Professional communication and very distinctive designs. He understood the brief quickly and took the identity to a different level.',
      'testi.t3.name': 'Ahmed',
      'testi.t3.role': 'Brand Owner',

      'cta.eyebrow':  'Ready to start?',
      'cta.title':    'Ready to start your next project?',
      'cta.desc':     'Get in touch now and get a professional design that sets your brand apart and leaves a lasting impression.',
      'cta.whatsapp': 'Chat on WhatsApp',
      'cta.email':    'Send an email',

      'footer.tagline':        'Designs that make creators and brands impossible to ignore.',
      'footer.nav.title':      'Navigate',
      'footer.services.title': 'Services',
      'footer.contact.title':  'Get in touch',
      'footer.rights':         'All rights reserved.',
      'footer.made':           'Designed & built with care.',
    },

    ar: {
      'brand.tagline': 'CREATIVE BOARD / 2026',

      'nav.home':         'الرئيسية',
      'nav.services':     'الخدمات',
      'nav.about':        'من أنا',
      'nav.work':         'أعمالي',
      'nav.testimonials': 'آراء العملاء',
      'nav.contact':      'تواصل معي',
      'nav.cta':          'ابدأ مشروعك الآن',

      'hero.eyebrow':       'تصميم بصري يصنع الفرق',
      'hero.title.l1':      'أصمم أفكارك',
      'hero.title.l2':      'أحولها لعلامة قوية',
      'hero.desc':          'مصمم جرافيك متخصص في تصميمات السوشيال ميديا، الهويات البصرية، والإعلانات باحترافية تميز براندك عن المنافسين.',
      'hero.cta.primary':   'تواصل معي واتساب',
      'hero.cta.secondary': 'مشاهدة أعمالي',
      'hero.socials.label': 'تابعني على',
      'hero.badge.designs': 'تصميم منفذ',
      'hero.badge.pixel':   'دقة في كل تفصيلة',
      'hero.scroll':        'SCROLL',

      'services.eyebrow':  'خدماتي',
      'services.title':    'أقدم لك تصاميم تعبر عنك',
      'services.desc':     'حلول بصرية مصممة بعناية لتمنح علامتك حضورًا واضحًا واحترافيًا.',
      'services.s1.title': 'تصميم سوشيال ميديا',
      'services.s1.desc':  'تصاميم احترافية لمنصات السوشيال ميديا تجذب الانتباه وتحفز التفاعل.',
      'services.s2.title': 'الهوية البصرية',
      'services.s2.desc':  'تصميم شعارات وهويات بصرية متكاملة تعكس شخصية براندك.',
      'services.s3.title': 'تصميم إعلانات',
      'services.s3.desc':  'تصاميم إعلانية احترافية تزيد من مبيعاتك وتبرز خدماتك بذكاء.',
      'services.s4.title': 'تصميم مطبوعات',
      'services.s4.desc':  'بروشورات، فلاير، كروت أعمال وكل ما يخص المطبوعات بجودة عالية.',
      'services.s5.title': 'تصميم فيديوهات',
      'services.s5.desc':  'تصميم فيديوهات موشن جرافيك إبداعية لإيصال رسالتك بشكل أقوى.',

      'caps.eyebrow': 'قدراتي',
      'caps.title':   'ماذا أُبدع',
      'caps.desc':    'خمس تخصصات، رؤية إبداعية واحدة.',
      'caps.c1.title':'حملات سوشيال',
      'caps.c1.tag':  'صمّم رسالتك بوضوح',
      'caps.c2.title':'إعلانات رقمية',
      'caps.c2.tag':  'إعلانات تحقق نتائج',
      'caps.c3.title':'هوية بصرية',
      'caps.c3.tag':  'هوية تبقى في الذاكرة',
      'caps.c4.title':'مطبوعات',
      'caps.c4.tag':  'تفاصيل تصنع الفرق',
      'caps.c5.title':'محتوى بصري',
      'caps.c5.tag':  'محتوى يجذب الانتباه',
      'caps.badge':   'مشروع متكامل',

      'work.eyebrow':  'أعمالي',
      'work.title':    'نماذج من أعمالي',
      'work.desc':     'نماذج مختارة توضح أسلوبي في بناء تصميم واضح، جريء، ومتناسق.',
      'work.f.all':    'الكل',
      'work.f.social': 'سوشيال ميديا',
      'work.f.ads':    'إعلانات',
      'work.f.brand':  'هوية بصرية',
      'work.f.other':  'أخرى',
      'work.p0.title': 'SJ ADV — Creative Identity',
      'work.p0.cat':   'مشروع واجهة وهوية',
      'work.p1.title': 'معادلة الأحياء',
      'work.p1.cat':   'سوشيال · تعليمي',
      'work.p2.title': 'يوتيوبر عالمي',
      'work.p2.cat':   'إعلان · صانع محتوى',
      'work.p3.title': 'برنامج المختبر',
      'work.p3.cat':   'سوشيال · ترفيهي',
      'work.p4.title': 'نجم البرمجة',
      'work.p4.cat':   'إعلان · تعليمي',
      'work.p5.title': 'التحدي',
      'work.p5.cat':   'سوشيال · برنامج',
      'work.p6.title': 'الحلقة الأولى',
      'work.p6.cat':   'أخرى · درامي',
      'work.more':     'عرض المزيد من الأعمال',

      'about.eyebrow': 'من أنا',
      'about.title':   'شغفي هو تحويل الأفكار لتصاميم تصنع فرقًا',
      'about.p1':      'انا سمير مصمم جرافيك بخبرة في تصميم الهوية البصرية، السوشيال ميديا والإعلانات. أؤمن أن التصميم الجيد هو الذي يوصل الرسالة بوضوح ويمنح البراند حضورًا بصريًا حقيقيًا.',
      'about.stat1':   'تصميم منفذ',
      'about.stat2':   'عميل سعيد',
      'about.stat3':   'سنوات خبرة',
      'about.badge':   'مشروع متكامل',
      'about.cta':     'تواصل معي',

      'testi.eyebrow': 'آراء العملاء',
      'testi.title':   'ماذا يقول عملائي',
      'testi.desc':    'تعليقات  من عملاء عملت معهم.',
      'testi.t1.text': 'سرعة في التنفيذ ودقة في التفاصيل. النتيجة كانت أفضل مما توقعت والتعامل كان محترفًا جدًا.',
      'testi.t1.name': 'محمد',
      'testi.t1.role': 'صاحب مشروع',
      'testi.t2.text': 'تصاميم السوشيال ميديا بدأت تفرق معنا فعلًا. أفكار واضحة وشغل مرتب والتزام ممتاز.',
      'testi.t2.name': 'سارة',
      'testi.t2.role': 'مديرة تسويق',
      'testi.t3.text': 'تعامل احترافي وتصاميم مميزة جدًا. فهم المطلوب بسرعة وأخذ الهوية لمستوى مختلف.',
      'testi.t3.name': 'أحمد',
      'testi.t3.role': 'صاحب براند',

      'cta.eyebrow':  'جاهز نبدأ؟',
      'cta.title':    'جاهز نبدأ مشروعك التالي؟',
      'cta.desc':     'تواصل معي الآن واحصل على تصميم احترافي يميز براندك ويترك انطباعًا لا يُنسى.',
      'cta.whatsapp': 'تواصل على واتساب',
      'cta.email':    'إرسال بريد إلكتروني',

      'footer.tagline':        'تصاميم تجعل صنّاع المحتوى والعلامات مستحيل تجاهلهم.',
      'footer.nav.title':      'تصفّح',
      'footer.services.title': 'الخدمات',
      'footer.contact.title':  'تواصل معنا',
      'footer.rights':         'جميع الحقوق محفوظة.',
      'footer.made':           'صُمّم وبُني بعناية.',
    }
  };

  /* ============== 2. Theme system ============== */
  const THEME_KEY = 'sjadv-theme';
  const LANG_KEY  = 'sjadv-lang';

  const getStoredTheme = () => localStorage.getItem(THEME_KEY);
  const getStoredLang  = () => localStorage.getItem(LANG_KEY);

  const getPreferredTheme = () => {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const getPreferredLang = () => {
    const stored = getStoredLang();
    if (stored === 'en' || stored === 'ar') return stored;
    return 'ar';
  };

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#f5f5f7');
  }

  function initTheme() {
    applyTheme(getPreferredTheme());
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ============== 3. Language system ============== */
  function applyLang(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = dict[key];
      if (text) el.textContent = text;
    });

    if (lang === 'ar') {
      document.title = 'SJ ADV. — مصمم جرافيك متخصص في الهوية البصرية والسوشيال ميديا';
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', 'مصمم جرافيك متخصص في تصميمات السوشيال ميديا، الهويات البصرية، والإعلانات باحترافية تميز براندك عن المنافسين.');
    } else {
      document.title = 'SJ ADV. — Graphic Designer Specialized in Visual Identity & Social Media';
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', 'Graphic designer specialized in social media design, visual identity, and ads — crafted to set your brand apart from the competition.');
    }

    const langLabel = document.querySelector('#langToggle .lang-label');
    if (langLabel) langLabel.textContent = lang === 'ar' ? 'EN' : 'ع';
  }

  function initLanguage() {
    applyLang(getPreferredLang());
    const toggle = document.getElementById('langToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('lang');
      const next = current === 'ar' ? 'en' : 'ar';
      applyLang(next);
      localStorage.setItem(LANG_KEY, next);
    });
  }

  /* ============== 4. Navigation ============== */
  function initNavigation() {
    const nav      = document.getElementById('nav');
    const burger   = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    const links    = document.querySelectorAll('.nav__link');
    const sections = [...links]
      .map(l => document.querySelector(l.getAttribute('href')))
      .filter(Boolean);

    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger && navLinks) {
      burger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open && window.innerWidth <= 860 ? 'hidden' : '';
      });

      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          navLinks.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      document.addEventListener('click', e => {
        if (!navLinks.classList.contains('is-open')) return;
        if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
          navLinks.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    if (sections.length) {
      const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach(l => {
              l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(s => spy.observe(s));
    }
  }

  /* ============== 5. Scroll reveal ============== */
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Safety fallback: never leave content hidden.
    const failsafe = setTimeout(() => {
      items.forEach(el => el.classList.add('is-in'));
    }, 1500);

    if (!('IntersectionObserver' in window)) {
      clearTimeout(failsafe);
      items.forEach(el => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
      if ([...items].every(el => el.classList.contains('is-in'))) {
        clearTimeout(failsafe);
        obs.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

    items.forEach(el => io.observe(el));
  }

  /* ============== 6. Portfolio filter ============== */
  function initFilters() {
    const filters = document.querySelectorAll('.filter');
    const cards   = document.querySelectorAll('.work-card');
    if (!filters.length || !cards.length) return;

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;

        cards.forEach(card => {
          const cats = (card.dataset.cat || '').split(' ');
          const show = cat === 'all' || cats.includes(cat);
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ============== 7. Scroll progress + back-to-top ============== */
  function initScrollUtilities() {
    const progress = document.querySelector('.scroll-progress span');
    const toTop    = document.getElementById('toTop');

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (progress) progress.style.width = pct + '%';
      if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 600);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });

    if (toTop) {
      toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ============== 8. Smooth scroll + year ============== */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
        const y = target.getBoundingClientRect().top + window.scrollY - navH + 2;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ============== 9. Init ============== */
  function init() {
    applyTheme(getPreferredTheme());
    applyLang(getPreferredLang());

    initTheme();
    initLanguage();
    initNavigation();
    initScrollReveal();
    initFilters();
    initScrollUtilities();
    initSmoothAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
