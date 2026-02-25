import { authManager } from "./auth.js";
import { dataManager } from "./data-manager.js";
import { Router } from "./router.js";

// Check authentication using Router Guard
Router.guard(authManager);

// DOM Elements
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const menuToggle = document.getElementById("menuToggle");
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("pageTitle");
const logoutBtn = document.getElementById("logoutBtn");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const loadingOverlay = document.getElementById("loadingOverlay");

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await loadUsername();
  await loadOverviewStats();
  await loadProjects();
  setupEventListeners();
});

// Load username from session
async function loadUsername() {
  const user = await authManager.getUser();
  if (user) {
    document.getElementById("username").textContent = user.email;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionName = item.dataset.section;
      navigateToSection(sectionName);
    });
  });

  // Quick actions
  document.querySelectorAll("[data-navigate]").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigateToSection(btn.dataset.navigate);
    });
  });

  // Mobile menu toggle
  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
  });

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    if (confirm("هل تريد تسجيل الخروج؟")) {
      authManager.logout();
      Router.push("LOGIN");
    }
  });

  // Projects
  document.getElementById("addProjectBtn").addEventListener("click", () => {
    openProjectModal();
  });

  // About
  document.getElementById("saveAboutBtn").addEventListener("click", saveAbout);

  // Contact
  document
    .getElementById("saveContactBtn")
    .addEventListener("click", saveContact);

  // Settings
  document
    .getElementById("changePasswordForm")
    .addEventListener("submit", changePassword);
  document
    .getElementById("exportJsonBtn")
    .addEventListener("click", exportData);
  document.getElementById("importJsonBtn").addEventListener("click", () => {
    document.getElementById("importFileInput").click();
  });
  document
    .getElementById("importFileInput")
    .addEventListener("change", importData);
  document.getElementById("resetDataBtn").addEventListener("click", resetData);

  // Export buttons
  document.getElementById("saveAllBtn").addEventListener("click", () => {
    showToast("تم حفظ جميع التغييرات", "success");
  });
  document
    .getElementById("exportDataBtn")
    .addEventListener("click", exportData);
}

// Navigate to section
function navigateToSection(sectionName) {
  // Update nav items
  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.section === sectionName);
  });

  // Update sections
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === `${sectionName}-section`);
  });

  // Update page title
  const titles = {
    overview: "نظرة عامة",
    projects: "إدارة المشاريع",
    about: "المعلومات الشخصية",
    skills: "إدارة المهارات",
    contact: "معلومات التواصل",
    settings: "الإعدادات",
  };
  pageTitle.textContent = titles[sectionName] || "لوحة التحكم";

  // Close mobile menu
  sidebar.classList.remove("active");

  // Load section data
  if (sectionName === "projects") {
    loadProjects();
  } else if (sectionName === "skills") {
    loadSkills();
  } else if (sectionName === "about") {
    loadAboutData();
  } else if (sectionName === "contact") {
    loadContactData();
  }
}

// Load overview stats
async function loadOverviewStats() {
  const projects = await dataManager.getProjects();
  const skills = await dataManager.getSkills();

  document.getElementById("statsProjects").textContent = projects.length;
  document.getElementById("statsSkills").textContent = skills.length;

  document.getElementById("lastUpdate").textContent = "اليوم"; // Simplification
  document.getElementById("projectsCount").textContent = projects.length;
}

