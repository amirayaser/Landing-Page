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
     10. Projects — dynamic portfolio from Supabase (skeleton,
         empty/error states, realtime live updates)
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
      'work.empty.title': 'No projects yet',
      'work.empty.desc':  'Selected work will appear here automatically once added from the dashboard.',
      'work.error.title': 'Failed to load projects',
      'work.error.desc':  'Something went wrong while connecting to the database. Check your connection and try again.',
      'work.retry':       'Try again',
      'work.view':        'View project',

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
      'work.empty.title': 'لا توجد مشاريع بعد',
      'work.empty.desc':  'ستظهر نماذج الأعمال هنا تلقائيًا بعد إضافتها من لوحة التحكم.',
      'work.error.title': 'تعذر تحميل الأعمال',
      'work.error.desc':  'حدث خطأ أثناء الاتصال بقاعدة البيانات. تحقق من اتصالك بالإنترنت ثم أعد المحاولة.',
      'work.retry':       'إعادة المحاولة',
      'work.view':        'معاينة المشروع',

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
  // Cards are rendered dynamically from Supabase (module 10), so we cannot
  // cache the card list at init time — applyPortfolioFilter() (hoisted from
  // module 10) queries the live cards on every click instead.
  function initFilters() {
    const filters = document.querySelectorAll('.filter');
    if (!filters.length) return;

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        applyPortfolioFilter(btn.dataset.filter);
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
    initProjects(); // dynamic portfolio (module 10 — Supabase + Realtime)
  }

  /* ============== 10. Projects — dynamic portfolio (Supabase) ============== */
  // Converts the static work grid into live content from public.projects:
  //   • loading skeletons → real cards
  //   • sorted by created_at DESC
  //   • empty state / friendly error state with retry
  //   • Supabase Realtime: INSERT / UPDATE / DELETE appear with NO reload
  // All DB content is inserted through DOM textContent (XSS-safe);
  // URLs are validated with isSafeHttpUrl() before use.
  const SB = window.SJSupabase;

  // Admin dashboard categories → existing filter buttons of the site
  const CATEGORY_TO_FILTER = {
    'تصميم هوية':   'brand',
    'إعلانات':      'ads',
    'موشن':         'other',
    'تصميم مواقع':  'other',
    'سوشيال ميديا': 'social',
    'أخرى':         'other'
  };

  let projectsState = [];   // local mirror of the projects table (newest first)
  let realtimeChannel = null;

  const getWorkElements = () => ({
    grid:  document.getElementById('workGrid'),
    empty: document.getElementById('workEmpty'),
    error: document.getElementById('workError'),
    retry: document.getElementById('workRetry')
  });

  /** Translation lookup for dynamic UI strings (uses the current language). */
  const t = (key) => {
    const lang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';
    return (translations[lang] && translations[lang][key]) || key;
  };

  /** Toggle between grid / empty / error views. */
  function showWorkState(state) {
    const { grid, empty, error } = getWorkElements();
    if (grid)  grid.hidden  = state !== 'grid';
    if (empty) empty.hidden = state !== 'empty';
    if (error) error.hidden = state !== 'error';
  }

  /** Re-inject skeleton cards (initial load + retries). */
  function showSkeletons() {
    const { grid } = getWorkElements();
    if (!grid) return;
    showWorkState('grid');
    grid.textContent = '';
    for (let i = 0; i < 6; i++) {
      const skel = document.createElement('div');
      skel.className = 'work-skeleton';
      skel.setAttribute('aria-hidden', 'true');
      skel.innerHTML =
        '<div class="work-skeleton__media"><span></span></div>' +
        '<div class="work-skeleton__meta">' +
          '<span class="work-skeleton__line work-skeleton__line--title"></span>' +
          '<span class="work-skeleton__line"></span>' +
        '</div>';
      grid.appendChild(skel);
    }
  }

  /** Build one .work-card identical in structure to the original static markup. */
  function buildWorkCard(project) {
    const card = document.createElement('article');
    card.className = 'work-card reveal';
    card.dataset.id = project.id;
    card.dataset.cat = CATEGORY_TO_FILTER[project.category] || 'other';

    // --- media (thumbnail or graceful placeholder) ---
    const media = document.createElement('div');
    media.className = 'work-card__media';
    if (project.image_url && SB.isSafeHttpUrl(project.image_url)) {
      const img = document.createElement('img');
      img.src = project.image_url;
      img.alt = project.title || '';
      img.loading = 'lazy';
      media.appendChild(img);
    } else {
      media.classList.add('work-card__media--empty');
      media.innerHTML =
        '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' +
        '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/>' +
        '<path d="m21 15-4-4-8 8"/></svg>';
    }

    // --- hover meta: title + category + description + optional link ---
    const meta = document.createElement('div');
    meta.className = 'work-card__meta';

    const title = document.createElement('h3');
    title.textContent = project.title || 'بدون عنوان';
    meta.appendChild(title);

    const cat = document.createElement('span');
    cat.textContent = project.category || '';
    meta.appendChild(cat);

    if (project.description) {
      const desc = document.createElement('p');
      desc.className = 'work-card__desc';
      desc.textContent = project.description; // textContent = XSS-safe
      meta.appendChild(desc);
    }

    // if (project.project_url && SB.isSafeHttpUrl(project.project_url)) {
    //   const link = document.createElement('a');
    //   link.className = 'work-card__open';
    //   link.href = project.project_url;
    //   link.target = '_blank';
    //   link.rel = 'noopener noreferrer';
    //   link.setAttribute('aria-label', `${project.title || ''} — ${t('work.view')}`);
    //   link.innerHTML =
    //     '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" style="width:14px;height:14px">' +
    //     '<path d="M14 3h7v7"/><path d="M21 3l-9 9"/></svg>' +
    //     SB.escapeHtml(t('work.view'));
    //   media.appendChild(link); // always visible pill on the media corner
    // }

    card.appendChild(media);
    card.appendChild(meta);
    return card;
  }

  /** Observe rendered cards so they fade in on scroll like the static site did. */
  function observeWorkCards(cards) {
    if (!cards.length) return;
    if (!('IntersectionObserver' in window)) {
      cards.forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    cards.forEach(el => io.observe(el));
  }

  /** Render the whole grid from projectsState (initial load / INSERT / fallback). */
  function renderProjects() {
    const { grid } = getWorkElements();
    if (!grid) return;
    grid.textContent = '';

    if (!projectsState.length) {
      showWorkState('empty');
      return;
    }
    showWorkState('grid');

    const fragment = document.createDocumentFragment();
    const cards = projectsState.map(buildWorkCard);
    cards.forEach(c => fragment.appendChild(c));
    grid.appendChild(fragment);

    applyPortfolioFilter(getActiveFilter()); // respect the currently active filter
    observeWorkCards(cards);
  }

  /** In-place update for a single card (Realtime UPDATE — avoids image flicker). */
  function patchWorkCard(project) {
    const { grid } = getWorkElements();
    const oldCard = grid && grid.querySelector(`.work-card[data-id="${window.CSS && CSS.escape(project.id) || project.id}"]`);
    if (!oldCard) { renderProjects(); return; }
    const fresh = buildWorkCard(project);
    fresh.classList.add('is-in'); // don't replay the entrance animation
    oldCard.replaceWith(fresh);
    applyPortfolioFilter(getActiveFilter());
  }

  /** Animated removal for a single card (Realtime DELETE). */
  function removeWorkCard(id) {
    const { grid, empty } = getWorkElements();
    const card = grid && grid.querySelector(`.work-card[data-id="${window.CSS && CSS.escape(id) || id}"]`);
    if (!card) { renderProjects(); return; }
    card.style.transition = 'opacity 0.3s var(--ease), transform 0.3s var(--ease)';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.remove();
      if (grid && !grid.querySelector('.work-card') && empty) showWorkState('empty');
    }, 320);
  }

  /** Current active filter button value ('all' by default). */
  function getActiveFilter() {
    const active = document.querySelector('.filter.is-active');
    return active ? active.dataset.filter : 'all';
  }

  /** Apply a filter to the live (dynamic) cards — also used by module 6. */
  function applyPortfolioFilter(cat) {
    const { grid } = getWorkElements();
    if (!grid) return;
    grid.querySelectorAll('.work-card').forEach(card => {
      const cats = (card.dataset.cat || '').split(' ').filter(Boolean);
      const show = cat === 'all' || cats.includes(cat);
      card.classList.toggle('is-hidden', !show);
    });
  }

  /** Fetch projects from Supabase, newest first. */
  async function loadProjects() {
    const { grid } = getWorkElements();
    if (!grid) return;

    // Supabase not configured yet → clear setup instructions in the console.
    if (!SB || !SB.configured || !SB.client) {
      console.error('[SJ ADV] supabase.js is not configured. Paste YOUR_SUPABASE_URL ' +
        'and YOUR_SUPABASE_PUBLISHABLE_KEY inside supabase.js.');
      showWorkState('error');
      return;
    }

    showSkeletons();
    try {
      const { data, error } = await SB.client
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      projectsState = data || [];
      renderProjects();
    } catch (error) {
      console.error('[SJ ADV] Failed to load projects:', error);
      showWorkState('error');
    }
  }

  /** Realtime — INSERT / UPDATE / DELETE land on the page without a reload. */
  function subscribeProjectsRealtime() {
    if (!SB || !SB.configured || realtimeChannel) return;
    realtimeChannel = SB.client
      .channel('projects-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, handleRealtimeChange)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') console.info('[SJ ADV] Realtime: live project updates connected.');
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('[SJ ADV] Realtime connection issue:', status);
        }
      });
  }

  function handleRealtimeChange(payload) {
    const row = payload.new && Object.keys(payload.new).length ? payload.new : null;
    const oldRow = payload.old && Object.keys(payload.old).length ? payload.old : null;

    try {
      if (payload.eventType === 'INSERT' && row) {
        // keep newest-first order, then re-render (new card animates in)
        const index = projectsState.findIndex(p => new Date(row.created_at) > new Date(p.created_at));
        if (index === -1) projectsState.push(row);
        else projectsState.splice(index, 0, row);
        renderProjects();
      } else if (payload.eventType === 'UPDATE' && row) {
        const index = projectsState.findIndex(p => p.id === row.id);
        if (index !== -1) projectsState[index] = row;
        else projectsState.unshift(row);
        patchWorkCard(row);
      } else if (payload.eventType === 'DELETE' && oldRow) {
        projectsState = projectsState.filter(p => p.id !== oldRow.id);
        removeWorkCard(oldRow.id);
      }
    } catch (error) {
      // Safety net: any realtime-handling bug must never break the grid.
      console.error('[SJ ADV] Realtime handling failed, refetching:', error);
      loadProjects();
    }
  }

  function initProjects() {
    const { retry, grid } = getWorkElements();
    if (retry) retry.addEventListener('click', loadProjects);

    // Broken thumbnails (deleted storage file / dead URL) → graceful placeholder.
    // 'error' events don't bubble, so we listen in the capture phase on the grid.
    if (grid) {
      grid.addEventListener('error', (event) => {
        const img = event.target;
        if (!img || img.tagName !== 'IMG') return;
        const media = img.parentElement;
        if (media && media.classList.contains('work-card__media')) {
          media.classList.add('work-card__media--empty');
          media.innerHTML =
            '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' +
            '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/>' +
            '<path d="m21 15-4-4-8 8"/></svg>';
        }
      }, true);
    }

    loadProjects();
    subscribeProjectsRealtime();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
