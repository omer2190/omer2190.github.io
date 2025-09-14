document.addEventListener('DOMContentLoaded', () => {

  // --- DATA: Define Your Projects Here ---
  const projects = [
    {
      id: 'p1',
      title: 'نظام إدارة شركات الحج والعمرة',
      year: '2024',
      description: 'حل مكتبي متكامل لإدارة الرحلات، الحجوزات، الفواتير والتقارير. يوفّر لوحة تحكم ومكاتب خلفية لإدارة العمليات.',
      tags: ['Flutter', 'Node.js', 'MongoDB', 'REST APIs'],
      imageCount: 17, // Number of images in assets/projects/p1
    },
    {
      id: 'p4', // Corrected from p2 to p4
      title: 'تطبيق البارون',
      year: '2023',
      description: 'منصة تواصل ومكافآت مع تجربة مستخدم بسيطة ونظام نقاط متطور ومكافآت قابلة للاسترداد.',
      tags: ['Flutter', 'Express.js', 'Firebase'],
      imageCount: 26, // Number of images in assets/projects/p4
    },
    {
      id: 'p2', // Corrected from p3 to p2
      title: 'ROZ NET — نظام إدارة مزودي الإنترنت',
      year: '2022',
      description: 'نظام SaaS لإدارة الاشتراكات والفوترة ومراقبة الأبراج الشبكية مع تقارير تحليلية وديناميكية.',
      tags: ['Flutter', 'MongoDB', 'APIs'],
      imageCount: 33, // Number of images in assets/projects/p2
    },
    {
      id: 'p3',
      title: 'مشروع تجريبي 4',
      year: '2022',
      description: 'وصف مختصر للمشروع الرابع يوضح الهدف الرئيسي والتقنيات المستخدمة فيه.',
      tags: ['React', 'CSS', 'HTML5'],
      imageCount: 8, // Number of images in assets/projects/p3
    },
    // To add a new project, just copy the object above and change the details.
  ];

  // --- RENDER PROJECTS ---
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) {
    projectsGrid.innerHTML = projects.map(p => createProjectCard(p)).join('');
  }

  function createProjectCard(project) {
    const imagesHtml = Array.from({ length: project.imageCount }, (_, i) => `
      <img 
        src="assets/projects/${project.id}/p (${i + 1}).png" 
        alt="لقطة شاشة ${i + 1} من مشروع ${project.title}" 
        loading="lazy" 
      />
    `).join('');

    const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    return `
      <article class="project-card" role="listitem" aria-labelledby="p-${project.id}-title">
        <div class="project-head">
          <h3 id="p-${project.id}-title">${project.title}</h3>
          <div class="muted-small">${project.year}</div>
        </div>
        <p class="project-desc">${project.description}</p>
        <div class="project-images" data-project-id="${project.id}">${imagesHtml}</div>
        <div class="tech-list">${tagsHtml}</div>
      </article>
    `;
  }

  // --- MODAL LOGIC ---
  const modal = document.getElementById("modal");
  const viewerImg = document.getElementById("viewerImg");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let currentGallery = [];
  let currentIndex = 0;

  // Use event delegation for dynamically added images
  projectsGrid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
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
    showAt(currentIndex - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showAt(currentIndex + 1);
  });

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);

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

  // --- FOOTER YEAR ---
  document.getElementById("year").textContent = new Date().getFullYear();
});