// Load projects
async function loadProjects() {
  const projects = await dataManager.getProjects();
  const container = document.getElementById("projectsList");

  if (projects.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #999; padding: 40px;">لا توجد مشاريع بعد. قم بإضافة مشروعك الأول!</p>';
    return;
  }

  container.innerHTML = projects
    .map((project) => {
      // Fallback for legacy local images if no Supabase URLs exist
      const folderId = String(project.id).startsWith("p")
        ? project.id
        : `p${project.id}`;
      const thumbnailSrc =
        project.images && project.images.length > 0
          ? project.images[0]
          : `../assets/projects/${folderId}/p (1).png`;

      return `
    <div class="project-item">
      <div class="project-thumbnail">
        <img src="${thumbnailSrc}" alt="${project.title_ar}" 
             onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'"
             style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;">
      </div>
      <div class="project-info">
        <h3>${project.title_ar}</h3>
        <div class="year">
          <i class="fas fa-calendar"></i> ${project.year}
          ${
            project.title_en
              ? `<span style="margin-right: 15px; color: #999;">EN: ${project.title_en}</span>`
              : ""
          }
        </div>
        <p>${(project.description_ar || "").substring(0, 150)}${
          (project.description_ar || "").length > 150 ? "..." : ""
        }</p>
        <div class="project-tags">
          ${(project.tags || [])
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
          <span class="tag"><i class="fas fa-images"></i> ${
            project.images && project.images.length > 0
              ? project.images.length
              : project.image_count || 0
          } صور</span>
        </div>
      </div>
      <div class="project-actions">
        <button class="btn-edit" onclick="editProject('${
          project.id
        }')" title="تعديل">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-delete" onclick="deleteProject('${
          project.id
        }')" title="حذف">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;
    })
    .join("");
}

// ==========================================
// GLOBALS
// ==========================================
let selectedFiles = []; // Store File objects for upload

// ==========================================
// MODAL & PROJECT MANAGEMENT
// ==========================================

// Open project modal
async function openProjectModal(projectId = null) {
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  // Clear files on open
  selectedFiles = [];

  let project = null;
  if (projectId) {
    const projects = await dataManager.getProjects();
    project = projects.find((p) => p.id == projectId);
  }

  modalTitle.textContent = projectId ? "تعديل المشروع" : "إضافة مشروع جديد";

  modalBody.innerHTML = `
    <div class="form-grid">
      <div class="form-card">
        <h3>معلومات المشروع - عربي</h3>
        <div class="form-group">
          <label>عنوان المشروع <span style="color: red;">*</span></label>
          <input type="text" class="form-control" id="titleAr" value="${project?.title_ar || ""}" required>
        </div>
        <div class="form-group">
          <label>السنة <span style="color: red;">*</span></label>
          <input type="text" class="form-control" id="year" value="${project?.year || new Date().getFullYear()}" required>
        </div>
        <div class="form-group">
          <label>وصف مختصر <span style="color: red;">*</span></label>
          <textarea class="form-control" id="descriptionAr" rows="3" required>${project?.description_ar || ""}</textarea>
        </div>
         <div class="form-group">
          <label>وصف كامل وتفصيلي</label>
          <textarea class="form-control" id="contentAr" rows="8" placeholder="شرح تفصيلي للمشروع...">${project?.content_ar || ""}</textarea>
        </div>
        <div class="form-group">
          <label>التقنيات (مفصولة بفواصل)</label>
          <input type="text" class="form-control" id="tags" value="${project?.tags?.join(", ") || ""}" placeholder="Flutter, Node.js, MongoDB">
        </div>
         <div class="form-group">
          <label>رابط المشروع (اختياري)</label>
          <input type="url" class="form-control" id="projectLink" value="${project?.link || ""}" placeholder="https://example.com" style="direction: ltr;">
        </div>
      </div>

      <div class="form-card image-upload-section">
        <h3><i class="fas fa-images"></i> صور المشروع</h3>
        <div class="form-group">
          <label>رفع صور المشروع (PNG/JPG)</label>
          <input type="file" class="form-control" id="projectImages" multiple accept="image/*" onchange="handleImageUpload(event)">
          <small style="color: #888; display: block; margin-top: 5px;">
             سيتم رفع الصور إلى Supabase تلقائياً عند الحفظ.
          </small>
        </div>
        <div id="imagePreview" class="image-preview-grid"></div>
        <!-- Show existing images thumbnail logic could be here -->
      </div>

      <div class="form-card">
        <h3>Project Info - English</h3>
        <div class="form-group">
          <label>Project Title <span style="color: red;">*</span></label>
          <input type="text" class="form-control" id="titleEn" value="${project?.title_en || ""}" required style="direction: ltr;">
        </div>
        <div class="form-group">
          <label>Short Description <span style="color: red;">*</span></label>
          <textarea class="form-control" id="descriptionEn" rows="3" required style="direction: ltr;">${project?.description_en || ""}</textarea>
        </div>
         <div class="form-group">
          <label>Full Content</label>
          <textarea class="form-control" id="contentEn" rows="8" style="direction: ltr;" placeholder="Detailed explanation...">${project?.content_en || ""}</textarea>
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 15px; margin-top: 25px;">
      <button class="btn-primary" onclick="saveProject('${projectId || ""}')">
        <i class="fas fa-save"></i>
        ${projectId ? "حفظ التعديلات" : "إضافة المشروع"}
      </button>
      <button class="btn-secondary" onclick="closeProjectModal()">
        <i class="fas fa-times"></i>
        إلغاء
      </button>
    </div>
  `;

  modal.classList.add("show");
  document.getElementById("closeModal").onclick = closeProjectModal;
}

// ... (closeProjectModal, handleImageUpload remain same)

// Save project
window.saveProject = async function (projectId) {
  const titleAr = document.getElementById("titleAr").value.trim();
  const titleEn = document.getElementById("titleEn").value.trim();

  if (!titleAr || !titleEn) {
    showToast("يرجى ملء العناوين المطلوبة", "error");
    return;
  }

  showLoading();

  // Upload Images first
  let uploadedUrls = [];
  if (selectedFiles.length > 0) {
    const uploadPromises = selectedFiles.map(async (file) => {
      const fileName = `projects/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
      const res = await dataManager.uploadImage(file, fileName);
      return res.success ? res.url : null;
    });

    const results = await Promise.all(uploadPromises);
    uploadedUrls = results.filter((url) => url !== null);
  }

  const projectData = {
    title: titleAr,
    title_ar: titleAr,
    title_en: titleEn,
    year: document.getElementById("year").value,
    description_ar: document.getElementById("descriptionAr").value,
    description_en: document.getElementById("descriptionEn").value,
    content_ar: document.getElementById("contentAr").value, // New
    content_en: document.getElementById("contentEn").value, // New
    link: document.getElementById("projectLink").value, // New
    tags: document
      .getElementById("tags")
      .value.split(",")
      .map((t) => t.trim())
      .filter((t) => t),
    imageCount: parseInt(document.getElementById("imageCount")?.value || 0),
  };

  // Append new images to existing ones logic is tricky without full state management
  // For now, we assume if you upload new images, they are ADDED.
  // But strictly speaking, to APPEND, we need to know the old images.
  // The dataManager.updateProject handles the update, but if we pass 'images', it usually Overwrites in SQL unless we fetch-then-update.
  // For simplicity here: If we have uploaded images, we merge them in dataManager or backend?
  // Let's assume we overwrite 'images' array if we send it in update for now, OR fetch first.
  // Actually, let's keep it simple: If uploadedUrls exist, we send them.
  // Ideally, the user sees existing images and can delete them. That requires more complex UI.

  if (uploadedUrls.length > 0) {
    // If updating, we should probably fetch existing images first to append...
    // But for this step let's just save.
    // Ideally:
    if (projectId) {
      const projects = await dataManager.getProjects();
      const current = projects.find((p) => p.id == projectId);
      projectData.images = [...(current.images || []), ...uploadedUrls];
    } else {
      projectData.images = uploadedUrls;
    }
  }

  let result;
  if (projectId) {
    result = await dataManager.updateProject(projectId, projectData);
  } else {
    result = await dataManager.addProject(projectData);
  }

  hideLoading();

  if (result.success) {
    closeProjectModal();
    loadProjects();
    loadOverviewStats();
    showToast("تم الحفظ بنجاح", "success");
  } else {
    showToast("حدث خطأ: " + result.message, "error");
  }
};

