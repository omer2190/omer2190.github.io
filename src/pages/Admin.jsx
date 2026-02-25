import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../services/supabase";
import { useLanguage } from "../context/LanguageContext";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  LogOut,
  Layout,
  Image as ImageIcon,
  Tag,
  Calendar,
  Type,
  Home,
  Code2,
  User,
  Mail,
  Settings,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Github,
  Linkedin,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  Globe,
} from "lucide-react";
import SEO from "../components/SEO";

const Admin = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);

  // Form States
  const [projectForm, setProjectForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    content_ar: "",
    content_en: "",
    link: "",
    year: new Date().getFullYear(),
    tags: [],
    image_count: 1,
    images: [],
    display_order: 0,
  });

  const [skillForm, setSkillForm] = useState({
    name: "",
    progress: 80,
    category: "mobile",
    icon_class: "fas fa-code",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
        fetchAllData();
      }
    };
    checkUser();
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [projRes, skillRes, profRes] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase.from("skills").select("*").order("category"),
        supabase.from("profile").select("*"),
      ]);

      if (projRes.data) setProjects(projRes.data);
      if (skillRes.data) setSkills(skillRes.data);

      if (profRes.data) {
        const profMap = {};
        profRes.data.forEach((item) => {
          if (!profMap[item.category]) profMap[item.category] = {};
          profMap[item.category][item.key] = item.value;
        });
        setProfile(profMap);
      }
    } catch (err) {
      console.error(err);
      showToast("Error loading data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // --- Project Management ---
  const handleOpenProjectModal = (project = null) => {
    if (project) {
      setEditingItem(project);
      setProjectForm({ ...project, tags: project.tags || [] });
    } else {
      setEditingItem(null);
      setProjectForm({
        title_ar: "",
        title_en: "",
        description_ar: "",
        description_en: "",
        content_ar: "",
        content_en: "",
        link: "",
        year: new Date().getFullYear(),
        tags: [],
        image_count: 1,
        images: [],
        display_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setGlobalLoading(true);
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("projects")
          .update(projectForm)
          .eq("id", editingItem.id);
        if (error) throw error;
        showToast("Project updated");
      } else {
        const { error } = await supabase.from("projects").insert([projectForm]);
        if (error) throw error;
        showToast("Project added");
      }
      setIsModalOpen(false);
      fetchAllData();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleProjectDelete = async (id) => {
    if (!window.confirm(t("admin-confirm-delete"))) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      showToast("Project deleted");
      fetchAllData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // --- Skill Management ---
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setGlobalLoading(true);
    try {
      const { error } = await supabase.from("skills").insert([skillForm]);
      if (error) throw error;
      showToast("Skill added");
      setSkillForm({
        name: "",
        progress: 80,
        category: "mobile",
        icon_class: "fas fa-code",
      });
      fetchAllData();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleSkillDelete = async (id) => {
    if (!window.confirm(t("admin-confirm-delete"))) return;
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      showToast("Skill deleted");
      fetchAllData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // --- Profile Management ---
  const handleProfileUpdate = async (category, key, value) => {
    try {
      const { error } = await supabase
        .from("profile")
        .upsert({ category, key, value }, { onConflict: "key" });
      if (error) throw error;
      showToast("Profile updated");
      fetchAllData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (!user) return null;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      <SEO title={t("admin-title")} />

      {/* Sidebar */}
      <aside
        style={{
          width: "280px",
          background: "#1e293b",
          borderLeft:
            lang === "ar" ? "1px solid rgba(255,255,255,0.05)" : "none",
          borderRight:
            lang === "en" ? "1px solid rgba(255,255,255,0.05)" : "none",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0 1rem",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              padding: "0.75rem",
              background: "var(--primary)",
              borderRadius: "1rem",
            }}
          >
            <Layout size={24} />
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: 900 }}>
            {t("nav-logo")} CMS
          </span>
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            flex: 1,
          }}
        >
          <NavButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<Home size={20} />}
            label={t("admin-nav-overview")}
          />
          <NavButton
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
            icon={<Layout size={20} />}
            label={t("admin-nav-projects")}
          />
          <NavButton
            active={activeTab === "skills"}
            onClick={() => setActiveTab("skills")}
            icon={<Code2 size={20} />}
            label={t("admin-nav-skills")}
          />
          <NavButton
            active={activeTab === "about"}
            onClick={() => setActiveTab("about")}
            icon={<User size={20} />}
            label={t("admin-nav-about")}
          />
          <NavButton
            active={activeTab === "contact"}
            onClick={() => setActiveTab("contact")}
            icon={<Mail size={20} />}
            label={t("admin-nav-contact")}
          />
          <NavButton
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            icon={<Settings size={20} />}
            label={t("admin-nav-settings")}
          />
        </nav>

        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            marginTop: "auto",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "#ef4444",
              background: "rgba(239, 68, 68, 0.1)",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            <LogOut size={20} />
            {t("admin-logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "3rem", overflowY: "auto" }}>
        <header
          style={{
            marginBottom: "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                marginBottom: "0.5rem",
              }}
            >
              {t(`admin-nav-${activeTab}`)}
            </h1>
            <p style={{ color: "var(--text-muted)" }}>{user.email}</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => fetchAllData()}
              style={{
                padding: "0.75rem",
                borderRadius: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Globe size={20} />
            </button>
          </div>
        </header>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <Loader2
              className="animate-spin"
              size={48}
              color="var(--primary)"
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <OverviewTab key="overview" projects={projects} skills={skills} />
            )}
            {activeTab === "projects" && (
              <ProjectsTab
                key="projects"
                projects={projects}
                onAdd={() => handleOpenProjectModal()}
                onEdit={handleOpenProjectModal}
                onDelete={handleProjectDelete}
                t={t}
              />
            )}
            {activeTab === "skills" && (
              <SkillsTab
                key="skills"
                skills={skills}
                form={skillForm}
                setForm={setSkillForm}
                onSubmit={handleSkillSubmit}
                onDelete={handleSkillDelete}
                t={t}
              />
            )}
            {activeTab === "about" && (
              <AboutTab
                key="about"
                profile={profile}
                onUpdate={handleProfileUpdate}
                t={t}
              />
            )}
            {activeTab === "contact" && (
              <ContactTab
                key="contact"
                profile={profile}
                onUpdate={handleProfileUpdate}
                t={t}
              />
            )}
            {activeTab === "settings" && (
              <SettingsTab key="settings" t={t} showToast={showToast} />
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Modal & Toast */}
      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          form={projectForm}
          setForm={setProjectForm}
          onSubmit={handleProjectSubmit}
          isEditing={!!editingItem}
          t={t}
          loading={globalLoading}
        />
      )}

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            padding: "1rem 2rem",
            background: toast.type === "success" ? "#10b981" : "#ef4444",
            borderRadius: "1rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            zIndex: 1000,
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {toast.message}
        </motion.div>
      )}

      {globalLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2 className="animate-spin" size={64} color="var(--primary)" />
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "0.75rem 1rem",
      borderRadius: "0.75rem",
      background: active ? "rgba(99, 102, 241, 0.1)" : "transparent",
      color: active ? "var(--primary)" : "var(--text-muted)",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      fontWeight: active ? 700 : 500,
      transition: "all 0.3s",
    }}
  >
    {icon}
    <span style={{ fontSize: "0.95rem" }}>{label}</span>
  </button>
);

const OverviewTab = ({ projects, skills }) => {
  const { t } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <StatCard
          label={t("admin-stats-total-projects")}
          value={projects.length}
          icon={<Layout size={32} />}
          color="#6366f1"
        />
        <StatCard
          label={t("admin-stats-total-skills")}
          value={skills.length}
          icon={<Code2 size={32} />}
          color="#ec4899"
        />
        <StatCard
          label={t("admin-stats-years-exp")}
          value="6+"
          icon={<Calendar size={32} />}
          color="#10b981"
        />
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "2rem",
          padding: "3rem",
          border: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            marginBottom: "1.5rem",
          }}
        >
          Welcome Back! 👋
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Manage your portfolio content from here. You can add projects, update
          your skills, and keep your profile information up to date.
        </p>
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.02)",
      padding: "2rem",
      borderRadius: "1.5rem",
      border: "1px solid rgba(255,255,255,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
    }}
  >
    <div
      style={{
        padding: "1rem",
        background: `${color}15`,
        color: color,
        borderRadius: "1rem",
      }}
    >
      {icon}
    </div>
    <div>
      <h3
        style={{
          fontSize: "0.9rem",
          color: "var(--text-muted)",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </h3>
      <p style={{ fontSize: "2rem", fontWeight: 900 }}>{value}</p>
    </div>
  </div>
);

const ProjectsTab = ({ projects, onAdd, onEdit, onDelete, t }) => {
  const { lang } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Manage Projects</h2>
        <button
          onClick={onAdd}
          style={{
            padding: "0.75rem 1.5rem",
            background: "var(--primary)",
            borderRadius: "0.75rem",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 700,
          }}
        >
          <Plus size={20} />
          {t("admin-add-project")}
        </button>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {projects.map((proj) => (
          <div
            key={proj.id}
            style={{
              padding: "1.5rem",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}
            >
              <div
                style={{
                  width: "80px",
                  height: "60px",
                  borderRadius: "0.5rem",
                  background: "rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={proj.images?.[0] || "https://via.placeholder.com/80x60"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <h3 style={{ fontWeight: 700 }}>
                  {lang === "ar" ? proj.title_ar : proj.title_en}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {proj.year} | {proj.tags?.join(", ")}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => onEdit(proj)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--primary)",
                }}
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(proj.id)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  cursor: "pointer",
                  color: "#ef4444",
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ProjectsTabSkeletong = () => <div>Skeleton...</div>;

const ProjectModal = ({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
  isEditing,
  t,
  loading,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { data, error } = await supabase.storage
          .from("portfolio")
          .upload(filePath, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setForm({ ...form, images: [...(form.images || []), ...urls] });
    } catch (err) {
      alert("Error uploading images: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
        }}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "900px",
          background: "#1e293b",
          borderRadius: "2rem",
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "2rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900 }}>
            {isEditing ? "Edit Project" : t("admin-add-project")}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          style={{
            padding: "2rem",
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              gridColumn: "span 2",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
              padding: "1.5rem",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "1.5rem",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <h3
              style={{
                gridColumn: "span 2",
                fontSize: "1rem",
                color: "var(--primary)",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              Project Images
            </h3>
            <div style={{ gridColumn: "span 2" }}>
              <div
                style={{
                  width: "100%",
                  padding: "2rem",
                  border: "2px dashed rgba(255,255,255,0.1)",
                  borderRadius: "1rem",
                  textAlign: "center",
                  background: "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <ImageIcon
                  size={48}
                  color="var(--primary)"
                  style={{ marginBottom: "1rem" }}
                />
                <p style={{ color: "var(--text-secondary)" }}>
                  {uploading
                    ? "Uploading..."
                    : "Click or drop images to upload"}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
                  }}
                  disabled={uploading}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "1rem",
                  marginTop: "1.5rem",
                }}
              >
                {form.images?.map((url, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      height: "80px",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <img
                      src={url}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={() => removeImage(i)}
                      type="button"
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "rgba(239, 68, 68, 0.8)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px",
                        cursor: "pointer",
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <AdminField
            label="Title (AR)"
            value={form.title_ar}
            onChange={(v) => setForm({ ...form, title_ar: v })}
          />
          <AdminField
            label="Title (EN)"
            value={form.title_en}
            onChange={(v) => setForm({ ...form, title_en: v })}
          />
          <AdminField
            label="Year"
            value={form.year}
            onChange={(v) => setForm({ ...form, year: v })}
          />
          <AdminField
            label="Link"
            value={form.link}
            onChange={(v) => setForm({ ...form, link: v })}
          />
          <AdminField
            label="Display Order (0 = First)"
            type="number"
            value={form.display_order}
            onChange={(v) => setForm({ ...form, display_order: parseInt(v) })}
          />
          <AdminField
            label="Tags (split by ,)"
            value={form.tags.join(", ")}
            onChange={(v) =>
              setForm({ ...form, tags: v.split(",").map((s) => s.trim()) })
            }
          />
          <AdminField
            label="Image Count"
            type="number"
            value={form.image_count}
            onChange={(v) => setForm({ ...form, image_count: parseInt(v) })}
          />

          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              Description (AR)
            </label>
            <textarea
              value={form.description_ar}
              onChange={(e) =>
                setForm({ ...form, description_ar: e.target.value })
              }
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                color: "white",
                minHeight: "80px",
              }}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              Description (EN)
            </label>
            <textarea
              value={form.description_en}
              onChange={(e) =>
                setForm({ ...form, description_en: e.target.value })
              }
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                color: "white",
                minHeight: "80px",
              }}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              Content (AR)
            </label>
            <textarea
              value={form.content_ar}
              onChange={(e) => setForm({ ...form, content_ar: e.target.value })}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                color: "white",
                minHeight: "120px",
              }}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              Content (EN)
            </label>
            <textarea
              value={form.content_en}
              onChange={(e) => setForm({ ...form, content_en: e.target.value })}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                color: "white",
                minHeight: "120px",
              }}
            />
          </div>

          <div
            style={{
              gridColumn: "span 2",
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "1rem",
                background: "var(--primary)",
                color: "white",
                borderRadius: "0.75rem",
                border: "none",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {t("admin-save")}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "1rem 2rem",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("admin-cancel")}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const SkillsTab = ({ skills, form, setForm, onSubmit, onDelete, t }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <form
      onSubmit={onSubmit}
      style={{
        padding: "2rem",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "1.5rem",
        border: "1px solid rgba(255,255,255,0.05)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "3rem",
      }}
    >
      <AdminField
        label="Skill Name"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
      />
      <AdminField
        label="Progress (0-100)"
        type="number"
        value={form.progress}
        onChange={(v) => setForm({ ...form, progress: parseInt(v) })}
      />
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.75rem",
            color: "white",
          }}
        >
          <option value="mobile">Mobile</option>
          <option value="backend">Backend</option>
          <option value="tools">Tools</option>
        </select>
      </div>
      <button
        type="submit"
        style={{
          alignSelf: "flex-end",
          padding: "0.75rem",
          background: "var(--primary)",
          border: "none",
          borderRadius: "0.75rem",
          color: "white",
          fontWeight: 700,
        }}
      >
        <Plus size={20} />
      </button>
    </form>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1rem",
      }}
    >
      {skills.map((skill) => (
        <div
          key={skill.id}
          style={{
            padding: "1.25rem",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ fontWeight: 700 }}>{skill.name}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {skill.category} | {skill.progress}%
            </p>
          </div>
          <button
            onClick={() => onDelete(skill.id)}
            style={{
              color: "#ef4444",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  </motion.div>
);

const AboutTab = ({ profile, onUpdate, t }) => {
  const about = profile.about || {};
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: "800px" }}
    >
      <div style={{ display: "grid", gap: "2rem" }}>
        <div
          style={{
            padding: "2rem",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "1.5rem",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h3
            style={{
              marginBottom: "1.5rem",
              color: "var(--primary)",
              fontWeight: 800,
            }}
          >
            Hero Information
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <AdminField
              label="Name (AR)"
              value={about.name_ar || ""}
              onBlur={(v) => onUpdate("about", "name_ar", v)}
            />
            <AdminField
              label="Name (EN)"
              value={about.name_en || ""}
              onBlur={(v) => onUpdate("about", "name_en", v)}
            />
            <div style={{ gridColumn: "span 2" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                Description (AR)
              </label>
              <textarea
                defaultValue={about.description_ar}
                onBlur={(e) =>
                  onUpdate("about", "description_ar", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "0.75rem",
                  color: "white",
                  minHeight: "80px",
                }}
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                Description (EN)
              </label>
              <textarea
                defaultValue={about.description_en}
                onBlur={(e) =>
                  onUpdate("about", "description_en", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "0.75rem",
                  color: "white",
                  minHeight: "80px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ContactTab = ({ profile, onUpdate, t }) => {
  const contact = profile.contact || {};
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: "800px" }}
    >
      <div
        style={{
          padding: "2rem",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "1.5rem",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h3
          style={{
            marginBottom: "1.5rem",
            color: "var(--primary)",
            fontWeight: 800,
          }}
        >
          Contact Links
        </h3>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <AdminField
            label="Email"
            value={contact.email || ""}
            onBlur={(v) => onUpdate("contact", "email", v)}
            icon={<Mail size={18} />}
          />
          <AdminField
            label="LinkedIn"
            value={contact.linkedin || ""}
            onBlur={(v) => onUpdate("contact", "linkedin", v)}
            icon={<Linkedin size={18} />}
          />
          <AdminField
            label="GitHub"
            value={contact.github || ""}
            onBlur={(v) => onUpdate("contact", "github", v)}
            icon={<Github size={18} />}
          />
        </div>
      </div>
    </motion.div>
  );
};

const SettingsTab = ({ t, showToast }) => {
  const [pass, setPass] = useState({ old: "", new: "", confirm: "" });
  const handlePassChange = async (e) => {
    e.preventDefault();
    if (pass.new !== pass.confirm)
      return showToast("Passwords dont match", "error");
    const { error } = await supabase.auth.updateUser({ password: pass.new });
    if (error) showToast(error.message, "error");
    else {
      showToast("Password changed successfully");
      setPass({ old: "", new: "", confirm: "" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: "600px" }}
    >
      <div
        style={{
          padding: "2rem",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "1.5rem",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h3
          style={{
            marginBottom: "1.5rem",
            color: "var(--primary)",
            fontWeight: 800,
          }}
        >
          Change Password
        </h3>
        <form
          onSubmit={handlePassChange}
          style={{ display: "grid", gap: "1.25rem" }}
        >
          <AdminField
            label="New Password"
            type="password"
            value={pass.new}
            onChange={(v) => setPass({ ...pass, new: v })}
            icon={<ShieldCheck size={18} />}
          />
          <AdminField
            label="Confirm Password"
            type="password"
            value={pass.confirm}
            onChange={(v) => setPass({ ...pass, confirm: v })}
            icon={<ShieldCheck size={18} />}
          />
          <button
            type="submit"
            style={{
              padding: "1rem",
              background: "var(--primary)",
              color: "white",
              borderRadius: "0.75rem",
              border: "none",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Update Password
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const AdminField = ({
  label,
  icon,
  value,
  onChange,
  onBlur,
  type = "text",
}) => (
  <div style={{ width: "100%" }}>
    <label
      style={{
        display: "block",
        marginBottom: "0.5rem",
        fontSize: "0.8rem",
        color: "var(--text-muted)",
      }}
    >
      {label}
    </label>
    <div style={{ position: "relative" }}>
      {icon && (
        <div
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
          }}
        >
          {icon}
        </div>
      )}
      <input
        type={type}
        defaultValue={onBlur ? value : undefined}
        value={onChange ? value : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
        style={{
          width: "100%",
          padding: `0.75rem 1rem 0.75rem ${icon ? "2.8rem" : "1rem"}`,
          background: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0.75rem",
          color: "white",
          fontSize: "0.95rem",
          outline: "none",
        }}
      />
    </div>
  </div>
);

export default Admin;
