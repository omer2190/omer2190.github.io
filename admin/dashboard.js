// ==========================================
// DASHBOARD MAIN SCRIPT
// ==========================================

// Check authentication
if (!authManager.isAuthenticated()) {
  window.location.href = "index.html";
}

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
document.addEventListener("DOMContentLoaded", () => {
  loadUsername();
  loadOverviewStats();
  loadProjects();
  setupEventListeners();
});

// Load username from session
function loadUsername() {
  const session = authManager.getSession();
  if (session) {
    document.getElementById("username").textContent = session.username;
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
      window.location.href = "index.html";
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
function loadOverviewStats() {
  const data = dataManager.getData();
  document.getElementById("statsProjects").textContent =
    data.projects.ar.length;
  document.getElementById("statsSkills").textContent = data.skills.length;

  const lastUpdate = new Date(data.metadata.lastUpdate);
  const today = new Date();
  const diffDays = Math.floor((today - lastUpdate) / (1000 * 60 * 60 * 24));
  document.getElementById("lastUpdate").textContent =
    diffDays === 0 ? "اليوم" : `منذ ${diffDays} يوم`;

  document.getElementById("projectsCount").textContent =
    data.projects.ar.length;
}

// Load projects
function loadProjects() {
  const projectsAr = dataManager.getProjects("ar");
  const projectsEn = dataManager.getProjects("en");
  const container = document.getElementById("projectsList");

  if (projectsAr.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #999; padding: 40px;">لا توجد مشاريع بعد. قم بإضافة مشروعك الأول!</p>';
    return;
  }

  container.innerHTML = projectsAr
    .map(
      (project, index) => `
    <div class="project-item">
      ${
        project.images && project.images.length > 0
          ? `
      <div class="project-thumbnail">
        <img src="${project.images[0]}" alt="${project.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;">
      </div>
      `
          : ""
      }
      <div class="project-info">
        <h3>${project.title}</h3>
        <div class="year">
          <i class="fas fa-calendar"></i> ${project.year}
          ${
            projectsEn[index]
              ? `<span style="margin-right: 15px; color: #999;">EN: ${projectsEn[index].title}</span>`
              : ""
          }
        </div>
        <p>${project.description.substring(0, 150)}${
        project.description.length > 150 ? "..." : ""
      }</p>
        <div class="project-tags">
          ${project.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
          <span class="tag"><i class="fas fa-images"></i> ${
            project.images && project.images.length > 0
              ? project.images.length
              : project.imageCount
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
  `
    )
    .join("");
}

// Open project modal
function openProjectModal(projectId = null) {
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  let projectAr = projectId
    ? dataManager.getProjects("ar").find((p) => p.id === projectId)
    : null;
  let projectEn = projectId
    ? dataManager.getProjects("en").find((p) => p.id === projectId)
    : null;

  modalTitle.textContent = projectId ? "تعديل المشروع" : "إضافة مشروع جديد";

  modalBody.innerHTML = `
    <div class="form-grid">
      <div class="form-card">
        <h3>معلومات المشروع - عربي</h3>
        <div class="form-group">
          <label>عنوان المشروع <span style="color: red;">*</span></label>
          <input type="text" class="form-control" id="titleAr" value="${
            projectAr?.title || ""
          }" required>
        </div>
        <div class="form-group">
          <label>السنة <span style="color: red;">*</span></label>
          <input type="text" class="form-control" id="yearAr" value="${
            projectAr?.year || new Date().getFullYear()
          }" required>
        </div>
        <div class="form-group">
          <label>الوصف <span style="color: red;">*</span></label>
          <textarea class="form-control" id="descriptionAr" rows="5" required>${
            projectAr?.description || ""
          }</textarea>
        </div>
        <div class="form-group">
          <label>التقنيات (مفصولة بفواصل)</label>
          <input type="text" class="form-control" id="tagsAr" value="${
            projectAr?.tags?.join(", ") || ""
          }" placeholder="Flutter, Node.js, MongoDB">
        </div>
        <div class="form-group">
          <label>عدد الصور</label>
          <input type="number" class="form-control" id="imageCountAr" value="${
            projectAr?.imageCount || 0
          }" min="0">
        </div>
      </div>

      <div class="form-card image-upload-section">
        <h3><i class="fas fa-images"></i> صور المشروع</h3>
        <div class="form-group">
          <label>رفع صور المشروع (اختياري)</label>
          <input type="file" class="form-control" id="projectImages" multiple accept="image/*" onchange="handleImageUpload(event)">
          <small style="color: #888; display: block; margin-top: 5px;">
            <i class="fas fa-info-circle"></i> يمكنك اختيار عدة صور مرة واحدة
          </small>
        </div>
        <div id="imagePreview" class="image-preview-grid"></div>
      </div>

      <div class="form-card">
        <h3>Project Info - English</h3>
        <div class="form-group">
          <label>Project Title <span style="color: red;">*</span></label>
          <input type="text" class="form-control" id="titleEn" value="${
            projectEn?.title || ""
          }" required style="direction: ltr;">
        </div>
        <div class="form-group">
          <label>Year <span style="color: red;">*</span></label>
          <input type="text" class="form-control" id="yearEn" value="${
            projectEn?.year || new Date().getFullYear()
          }" required style="direction: ltr;">
        </div>
        <div class="form-group">
          <label>Description <span style="color: red;">*</span></label>
          <textarea class="form-control" id="descriptionEn" rows="5" required style="direction: ltr;">${
            projectEn?.description || ""
          }</textarea>
        </div>
        <div class="form-group">
          <label>Technologies (comma separated)</label>
          <input type="text" class="form-control" id="tagsEn" value="${
            projectEn?.tags?.join(", ") || ""
          }" placeholder="Flutter, Node.js, MongoDB" style="direction: ltr;">
        </div>
        <div class="form-group">
          <label>Image Count</label>
          <input type="number" class="form-control" id="imageCountEn" value="${
            projectEn?.imageCount || 0
          }" min="0">
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

  // Load saved images if editing
  if (projectAr && projectAr.images && projectAr.images.length > 0) {
    const preview = document.getElementById("imagePreview");
    preview.innerHTML = "";
    projectAr.images.forEach((imgSrc, index) => {
      const imageCard = document.createElement("div");
      imageCard.className = "image-preview-card";
      imageCard.innerHTML = `
        <img src="${imgSrc}" alt="Image ${index + 1}">
        <div class="image-preview-overlay">
          <button type="button" class="btn-icon-small" onclick="removeImage(this)" title="حذف">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <small>صورة ${index + 1}</small>
      `;
      preview.appendChild(imageCard);
    });
  }
}

// Close project modal
function closeProjectModal() {
  document.getElementById("projectModal").classList.remove("show");
  // Clear image preview
  const preview = document.getElementById("imagePreview");
  if (preview) preview.innerHTML = "";
}

// Handle image upload
function handleImageUpload(event) {
  const files = event.target.files;
  const preview = document.getElementById("imagePreview");
  preview.innerHTML = "";

  if (files.length === 0) return;

  Array.from(files).forEach((file, index) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const imageCard = document.createElement("div");
        imageCard.className = "image-preview-card";
        imageCard.innerHTML = `
          <img src="${e.target.result}" alt="Preview ${index + 1}">
          <div class="image-preview-overlay">
            <button type="button" class="btn-icon-small" onclick="removeImage(this)" title="حذف">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <small>${file.name}</small>
        `;
        preview.appendChild(imageCard);
      };

      reader.readAsDataURL(file);
    }
  });

  // Update image count automatically
  document.getElementById("imageCountAr").value = files.length;
  document.getElementById("imageCountEn").value = files.length;
}

// Remove image from preview
function removeImage(btn) {
  const card = btn.closest(".image-preview-card");
  card.remove();

  // Update image count
  const preview = document.getElementById("imagePreview");
  const count = preview.children.length;
  document.getElementById("imageCountAr").value = count;
  document.getElementById("imageCountEn").value = count;

  // Clear file input if no images left
  if (count === 0) {
    document.getElementById("projectImages").value = "";
  }
}

// Save project
function saveProject(projectId) {
  // Get uploaded images
  const preview = document.getElementById("imagePreview");
  const images = [];

  if (preview) {
    const imageCards = preview.querySelectorAll(".image-preview-card img");
    imageCards.forEach((img) => {
      images.push(img.src); // Base64 data
    });
  }

  const projectDataAr = {
    title: document.getElementById("titleAr").value.trim(),
    year: document.getElementById("yearAr").value.trim(),
    description: document.getElementById("descriptionAr").value.trim(),
    tags: document
      .getElementById("tagsAr")
      .value.split(",")
      .map((t) => t.trim())
      .filter((t) => t),
    imageCount: parseInt(document.getElementById("imageCountAr").value) || 0,
    images: images, // Add images to project data
  };

  const projectDataEn = {
    title: document.getElementById("titleEn").value.trim(),
    year: document.getElementById("yearEn").value.trim(),
    description: document.getElementById("descriptionEn").value.trim(),
    tags: document
      .getElementById("tagsEn")
      .value.split(",")
      .map((t) => t.trim())
      .filter((t) => t),
    imageCount: parseInt(document.getElementById("imageCountEn").value) || 0,
    images: images, // Add images to project data
  };

  if (!projectDataAr.title || !projectDataAr.description) {
    showToast("يرجى ملء جميع الحقول المطلوبة", "error");
    return;
  }

  showLoading();

  setTimeout(() => {
    if (projectId) {
      dataManager.updateProject(projectId, projectDataAr, "ar");
      dataManager.updateProject(projectId, projectDataEn, "en");
    } else {
      const resultAr = dataManager.addProject(projectDataAr, "ar");
      if (resultAr.success) {
        const projectsAr = dataManager.getProjects("ar");
        const newProjectId = projectsAr[0].id;
        projectDataEn.id = newProjectId;
        dataManager.addProject(projectDataEn, "en");
      }
    }

    hideLoading();
    closeProjectModal();
    loadProjects();
    loadOverviewStats();
    showToast(
      projectId ? "تم تحديث المشروع بنجاح" : "تم إضافة المشروع بنجاح",
      "success"
    );
  }, 500);
}

// Edit project
function editProject(projectId) {
  openProjectModal(projectId);
}

// Delete project
function deleteProject(projectId) {
  if (
    !confirm("هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.")
  ) {
    return;
  }

  showLoading();

  setTimeout(() => {
    dataManager.deleteProject(projectId, "ar");
    dataManager.deleteProject(projectId, "en");

    hideLoading();
    loadProjects();
    loadOverviewStats();
    showToast("تم حذف المشروع بنجاح", "success");
  }, 500);
}

// Load about data
function loadAboutData() {
  const aboutAr = dataManager.getAbout("ar");
  const aboutEn = dataManager.getAbout("en");

  document.getElementById("nameAr").value = aboutAr.name;
  document.getElementById("descAr").value = aboutAr.description;
  document.getElementById("nameEn").value = aboutEn.name;
  document.getElementById("descEn").value = aboutEn.description;
}

// Save about
function saveAbout() {
  const aboutAr = {
    name: document.getElementById("nameAr").value.trim(),
    description: document.getElementById("descAr").value.trim(),
  };

  const aboutEn = {
    name: document.getElementById("nameEn").value.trim(),
    description: document.getElementById("descEn").value.trim(),
  };

  showLoading();

  setTimeout(() => {
    dataManager.updateAbout(aboutAr, "ar");
    dataManager.updateAbout(aboutEn, "en");

    hideLoading();
    showToast("تم حفظ المعلومات الشخصية بنجاح", "success");
  }, 500);
}

// Load skills
function loadSkills() {
  const skills = dataManager.getSkills();
  const container = document.getElementById("skillsList");

  container.innerHTML = `
    <div class="form-card">
      <p style="color: #999; margin-bottom: 20px;">قريباً: إدارة المهارات بشكل تفاعلي</p>
      <div style="display: grid; gap: 15px;">
        ${skills
          .map(
            (skill) => `
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong>${skill.name}</strong>
                <span>${skill.progress}%</span>
              </div>
              <div style="height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                <div style="width: ${skill.progress}%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s;"></div>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

// Load contact data
function loadContactData() {
  const contact = dataManager.getContact();
  document.getElementById("email").value = contact.email;
  document.getElementById("linkedin").value = contact.linkedin;
  document.getElementById("github").value = contact.github;
}

// Save contact
function saveContact() {
  const contact = {
    email: document.getElementById("email").value.trim(),
    linkedin: document.getElementById("linkedin").value.trim(),
    github: document.getElementById("github").value.trim(),
  };

  showLoading();

  setTimeout(() => {
    dataManager.updateContact(contact);
    hideLoading();
    showToast("تم حفظ معلومات التواصل بنجاح", "success");
  }, 500);
}

// Change password
function changePassword(e) {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    showToast("كلمات المرور الجديدة غير متطابقة", "error");
    return;
  }

  if (newPassword.length < 6) {
    showToast("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
    return;
  }

  showLoading();

  setTimeout(async () => {
    const result = await authManager.changePassword(
      currentPassword,
      newPassword
    );
    hideLoading();

    if (result.success) {
      showToast(result.message, "success");
      e.target.reset();
    } else {
      showToast(result.message, "error");
    }
  }, 500);
}

// Export data
function exportData() {
  dataManager.exportData();
  showToast("تم تصدير البيانات بنجاح", "success");
}

// Import data
function importData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      showLoading();

      setTimeout(() => {
        const result = dataManager.importData(data);
        hideLoading();

        if (result.success) {
          showToast("تم استيراد البيانات بنجاح", "success");
          loadOverviewStats();
          loadProjects();
        } else {
          showToast(result.message, "error");
        }

        e.target.value = "";
      }, 500);
    } catch (error) {
      showToast("ملف JSON غير صالح", "error");
      e.target.value = "";
    }
  };

  reader.readAsText(file);
}

// Reset data
function resetData() {
  if (
    !confirm(
      "⚠️ تحذير!\n\nهل أنت متأكد من إعادة تعيين جميع البيانات إلى القيم الافتراضية؟ سيتم فقدان جميع التعديلات!"
    )
  ) {
    return;
  }

  showLoading();

  setTimeout(() => {
    dataManager.resetData();
    hideLoading();
    loadOverviewStats();
    loadProjects();
    showToast("تم إعادة تعيين البيانات بنجاح", "success");
  }, 500);
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