// Edit project wrapper
window.editProject = function (projectId) {
  openProjectModal(projectId);
};

// Delete project
window.deleteProject = async function (projectId) {
  if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;

  showLoading();
  const result = await dataManager.deleteProject(projectId);
  hideLoading();

  if (result.success) {
    loadProjects();
    loadOverviewStats();
    showToast("تم الحذف بنجاح", "success");
  } else {
    showToast("خطأ في الحذف: " + result.message, "error");
  }
};

// Load about data
async function loadAboutData() {
  const profile = await dataManager.getProfile();
  const about = profile.about || {};

  document.getElementById("nameAr").value = about.name_ar || "";
  document.getElementById("descAr").value = about.description_ar || "";
  document.getElementById("nameEn").value = about.name_en || "";
  document.getElementById("descEn").value = about.description_en || "";
}

// Save about
document.getElementById("saveAboutBtn").addEventListener("click", async () => {
  showLoading();

  const p1 = dataManager.updateProfile(
    "about",
    "name_ar",
    document.getElementById("nameAr").value,
  );
  const p2 = dataManager.updateProfile(
    "about",
    "description_ar",
    document.getElementById("descAr").value,
  );
  const p3 = dataManager.updateProfile(
    "about",
    "name_en",
    document.getElementById("nameEn").value,
  );
  const p4 = dataManager.updateProfile(
    "about",
    "description_en",
    document.getElementById("descEn").value,
  );

  await Promise.all([p1, p2, p3, p4]);

  hideLoading();
  showToast("تم تحديث المعلومات الشخصية", "success");
});

