// ==========================================
// DATA MANAGER - ABSTRACTION LAYER
// Works with localStorage now, ready for Backend
// ==========================================

class DataManager {
  constructor() {
    this.storageKey = "portfolio_data";
    this.initializeData();
  }

  // Initialize default data structure
  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultData = this.getDefaultData();
      this.saveData(defaultData);
    }
  }

  // Get default data structure
  getDefaultData() {
    return {
      projects: {
        ar: [
          {
            id: "p5",
            title: "تطبيق كوين",
            year: "2025",
            description:
              "تطبيق تواصل اجتماعي يحتوي على منشورات وتعليقات ويجمع ما بين تفاعل المستخدمين من نشر قصصهم و المحادثات الجماعية او الفردية كما يحتوي على نظام متجر مصغر وبنظام النقد او الاقساط",
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
              "حل مكتبي متكامل لإدارة الرحلات، الحجوزات، الفواتير والتقارير",
            tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
            imageCount: 17,
          },
          {
            id: "p4",
            title: "تطبيق البارون",
            year: "2023",
            description:
              "منصة تواصل ومكافآت مع تجربة مستخدم بسيطة ونظام نقاط متطور",
            tags: ["Flutter", "Express.js", "Nodejs", "MongoDB", "REST APIs"],
            imageCount: 26,
          },
          {
            id: "p2",
            title: "ROZ NET — نظام إدارة مزودي الإنترنت",
            year: "2022",
            description:
              "نظام SaaS لإدارة الاشتراكات والفوترة ومراقبة الأبراج الشبكية",
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
            description:
              "هذا التطبيق المخصص للمشتركين وهو استكمال للتطبيق الاول",
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
              "A social networking app featuring posts and comments that brings together user interactions",
            tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
            imageCount: 27,
          },
          {
            id: "p6",
            title: "Hotel Management System",
            year: "2025",
            description:
              "A specialized hotel program for Al-Iwan Company to operate Saudi hotels",
            tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
            imageCount: 11,
          },
          {
            id: "p1",
            title: "Madinah Hajj & Umrah Management System",
            year: "2024",
            description:
              "A comprehensive desktop solution for managing trips, reservations, invoices, and reports",
            tags: ["Flutter", "Node.js", "MongoDB", "REST APIs"],
            imageCount: 17,
          },
          {
            id: "p4",
            title: "Baron App",
            year: "2023",
            description:
              "A communication and rewards platform with a simple user experience",
            tags: ["Flutter", "Express.js", "Nodejs", "MongoDB", "REST APIs"],
            imageCount: 26,
          },
          {
            id: "p2",
            title: "ROZ NET — ISP Management System",
            year: "2022",
            description:
              "A SaaS system for managing subscriptions, billing, and network tower monitoring",
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
      },
      about: {
        ar: {
          name: "عمر الدباغ",
          description:
            "مطور برمجيات متخصص في بناء تطبيقات الموبايل وأنظمة الأعمال المتكاملة",
        },
        en: {
          name: "Omer Al-Dabbagh",
          description:
            "Software developer specializing in mobile applications and integrated business systems",
        },
      },
      skills: [
        { name: "Flutter", progress: 95, category: "mobile" },
        { name: "Dart", progress: 90, category: "mobile" },
        { name: "Node.js", progress: 90, category: "backend" },
        { name: "Express.js", progress: 88, category: "backend" },
        { name: "MongoDB", progress: 85, category: "backend" },
        { name: "REST APIs", progress: 92, category: "backend" },
        { name: "Git & GitHub", progress: 87, category: "tools" },
        { name: "UI/UX Design", progress: 80, category: "tools" },
      ],
      contact: {
        email: "omer11.oo13@gmail.com",
        linkedin: "https://www.linkedin.com/in/omer-al-dabbagh-5638a328b",
        github: "https://github.com/omer2190",
      },
      metadata: {
        lastUpdate: new Date().toISOString(),
        version: "1.0.0",
      },
    };
  }

  // Get all data
  getData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch (error) {
      console.error("Error reading data:", error);
      return this.getDefaultData();
    }
  }

  // Save all data
  saveData(data) {
    try {
      data.metadata.lastUpdate = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return { success: true, message: "تم حفظ البيانات بنجاح" };
    } catch (error) {
      console.error("Error saving data:", error);
      return { success: false, message: "فشل حفظ البيانات" };
    }
  }

  // Get projects
  getProjects(lang = "ar") {
    const data = this.getData();
    return data.projects[lang] || [];
  }

  // Add project
  addProject(projectData, lang = "ar") {
    const data = this.getData();
    const newProject = {
      id: `p${Date.now()}`,
      ...projectData,
    };
    data.projects[lang].unshift(newProject);
    return this.saveData(data);
  }

  // Update project
  updateProject(projectId, projectData, lang = "ar") {
    const data = this.getData();
    const index = data.projects[lang].findIndex((p) => p.id === projectId);
    if (index !== -1) {
      data.projects[lang][index] = {
        ...data.projects[lang][index],
        ...projectData,
      };
      return this.saveData(data);
    }
    return { success: false, message: "المشروع غير موجود" };
  }

  // Delete project
  deleteProject(projectId, lang = "ar") {
    const data = this.getData();
    data.projects[lang] = data.projects[lang].filter((p) => p.id !== projectId);
    return this.saveData(data);
  }

  // Get about data
  getAbout(lang = "ar") {
    const data = this.getData();
    return data.about[lang];
  }

  // Update about data
  updateAbout(aboutData, lang = "ar") {
    const data = this.getData();
    data.about[lang] = { ...data.about[lang], ...aboutData };
    return this.saveData(data);
  }

  // Get skills
  getSkills() {
    const data = this.getData();
    return data.skills || [];
  }

  // Update skills
  updateSkills(skills) {
    const data = this.getData();
    data.skills = skills;
    return this.saveData(data);
  }

  // Get contact
  getContact() {
    const data = this.getData();
    return data.contact;
  }

  // Update contact
  updateContact(contactData) {
    const data = this.getData();
    data.contact = { ...data.contact, ...contactData };
    return this.saveData(data);
  }

  // Export data as JSON
  exportData() {
    const data = this.getData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  // Import data from JSON
  importData(jsonData) {
    try {
      const data =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      return this.saveData(data);
    } catch (error) {
      return { success: false, message: "ملف JSON غير صالح" };
    }
  }

  // Reset to default
  resetData() {
    const defaultData = this.getDefaultData();
    return this.saveData(defaultData);
  }

  // ==========================================
  // FUTURE: Backend Integration Methods
  // Uncomment and configure when ready
  // ==========================================

  /*
  // Fetch data from backend
  async fetchFromBackend() {
    try {
      const response = await fetch('YOUR_API_URL/data');
      const data = await response.json();
      this.saveData(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: 'فشل تحميل البيانات من الخادم' };
    }
  }

  // Sync data to backend
  async syncToBackend() {
    try {
      const data = this.getData();
      const response = await fetch('YOUR_API_URL/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return { success: response.ok, message: 'تم مزامنة البيانات' };
    } catch (error) {
      return { success: false, message: 'فشلت المزامنة مع الخادم' };
    }
  }
  */
}

// Initialize Data Manager
const dataManager = new DataManager();
