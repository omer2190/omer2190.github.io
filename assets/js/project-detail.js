import { getSupabase } from "./assets/js/config/supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize Supabase
  const supabase = getSupabase();

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

    // Update lang toggle button text
    const langToggleText = document.querySelector(".lang-text");
    if (langToggleText) {
      langToggleText.textContent = lang === "ar" ? "EN" : "عربي";
    }

    // Re-render project with new language
    loadProjectDetails();
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
  // GET PROJECT ID FROM URL
  // ==========================================

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  if (!projectId) {
    console.warn("No project ID found in URL. Redirecting to home.");
    window.location.href = "index.html#projects";
    return;
  }

  // ==========================================
  // LOAD PROJECT DETAILS
  // ==========================================

  async function loadProjectDetails() {
    try {
      console.log("Fetching project with ID:", projectId);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (data) {
        console.log("Project data loaded successfully");
        renderProjectDetails(data);
      } else {
        console.warn("Project not found. Redirecting to home.");
        window.location.href = "index.html#projects";
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      document.body.innerHTML = `<div style='display:flex;align-items:center;justify-content:center;min-height:100vh'><h1 style='color:white;text-align:center'>حدث خطأ<br><small>${err.message}</small></h1></div>`;
      setTimeout(() => {
        window.location.href = "index.html#projects";
      }, 2000);
    }
  }

  // ==========================================
  // RENDER PROJECT DETAILS
  // ==========================================

  function renderProjectDetails(data) {
    // Get language-specific fields
    const title = currentLang === "ar" ? data.title_ar : data.title_en;
    const description =
      currentLang === "ar" ? data.description_ar : data.description_en;
    const content =
      currentLang === "ar"
        ? data.content_ar || data.description_ar
        : data.content_en || data.description_en;

    // Update page title
    document.getElementById("page-title").textContent = `${title} — عمر الدباغ`;
    document.title = `${title} — عمر الدباغ`;

    // Populate Data
    document.getElementById("detail-year").textContent = data.year;
    document.getElementById("detail-title").textContent = title;
    document.getElementById("detail-desc-short").textContent = description;
    document.getElementById("detail-desc-full").textContent = content;

    // Link
    const linkBtn = document.getElementById("detail-link");
    if (data.link) {
      linkBtn.href = data.link;
      linkBtn.style.display = "inline-flex";
    } else {
      linkBtn.style.display = "none";
    }

    // Tags
    const tagsContainer = document.getElementById("detail-tags");
    tagsContainer.innerHTML = (data.tags || [])
      .map((tag) => `<span>${tag}</span>`)
      .join("");

    // Gallery
    renderGallery(data);
  }

  // ==========================================
  // RENDER GALLERY
  // ==========================================

  function renderGallery(data) {
    const mainContainer = document.getElementById("detail-gallery-main");
    const thumbsContainer = document.getElementById("detail-gallery-thumbs");

    // Collect all images (Supabase + Legacy fallback)
    let images = [];
    if (data.images && data.images.length > 0) {
      images = data.images;
    } else {
      const folderId = String(data.id).startsWith("p")
        ? data.id
        : `p${data.id}`;
      images = Array.from(
        { length: data.image_count || 0 },
        (_, i) => `assets/projects/${folderId}/p (${i + 1}).png`,
      );
    }

    if (images.length === 0) {
      mainContainer.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;">No Images</div>';
      thumbsContainer.innerHTML = "";
      return;
    }

    // Set Main Image (First one)
    updateMainImage(images[0]);

    // Render Thumbs
    thumbsContainer.innerHTML = images
      .map(
        (src, index) => `
      <img src="${src}" onclick="updateMainImage('${src}'); highlightThumb(this)" class="${index === 0 ? "active" : ""}">
    `,
      )
      .join("");

    // Global functions for gallery
    window.updateMainImage = function (src) {
      const img = document.createElement("img");
      img.src = src;
      img.style.opacity = "0";
      mainContainer.innerHTML = "";
      mainContainer.appendChild(img);

      void img.offsetWidth;
      img.style.opacity = "1";
    };

    window.highlightThumb = function (el) {
      document
        .querySelectorAll(".gallery-thumbs img")
        .forEach((img) => img.classList.remove("active"));
      el.classList.add("active");
    };
  }

  // ==========================================
  // FOOTER YEAR
  // ==========================================

  document.getElementById("year").textContent = new Date().getFullYear();

  // ==========================================
  // INITIALIZE
  // ==========================================

  setLanguage(currentLang);
  await loadProjectDetails();
});