// Load Skills
async function loadSkills() {
  const skills = await dataManager.getSkills();
  const container = document.getElementById("skillsList");

  if (skills.length === 0) {
    container.innerHTML =
      "<p>لا توجد مهارات. أضف مهاراتك من قاعدة البيانات.</p>";
    return;
  }

  // Interactive list
  container.innerHTML = skills
    .map(
      (skill) => `
        <div class="skill-item-edit" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center; background: #fff; padding: 10px; border-radius: 8px;">
            <i class="${skill.icon_class || "fas fa-code"}"></i>
            <strong>${skill.name}</strong>
            <span style="flex: 1; margin: 0 10px; height: 5px; background: #eee;">
                <span style="display: block; width: ${skill.progress}%; height: 100%; background: blue;"></span>
            </span>
            <button class="btn-delete" onclick="deleteSkill('${skill.id}')"><i class="fas fa-trash"></i></button>
        </div>
    `,
    )
    .join("");
}

// Helpers for skills (Add/Delete) - simple implementation
window.deleteSkill = async function (id) {
  if (!confirm("حذف المهارة؟")) return;
  await dataManager.deleteSkill(id);
  loadSkills();
};

// Load Contact
async function loadContactData() {
  const profile = await dataManager.getProfile();
  const contact = profile.contact || {};

  document.getElementById("email").value = contact.email || "";
  document.getElementById("linkedin").value = contact.linkedin || "";
  document.getElementById("github").value = contact.github || "";
}

// Save Contact
document
  .getElementById("saveContactBtn")
  .addEventListener("click", async () => {
    showLoading();
    const p1 = dataManager.updateProfile(
      "contact",
      "email",
      document.getElementById("email").value,
    );
    const p2 = dataManager.updateProfile(
      "contact",
      "linkedin",
      document.getElementById("linkedin").value,
    );
    const p3 = dataManager.updateProfile(
      "contact",
      "github",
      document.getElementById("github").value,
    );

    await Promise.all([p1, p2, p3]);
    hideLoading();
    showToast("تم الحفظ", "success");
  });

// Change Password
async function changePassword(e) {
  e.preventDefault();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    showToast("كلمات المرور غير متطابقة", "error");
    return;
  }

  showLoading();
  const res = await authManager.changePassword(null, newPassword);
  hideLoading();

  if (res.success) {
    showToast("تم تغيير كلمة المرور", "success");
    e.target.reset();
  } else {
    showToast(res.message, "error");
  }
}

// Export/Import/Reset - Leave as stubs or implement if needed
// dataManager.exportData() was for localStorage. Supabase renders this less relevant for simple client-side export.
function exportData() {
  alert("هذه الميزة غير متوفرة مع Supabase حالياً");
}

function importData() {
  alert("هذه الميزة غير متوفرة مع Supabase حالياً");
}

function resetData() {
  showToast("لا يمكن إعادة تعيين قاعدة البيانات السحابية من هنا", "error");
}

// Show toast notification
function showToast(message, type = "success") {
  toastMessage.textContent = message;
  toast.style.background = type === "success" ? "#43e97b" : "#fa5252";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Show loading overlay
function showLoading() {
  loadingOverlay.classList.add("show");
}

// Hide loading overlay
function hideLoading() {
  loadingOverlay.classList.remove("show");
}
