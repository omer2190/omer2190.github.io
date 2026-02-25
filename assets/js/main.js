// ==========================================
// MODERN PORTFOLIO - ENHANCED JAVASCRIPT
// WITH MULTI-LANGUAGE SUPPORT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // PROJECTS DATA
  // ==========================================

  // ==========================================
  // PROJECTS DATA
  // ==========================================

  let projectsData = {
    ar: [],
    en: [],
  };

  async function fetchProjects() {
    if (!window.supabaseClient) return;

    try {
      const { data, error } = await window.supabaseClient
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;

      if (data) {
        // Transform Supabase data to our structure
        projectsData.ar = data.map((p) => ({
          id: p.id,
          title: p.title_ar,
          year: p.year,
          description: p.description_ar,
          content: p.content_ar || "", // Full description
          tags: p.tags || [],
          imageCount: p.image_count,
          images: p.images || [],
          link: p.link || null, // Project Link
        }));

        projectsData.en = data.map((p) => ({
          id: p.id,
          title: p.title_en,
          year: p.year,
          description: p.description_en,
          content: p.content_en || "", // Full description
          tags: p.tags || [],
          imageCount: p.image_count,
          images: p.images || [],
          link: p.link || null, // Project Link
        }));

        renderProjects();
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      // Fallback or keep empty
    }
  }

  // Initial fetch
  fetchProjects();

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
    let imagesHtml = "";

    // Check if we have explicit image URLs (from Supabase Storage)
    if (project.images && project.images.length > 0) {
      imagesHtml = project.images
        .map(
          (url, i) => `
        <img 
          src="${url}" 
          alt="لقطة شاشة ${i + 1} من مشروع ${project.title}" 
          loading="lazy" 
        />
      `,
        )
        .join("");
    }
    // Fallback to legacy local filesystem naming convention
    else {
      // If ID is numeric (from Supabase) but we want to map to local folders 'p1', 'p2'...
      const folderId = String(project.id).startsWith("p")
        ? project.id
        : `p${project.id}`;

      imagesHtml = Array.from(
        { length: project.imageCount },
        (_, i) => `
          <img 
            src="assets/projects/${folderId}/p (${i + 1}).png" 
            alt="لقطة شاشة ${i + 1} من مشروع ${project.title}" 
            loading="lazy" 
          />
        `,
      ).join("");
    }

    const tagsHtml = project.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    // Return the project card HTML with a link wrapper
    return `
      <a href="project.html?id=${project.id}" class="project-card-link">
        <article class="project-card">
          <div class="project-head">
            <h3>${project.title}</h3>
            <div class="project-year">${project.year}</div>
          </div>
          <p class="project-desc">${project.description}</p>
          <div class="project-images">${imagesHtml}</div>
          <div class="tech-list">${tagsHtml}</div>
        </article>
      </a>
    `;
  }

  // ==========================================
  // PROJECT DETAILS - NO LONGER NEEDED (using dedicated page)
  // ==========================================
  // PROJECT DETAILS - NAVIGATE TO DEDICATED PAGE
  // ==========================================

  window.openProjectDetails = function (projectId) {
    // Navigate to dedicated project page
    window.location.href = `project.html?id=${projectId}`;
  };

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
    "color: #6366f1; font-size: 24px; font-weight: bold;",
  );
  console.log(
    "%c👨‍💻 Developed by Omer Al-Dabbagh",
    "color: #ec4899; font-size: 16px;",
  );
  console.log(
    "%c💼 Looking for a developer? Let's connect!",
    "color: #10b981; font-size: 14px;",
  );

  // Initialize language system (after all DOM elements are defined)
  setLanguage(currentLang);
});
