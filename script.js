// ==========================================
// MODERN PORTFOLIO - ENHANCED JAVASCRIPT
// WITH MULTI-LANGUAGE SUPPORT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // PROJECTS DATA
  // ==========================================

  const projectsData = {
    ar: [
      {
        id: "p5",
        title: "تطبيق كوين",
        year: "2025",
        description:
          "تطبيق تواصل اجتماعي يحتوي على منشورات وتعليقات ويجمع ما بين تفاعل المستخدمين من نشر قصصهم و المحادثات الجماعية او الفردية كما يحتوي على نظام متجر مصغر وبنظام النقد او الاقساط, كما يمكن تجربة التطبيق عبر التحميل من المتجر من الرابط https://play.google.com/store/apps/details?id=com.hamza2190.koin.or&pcampaignid=web_share",
        tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
        imageCount: 27,
      },
      {
        id: "p6",
        title: "نظام إدارة تشغيل الفنادق",
        year: "2025",
        description:
          "برنامج فندقي خاص لشركة الايوان لتشغيل الفنادق السعودية يعمل على ادارة حجز الغرف وصيانتها",
        tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
        imageCount: 11,
      },
      {
        id: "p1",
        title: "نظام إدارة شركات المدينة المنورة للحج والعمرة",
        year: "2024",
        description:
          "حل مكتبي متكامل لإدارة الرحلات، الحجوزات، الفواتير والتقارير. يوفّر لوحة تحكم ومكاتب خلفية لإدارة العمليات.",
        tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
        imageCount: 17,
      },
      {
        id: "p4",
        title: "تطبيق البارون",
        year: "2023",
        description:
          "منصة تواصل ومكافآت مع تجربة مستخدم بسيطة ونظام نقاط متطور ومكافآت قابلة للاسترداد.",
        tags: ["Flutter", "Express.js", "Nodejs", "MongoDB", "REST APIs"],
        imageCount: 26,
      },
      {
        id: "p2",
        title: "ROZ NET — نظام إدارة مزودي الإنترنت",
        year: "2022",
        description:
          "نظام SaaS لإدارة الاشتراكات والفوترة ومراقبة الأبراج الشبكية مع تقارير تحليلية وديناميكية.",
        tags: [
          "Flutter",
          "MongoDB",
          "APIs",
          "REST APIs",
          "Express.js",
          "Node.js",
        ],
        imageCount: 33,
      },
      {
        id: "p3",
        title: "روز نت المشتركين",
        year: "2023",
        description: "هذا التطبيق المخصص للمشتركين وهو استكمال للتطبيق الاول",
        tags: ["Flutter", "API"],
        imageCount: 8,
      },
    ],
    en: [
      {
        id: "p5",
        title: "Koin App",
        year: "2025",
        description:
          "A social networking app featuring posts and comments that brings together user interactions through sharing stories and group or individual chats. It also includes a mini store system with cash or installment payment options. You can try the app by downloading it from the store at https://play.google.com/store/apps/details?id=com.hamza2190.koin.or&pcampaignid=web_share",
        tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
        imageCount: 27,
      },
      {
        id: "p6",
        title: "Hotel Management System",
        year: "2025",
        description:
          "A specialized hotel program for Al-Iwan Company to operate Saudi hotels, managing room reservations and maintenance",
        tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
        imageCount: 11,
      },
      {
        id: "p1",
        title: "Madinah Hajj & Umrah Management System",
        year: "2024",
        description:
          "A comprehensive desktop solution for managing trips, reservations, invoices, and reports. Provides a control panel and back offices for operations management.",
        tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
        imageCount: 17,
      },
      {
        id: "p4",
        title: "Baron App",
        year: "2023",
        description:
          "A communication and rewards platform with a simple user experience, advanced points system, and redeemable rewards.",
        tags: ["Flutter", "Express.js", "Nodejs", "MongoDB", "REST APIs"],
        imageCount: 26,
      },
      {
        id: "p2",
        title: "ROZ NET — ISP Management System",
        year: "2022",
        description:
          "A SaaS system for managing subscriptions, billing, and network tower monitoring with analytical and dynamic reports.",
        tags: [
          "Flutter",
          "MongoDB",
          "APIs",
          "REST APIs",
          "Express.js",
          "Node.js",
        ],
        imageCount: 33,
      },
      {
        id: "p3",
        title: "Roz Net Subscribers",
        year: "2023",
        description:
          "This app is dedicated to subscribers and is a continuation of the first application",
        tags: ["Flutter", "API"],
        imageCount: 8,
      },
    ],
  };

  // ==========================================
  // LANGUAGE SYSTEM
  // ==========================================

  let currentLang = localStorage.getItem("language") || detectBrowserLanguage();

  function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith("ar") ? "ar" : "en";
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("language", lang);

    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    // Update all translatable elements
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });

    // Update elements with i18n-attr attribute (for attributes like placeholder, title, etc.)
    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      const attrData = element.getAttribute("data-i18n-attr");
      const [attr, key] = attrData.split(":");
      if (translations[lang] && translations[lang][key]) {
        element.setAttribute(attr, translations[lang][key]);
      }
    });

    // Update page title
    const titleKey = document.querySelector("title").getAttribute("data-i18n");
    if (titleKey && translations[lang][titleKey]) {
      document.title = translations[lang][titleKey];
    }

    // Update lang toggle button text
    const langToggleText = document.querySelector(".lang-text");
    if (langToggleText) {
      langToggleText.textContent = lang === "ar" ? "EN" : "عربي";
    }

    // Update code window name
    const codeName = document.getElementById("code-name");
    if (codeName && translations[lang]["code-name"]) {
      codeName.textContent = `'${translations[lang]["code-name"]}'`;
    }

    // Re-render projects with new language
    renderProjects();
  }

  // Language toggle button
  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const newLang = currentLang === "ar" ? "en" : "ar";
      setLanguage(newLang);
    });
  }

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  const loaderWrapper = document.querySelector(".loader-wrapper");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loaderWrapper.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 1500);
  });

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.getElementById("menuToggle");
  const navLinkItems = document.querySelectorAll(".nav-link");

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for styling
    if (currentScroll > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 300) {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }

    lastScroll = currentScroll;

    // Update active nav link based on scroll position
    updateActiveNavLink();
  });

  // Mobile menu toggle
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when clicking a link
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Smooth scroll for navigation links
  navLinkItems.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Update active nav link
  function updateActiveNavLink() {
    const sections = document.querySelectorAll(".section, .hero-section");
    const scrollPos = window.pageYOffset + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinkItems.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // ==========================================
  // SCROLL ANIMATIONS
  // ==========================================

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Animate skill progress bars
        if (entry.target.classList.contains("skill-category")) {
          animateSkillBars(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe all animate-on-scroll elements
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });

  // Animate skill progress bars
  function animateSkillBars(categoryElement) {
    const progressBars = categoryElement.querySelectorAll(".skill-progress");
    progressBars.forEach((bar, index) => {
      setTimeout(() => {
        const progress = bar.getAttribute("data-progress");
        bar.style.setProperty("--progress", progress + "%");
        bar.style.width = progress + "%";
        bar.classList.add("animated");
      }, index * 100);
    });
  }

  // ==========================================
  // RENDER PROJECTS
  // ==========================================

  const projectsGrid = document.getElementById("projects-grid");

  function renderProjects() {
    const projects = projectsData[currentLang] || projectsData.ar;

    if (projectsGrid) {
      projectsGrid.innerHTML = projects
        .map((p) => createProjectCard(p))
        .join("");

      // Add scroll animation to project cards
      document.querySelectorAll(".project-card").forEach((card) => {
        card.classList.add("animate-on-scroll");
        observer.observe(card);
      });
    }
  }

  function createProjectCard(project) {
    const imagesHtml = Array.from(
      { length: project.imageCount },
      (_, i) => `
      <img 
        src="assets/projects/${project.id}/p (${i + 1}).png" 
        alt="لقطة شاشة ${i + 1} من مشروع ${project.title}" 
        loading="lazy" 
      />
    `
    ).join("");

    const tagsHtml = project.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    return `
      <article class="project-card">
        <div class="project-head">
          <h3>${project.title}</h3>
          <div class="project-year">${project.year}</div>
        </div>
        <p class="project-desc">${project.description}</p>
        <div class="project-images" data-project-id="${project.id}">${imagesHtml}</div>
        <div class="tech-list">${tagsHtml}</div>
      </article>
    `;
  }

  // ==========================================
  // IMAGE MODAL VIEWER
  // ==========================================

  const modal = document.getElementById("modal");
  const viewerImg = document.getElementById("viewerImg");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let currentGallery = [];
  let currentIndex = 0;

  // Use event delegation for dynamically added images
  projectsGrid.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      openModalFor(e.target);
    }
  });

  function openModalFor(imgEl) {
    const galleryContainer = imgEl.closest(".project-images");
    if (!galleryContainer) return;

    currentGallery = Array.from(galleryContainer.querySelectorAll("img"));
    currentIndex = currentGallery.indexOf(imgEl);

    showAt(currentIndex);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function showAt(idx) {
    if (currentGallery.length === 0) return;
    currentIndex = (idx + currentGallery.length) % currentGallery.length;
    const img = currentGallery[currentIndex];
    viewerImg.src = img.src;
    viewerImg.alt = img.alt || "صورة المشروع";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    viewerImg.src = "";
    document.body.style.overflow = "";
  }

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showAt(currentIndex + 1); // RTL: prev is actually next
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showAt(currentIndex - 1); // RTL: next is actually prev
  });

  document
    .getElementById("modal-close-btn")
    .addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (modal.classList.contains("open")) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showAt(currentIndex - 1);
      if (e.key === "ArrowRight") showAt(currentIndex + 1);
    }
  });

  // ==========================================
  // SCROLL TO TOP BUTTON
  // ==========================================

  const scrollTopBtn = document.getElementById("scrollTop");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 500) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // ==========================================
  // FOOTER YEAR
  // ==========================================

  document.getElementById("year").textContent = new Date().getFullYear();

  // ==========================================
  // PARALLAX EFFECT FOR HERO
  // ==========================================

  const heroSection = document.querySelector(".hero-section");
  const floatingShapes = document.querySelectorAll(".shape");

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (heroSection && scrolled < window.innerHeight) {
      floatingShapes.forEach((shape, index) => {
        const speed = parallaxSpeed + index * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }
  });

  // ==========================================
  // TYPEWRITER EFFECT (Optional)
  // ==========================================

  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = "";

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // ==========================================
  // PERFORMANCE OPTIMIZATION
  // ==========================================

  // Lazy load images
  if ("loading" in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
    document.body.appendChild(script);
  }

  // ==========================================
  // CONSOLE MESSAGE
  // ==========================================

  console.log(
    "%c🚀 Portfolio Website",
    "color: #6366f1; font-size: 24px; font-weight: bold;"
  );
  console.log(
    "%c👨‍💻 Developed by Omer Al-Dabbagh",
    "color: #ec4899; font-size: 16px;"
  );
  console.log(
    "%c💼 Looking for a developer? Let's connect!",
    "color: #10b981; font-size: 14px;"
  );

  // Initialize language system (after all DOM elements are defined)
  setLanguage(currentLang);
});
