(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Mobile menu
  const navToggle = $('.nav__toggle');
  const navList = $('#nav-list');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList?.setAttribute('aria-expanded', String(!expanded));
  });

  // Theme toggle
  $('#themeSwitch')?.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch(_) {}
  });

  // Back to top + year
  $('#backToTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Telegram links: prefer username (web), otherwise deep link by phone (app)
  function applyTelegramLinks() {
    $$('#heroTelegram, #contactTelegram, #infoTelegram').forEach(a => {
      const username = a.getAttribute('data-telegram-username')?.trim();
      const phone = a.getAttribute('data-telegram-phone')?.replace(/[^\d+]/g, '');
      if (username) {
        a.href = `https://t.me/${username}`;
        if (a.id === 'infoTelegram') a.textContent = `@${username}`;
      } else if (phone) {
        a.href = `tg://resolve?phone=${phone}`;
        if (a.id === 'infoTelegram') a.textContent = `+${phone}`;
      }
    });
  }

  // Simple form validation
  const form = $('#contactForm');
  const hint = $('#formHint');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    const consent = data.get('consent');

    if (!name || !email || !message || !consent) {
      hint.textContent = i18n('form.error');
      return;
    }
    fetch('/', { method: 'POST', body: data })
      .then(() => { hint.textContent = i18n('form.ok'); form.reset(); })
      .catch(() => { hint.textContent = i18n('form.fail'); });
  });

  // I18N
  const translations = {
    ru: {
      'meta.title': 'Clarity — Мы делаем сайты для бизнеса под ключ',
      'meta.description': 'Clarity — молодая команда для европейского рынка. Простой процесс, понятные цены, быстрый результат. Landing, корпоративные сайты и e-commerce.',
      'common.skip': 'К содержанию',
      'nav.menu': 'Меню',
      'nav.services': 'Услуги',
      'nav.process': 'Процесс',
      'nav.cases': 'Кейсы',
      'nav.pricing': 'Цены/FAQ',
      'nav.contact': 'Контакты',
      'cta.request': 'Оставить заявку',
      'cta.telegram': 'Написать в Telegram',
      'cta.whatsapp': 'Написать в WhatsApp',
      'cta.discuss': 'Обсудить',
      'cta.map': 'Открыть на карте',
      'cta.top': 'Наверх',
      'cta.send': 'Отправить',
      'hero.title': 'Мы делаем сайты для бизнеса под ключ',
      'hero.subtitle': 'Простой процесс, понятные цены, быстрый результат. Работаем с клиентами по всему миру.',
      'hero.eu1': 'EU-friendly процессы',
      'hero.eu2': 'Договор и инвойсы',
      'hero.eu3': 'Оплата: SEPA/Stripe/PayPal',
      'about.title': 'О нас',
      'about.p1': 'Мы — молодая команда, которая помогает предпринимателям и компаниям запускать сайты без лишней головной боли. Вы работаете с нами, мы берём на себя организацию, а техническую часть выполняют проверенные разработчики.',
      'about.p2': 'Фокус на европейском рынке: прозрачные процессы, сроки и коммуникация на русском/английском.',
      'services.title': 'Услуги / Форматы',
      'services.subtitle': 'Фикс-пакеты с понятными ценами. Можно кастомизировать под задачу.',
      'services.landing.title': 'Landing Page',
      'services.landing.price': 'от <strong>$300</strong>',
      'services.landing.i1': '1–3 экрана, быстрый запуск',
      'services.landing.i2': 'Адаптив, базовое SEO',
      'services.landing.i3': 'Подключение формы/мессенджеров',
      'services.corp.title': 'Корпоративный сайт',
      'services.corp.price': 'от <strong>$600</strong>',
      'services.corp.i1': '5–10 страниц, блог/новости',
      'services.corp.i2': 'CMS (Headless или WP)',
      'services.corp.i3': 'SEO-структура, аналитика',
      'services.shop.title': 'Интернет-магазин',
      'services.shop.price': 'от <strong>$1000</strong>',
      'services.shop.i1': 'Каталог, корзина, оплата',
      'services.shop.i2': 'Интеграции (Stripe/PayPal)',
      'services.shop.i3': 'Отчёты и метрики продаж',
      'services.note': 'Цены ориентировочные; финальная смета зависит от объёма и сроков.',
      'process.title': 'Процесс работы',
      'process.s1': 'Вы оставляете заявку.',
      'process.s2': 'Мы уточняем детали и согласовываем цену.',
      'process.s3': 'Наши разработчики делают сайт.',
      'process.s4': 'Вы получаете готовый продукт и поддержку.',
      'cases.title': 'Кейсы / Примеры',
      'cases.c1.title': 'Кофейня “Roast & Joy”',
      'cases.c1.p': 'Лендинг с меню, отзывами и бронированием. Время запуска — 5 дней.',
      'cases.c1.kpi1': '<strong>+27%</strong> офлайн-заказов',
      'cases.c1.kpi2': '<strong>1.1s</strong> LCP',
      'cases.c2.title': 'Ивент-агентство “Nova Events”',
      'cases.c2.p': 'Портфолио + лид-форма, интеграция с календарём.',
      'cases.c2.kpi1': '<strong>+35%</strong> лидов',
      'cases.c2.kpi2': '<strong>99.9%</strong> аптайм',
      'cases.c3.title': 'Портфолио фотографа',
      'cases.c3.p': 'Галерея, лайтовая анимация, запросы на съёмку.',
      'cases.c3.kpi1': '<strong>+2.3x</strong> заявки',
      'cases.c3.kpi2': '<strong>0 CLS</strong> галерея',
      'testimonials.title': 'Отзывы',
      'testimonials.text': 'Наши клиенты ценят скорость, простоту и понятность работы с нами.',
      'pricing.title': 'Цены и FAQ',
      'pricing.includes.title': 'Что входит',
      'pricing.includes.i1': 'Адаптивный дизайн и верстка',
      'pricing.includes.i2': 'Базовое SEO и аналитика',
      'pricing.includes.i3': 'Форма заявок, интеграции мессенджеров',
      'pricing.includes.i4': 'Оптимизация скорости (Core Web Vitals)',
      'pricing.includes.i5': 'Гарантия и поддержка 30 дней',
      'faq.q1': 'Как быстро вы делаете сайт?',
      'faq.a1': 'От 1 до 3 недель, в зависимости от сложности и объёма.',
      'faq.q2': 'Можно ли работать с вами из другой страны?',
      'faq.a2': 'Да. Принимаем международные платежи (SEPA/Stripe/PayPal), подписываем договор и инвойсы.',
      'contact.title': 'Оставить заявку',
      'contact.subtitle': 'Опишите задачу — пришлём смету и сроки.',
      'contact.name': 'Имя',
      'contact.email': 'Email',
      'contact.message': 'Сообщение',
      'contact.name_ph': 'Ваше имя',
      'contact.email_ph': 'you@company.com',
      'contact.message_ph': 'Кратко о задаче',
      'contact.consent': 'Согласен(а) на обработку персональных данных (GDPR-friendly, без cookies)',
      'contact.policy': 'Нажимая “Отправить”, вы соглашаетесь с политикой конфиденциальности.',
      'contact.contacts': 'Контакты',
      'contact.address_label': 'Адрес:',
      'footer.tagline': 'Молодая команда, ясные решения.',
      'form.error': 'Проверьте поля формы.',
      'form.ok': 'Спасибо! Мы свяжемся с вами в течение 24 часов.',
      'form.fail': 'Ошибка отправки. Напишите нам на hello@clarity.example'
    },
    en: {
      'meta.title': 'Clarity — Full-cycle business websites',
      'meta.description': 'Clarity for the EU market. Simple process, transparent pricing, fast delivery. Landing pages, corporate sites, and e-commerce.',
      'common.skip': 'Skip to content',
      'nav.menu': 'Menu',
      'nav.services': 'Services',
      'nav.process': 'Process',
      'nav.cases': 'Work',
      'nav.pricing': 'Pricing/FAQ',
      'nav.contact': 'Contact',
      'cta.request': 'Request a quote',
      'cta.telegram': 'Message on Telegram',
      'cta.whatsapp': 'Message on WhatsApp',
      'cta.discuss': 'Discuss',
      'cta.map': 'Open on map',
      'cta.top': 'Back to top',
      'cta.send': 'Send',
      'hero.title': 'We build business websites end-to-end',
      'hero.subtitle': 'Simple process, transparent pricing, fast outcomes. We work with clients worldwide.',
      'hero.eu1': 'EU-friendly processes',
      'hero.eu2': 'Contract & invoices',
      'hero.eu3': 'Payments: SEPA/Stripe/PayPal',
      'about.title': 'About',
      'about.p1': 'We are a young team helping entrepreneurs and companies launch websites without headaches. You work with us, we handle management, vetted developers do the tech.',
      'about.p2': 'EU focus: transparent process, clear timelines, Russian/English comms.',
      'services.title': 'Services / Packages',
      'services.subtitle': 'Fixed packages with clear pricing. Can be customized.',
      'services.landing.title': 'Landing Page',
      'services.landing.price': 'from <strong>$300</strong>',
      'services.landing.i1': '1–3 sections, quick launch',
      'services.landing.i2': 'Responsive, basic SEO',
      'services.landing.i3': 'Forms/messengers integration',
      'services.corp.title': 'Corporate Website',
      'services.corp.price': 'from <strong>$600</strong>',
      'services.corp.i1': '5–10 pages, blog/news',
      'services.corp.i2': 'CMS (Headless or WP)',
      'services.corp.i3': 'SEO structure, analytics',
      'services.shop.title': 'Online Store',
      'services.shop.price': 'from <strong>$1000</strong>',
      'services.shop.i1': 'Catalog, cart, payments',
      'services.shop.i2': 'Integrations (Stripe/PayPal)',
      'services.shop.i3': 'Sales metrics & reports',
      'services.note': 'Prices are indicative; final quote depends on scope and timelines.',
      'process.title': 'How we work',
      'process.s1': 'You submit a request.',
      'process.s2': 'We clarify details and agree on price.',
      'process.s3': 'Our developers build your site.',
      'process.s4': 'You get a finished product and support.',
      'cases.title': 'Selected work',
      'cases.c1.title': 'Coffee shop “Roast & Joy”',
      'cases.c1.p': 'Menu landing with reviews and booking. Time to launch — 5 days.',
      'cases.c1.kpi1': '<strong>+27%</strong> offline orders',
      'cases.c1.kpi2': '<strong>1.1s</strong> LCP',
      'cases.c2.title': 'Event agency “Nova Events”',
      'cases.c2.p': 'Portfolio + lead form, calendar integration.',
      'cases.c2.kpi1': '<strong>+35%</strong> leads',
      'cases.c2.kpi2': '<strong>99.9%</strong> uptime',
      'cases.c3.title': 'Photographer portfolio',
      'cases.c3.p': 'Gallery, subtle animations, booking requests.',
      'cases.c3.kpi1': '<strong>+2.3x</strong> inquiries',
      'cases.c3.kpi2': '<strong>0 CLS</strong> gallery',
      'testimonials.title': 'Testimonials',
      'testimonials.text': 'Clients value our speed, simplicity, and clarity.',
      'pricing.title': 'Pricing & FAQ',
      'pricing.includes.title': 'What’s included',
      'pricing.includes.i1': 'Responsive design & markup',
      'pricing.includes.i2': 'Basic SEO & analytics',
      'pricing.includes.i3': 'Lead forms, messenger integrations',
      'pricing.includes.i4': 'Core Web Vitals optimization',
      'pricing.includes.i5': '30-day warranty & support',
      'faq.q1': 'How fast do you deliver?',
      'faq.a1': 'From 1 to 3 weeks depending on complexity.',
      'faq.q2': 'Can we work from another country?',
      'faq.a2': 'Yes. We accept international payments (SEPA/Stripe/PayPal) and provide contracts & invoices.',
      'contact.title': 'Request a quote',
      'contact.subtitle': 'Describe your task — we’ll send the estimate and timeline.',
      'contact.name': 'Name',
      'contact.email': 'Email',
      'contact.message': 'Message',
      'contact.name_ph': 'Your name',
      'contact.email_ph': 'you@company.com',
      'contact.message_ph': 'Briefly describe your task',
      'contact.consent': 'I agree to personal data processing (GDPR-friendly, no cookies)',
      'contact.policy': 'By clicking “Send”, you agree to the Privacy Policy.',
      'contact.contacts': 'Contacts',
      'contact.address_label': 'Address:',
      'footer.tagline': 'A young team with clear ideas.',
      'form.error': 'Please check the form fields.',
      'form.ok': 'Thanks! We’ll get back within 24 hours.',
      'form.fail': 'Submission failed. Email us at hello@clarity.example'
    }
  };

  function i18n(key) {
    const lang = localStorage.getItem('lang') || document.documentElement.lang || 'ru';
    return translations[lang]?.[key] ?? translations.ru[key] ?? key;
  }

  function applyI18n(lang) {
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('lang', lang); } catch(_) {}
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const html = i18n(key);
      if (html.includes('<strong') || html.includes('&')) el.innerHTML = html;
      else el.textContent = html;
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', i18n(key));
    });
    // meta
    const titleKey = 'meta.title'; const descKey = 'meta.description';
    document.title = i18n(titleKey);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', i18n(descKey));
    // switcher label
    const btn = $('#langSwitch');
    if (btn) btn.textContent = (lang === 'ru') ? 'EN' : 'RU';
  }

  // Language init (browser preference on first load)
  (function initLang() {
    const saved = localStorage.getItem('lang');
    const detected = saved || (navigator.language?.startsWith('ru') ? 'ru' : 'en');
    applyI18n(detected);
  })();

  $('#langSwitch')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('lang') || 'ru';
    applyI18n(current === 'ru' ? 'en' : 'ru');
  });

  applyTelegramLinks();
})();