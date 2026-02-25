import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  ar: {
    "nav-home": "الرئيسية",
    "nav-about": "من أنا",
    "nav-experience": "الخبرات",
    "nav-projects": "المشاريع",
    "nav-contact": "تواصل معي",

    "hero-badge": "مطور حلول برمجية محترف",
    "hero-title": "من فكرة إلى واقع رقمي",
    "hero-subtitle":
      "أنا عمر الدباغ، مطور برمجيات متخصص في بناء تطبيقات الموبايل وأنظمة الأعمال المتكاملة. أحول أفكارك إلى حلول تقنية احترافية مع تجربة مستخدم استثنائية وأداء متميز.",
    "hero-cta-projects": "استعرض أعمالي",
    "hero-cta-contact": "تواصل معي",

    "about-badge": "نبذة عني",
    "about-title": "تحويل التحديات إلى حلول ذكية",
    "about-text":
      "أؤمن بأن كل مشروع هو فرصة لخلق شيء استثنائي. أركز على تقديم حلول عملية ومبتكرة تجمع بين التصميم الأنيق والأداء العالي وتجربة المستخدم المتميزة.",

    "projects-badge": "معرض الأعمال",
    "projects-title": "مشاريعي المميزة",

    "contact-badge": "تواصل معي",
    "contact-title": "لنبدأ مشروعك القادم",
    "contact-subtitle": "لديك فكرة مشروع؟ دعنا نحولها إلى واقع ملموس.",

    "back-to-projects": "العودة للمشاريع",
    "visit-project": "زيارة المشروع",
    copyright: "عمر الدباغ. جميع الحقوق محفوظة.",
    "login-title": "دخول الإدارة",
    "login-email": "البريد الإلكتروني",
    "login-password": "كلمة المرور",
    "login-button": "تسجيل الدخول",
    "admin-title": "لوحة التحكم",
    "admin-add-project": "إضافة مشروع جديد",
    "admin-logout": "تسجيل الخروج",
    "admin-nav-overview": "نظرة عامة",
    "admin-nav-projects": "المشاريع",
    "admin-nav-skills": "المهارات",
    "admin-nav-about": "بياناتي",
    "admin-nav-contact": "التواصل",
    "admin-nav-settings": "الإعدادات",
    "admin-stats-total-projects": "إجمالي المشاريع",
    "admin-stats-total-skills": "المهارات",
    "admin-stats-years-exp": "سنوات الخبرة",
    "admin-save": "حفظ التغييرات",
    "admin-cancel": "إلغاء",
    "admin-confirm-delete": "هل أنت متأكد من الحذف؟",
    "skill-mobile": "تطبيقات الموبايل",
    "skill-backend": "تطوير الأنظمة الخلفية",
    "skill-tools": "الأدوات والتقنيات",
  },
  en: {
    "nav-home": "Home",
    "nav-about": "About",
    "nav-experience": "Experience",
    "nav-projects": "Projects",
    "nav-contact": "Contact",

    "hero-badge": "Professional Software Developer",
    "hero-title": "From Idea to Digital Reality",
    "hero-subtitle":
      "I'm Omer Al-Dabbagh, a software developer specialized in building mobile applications and integrated business systems. I transform your ideas into professional technical solutions.",
    "hero-cta-projects": "View My Work",
    "hero-cta-contact": "Contact Me",

    "about-badge": "About Me",
    "about-title": "Turning Challenges into Smart Solutions",
    "about-text":
      "I believe that every project is an opportunity to create something exceptional. I focus on providing practical and innovative solutions that combine elegant design with high performance.",

    "projects-badge": "Portfolio",
    "projects-title": "Featured Projects",

    "contact-badge": "Connect",
    "contact-title": "Let's Start Your Next Project",
    "contact-subtitle":
      "Have a project idea? Let's turn it into a tangible reality.",

    "back-to-projects": "Back to Projects",
    "visit-project": "Visit Project",
    copyright: "Omer Al-Dabbagh. All Rights Reserved.",
    "login-title": "Admin Login",
    "login-email": "Email Address",
    "login-password": "Password",
    "login-button": "Sign In",
    "admin-title": "Dashboard",
    "admin-add-project": "New Project",
    "admin-logout": "Logout",
    "admin-nav-overview": "Overview",
    "admin-nav-projects": "Projects",
    "admin-nav-skills": "Skills",
    "admin-nav-about": "Profile",
    "admin-nav-contact": "Contact",
    "admin-nav-settings": "Settings",
    "admin-stats-total-projects": "Total Projects",
    "admin-stats-total-skills": "Skills",
    "admin-stats-years-exp": "Years Exp",
    "admin-save": "Save Changes",
    "admin-cancel": "Cancel",
    "admin-confirm-delete": "Are you sure you want to delete this?",
    "skill-mobile": "Mobile Development",
    "skill-backend": "Backend & API",
    "skill-tools": "Tools & DevOps",
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("language") || "ar");

  useEffect(() => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
