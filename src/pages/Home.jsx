import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "../services/supabase";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "../components/ProjectCard";
import SEO from "../components/SEO";
import AnimatedBackground from "../components/AnimatedBackground";
import ContactInfo from "../components/ContactInfo";
import {
  ChevronDown,
  Sparkles,
  User,
  Briefcase,
  Layout,
  Code2,
  Rocket,
} from "lucide-react";

const Home = () => {
  const { lang, t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          supabase
            .from("projects")
            .select("*")
            .order("display_order", { ascending: true }),
          supabase.from("skills").select("*").order("category"),
        ]);

        if (projectsRes.error) throw projectsRes.error;
        if (skillsRes.error) throw skillsRes.error;

        setProjects(projectsRes.data || []);
        setSkills(skillsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      <SEO title={t("nav-home")} />
      <AnimatedBackground />

      {/* Hero Section - Ultra Animated */}
      <section
        id="home"
        className="hero-section"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            style={{ maxWidth: "900px" }}
          >
            {/* Animated Badge */}
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="hero-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.15))",
                color: "var(--primary)",
                borderRadius: "999px",
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "2rem",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={20} />
              </motion.div>
              {t("hero-badge")}
            </motion.span>

            {/* Animated Title with Stagger */}
            <motion.h1
              style={{
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 900,
                marginBottom: "2rem",
                lineHeight: 1.1,
                background:
                  "linear-gradient(135deg, #ffffff, #a5b4fc, #ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("hero-title")
                .split(" ")
                .map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    style={{ display: "inline-block", marginRight: "0.5rem" }}
                  >
                    {word}
                  </motion.span>
                ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                fontSize: "1.3rem",
                color: "var(--text-secondary)",
                marginBottom: "3rem",
                lineHeight: 1.8,
              }}
            >
              {t("hero-subtitle")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}
            >
              <motion.a
                href="#projects"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                style={{
                  padding: "1.25rem 3rem",
                  background:
                    "linear-gradient(135deg, var(--primary), var(--secondary))",
                  color: "white",
                  borderRadius: "1rem",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Rocket size={20} />
                {t("hero-cta-projects")}
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, borderColor: "var(--primary)" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "1.25rem 3rem",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(255, 255, 255, 0.03)",
                  color: "white",
                  borderRadius: "1rem",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  backdropFilter: "blur(10px)",
                }}
              >
                {t("hero-cta-contact")}
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "3rem",
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--text-muted)",
          }}
        >
          <ChevronDown size={40} />
        </motion.div>

        {/* Floating Shapes */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: "200px",
            height: "200px",
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            filter: "blur(40px)",
          }}
        />
      </section>

      {/* About Section - With Parallax */}
      <motion.section
        id="about"
        style={{ padding: "120px 0", position: "relative" }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              style={{
                color: "var(--secondary)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontSize: "0.9rem",
                display: "inline-block",
                marginBottom: "1.5rem",
                padding: "0.5rem 1.5rem",
                background: "rgba(236, 72, 153, 0.1)",
                borderRadius: "999px",
              }}
            >
              {t("about-badge")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 900,
                marginBottom: "2rem",
              }}
            >
              {t("about-title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: "1.2rem",
                color: "var(--text-secondary)",
                maxWidth: "800px",
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              {t("about-text")}
            </motion.p>
          </motion.div>

          {/* Premium Skill Sections */}
          <div style={{ marginTop: "6rem" }}>
            {["mobile", "backend", "tools"].map((cat, idx) => (
              <div key={cat} style={{ marginBottom: "5rem" }}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    marginBottom: "3rem",
                    padding: "1rem 2rem",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "2rem",
                    width: "fit-content",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background:
                        "linear-gradient(135deg, var(--primary), var(--secondary))",
                      borderRadius: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    {cat === "mobile" ? (
                      <Layout size={24} color="white" />
                    ) : cat === "backend" ? (
                      <Code2 size={24} color="white" />
                    ) : (
                      <Briefcase size={24} color="white" />
                    )}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 900,
                      letterSpacing: "1px",
                    }}
                  >
                    {t(`skill-${cat}`)}
                  </h3>
                </motion.div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "2rem",
                  }}
                >
                  {skills
                    .filter((s) => s.category === cat)
                    .map((skill, sIdx) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        viewport={{ once: true }}
                        transition={{ delay: sIdx * 0.1 }}
                        style={{
                          position: "relative",
                          padding: "2rem",
                          background: "rgba(30, 41, 59, 0.4)",
                          backdropFilter: "blur(15px)",
                          borderRadius: "2rem",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        {/* Background Glow */}
                        <div
                          style={{
                            position: "absolute",
                            top: "-20%",
                            right: "-20%",
                            width: "100px",
                            height: "100px",
                            background: "var(--primary)",
                            filter: "blur(60px)",
                            opacity: 0.15,
                            zIndex: 0,
                          }}
                        />

                        <div style={{ position: "relative", zIndex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "1.5rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "0.8rem",
                                  background: "rgba(255,255,255,0.05)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "var(--primary)",
                                }}
                              >
                                <i
                                  className={skill.icon_class || "fas fa-code"}
                                ></i>
                              </div>
                              <span
                                style={{ fontSize: "1.1rem", fontWeight: 800 }}
                              >
                                {skill.name}
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: 900,
                                color: "var(--secondary)",
                              }}
                            >
                              {skill.progress}%
                            </span>
                          </div>

                          {/* Animated Progress Bar */}
                          <div
                            style={{
                              height: "6px",
                              background: "rgba(255, 255, 255, 0.05)",
                              borderRadius: "99px",
                              overflow: "hidden",
                            }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.progress}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1.5,
                                ease: "easeOut",
                                delay: 0.5,
                              }}
                              style={{
                                height: "100%",
                                background:
                                  "linear-gradient(90deg, var(--primary), var(--secondary))",
                                boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
                                position: "relative",
                              }}
                            >
                              <motion.div
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                  opacity: 0.5,
                                }}
                              />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <section
        id="projects"
        style={{ padding: "120px 0", background: "rgba(0, 0, 0, 0.2)" }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "5rem" }}
          >
            <motion.span
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{
                color: "var(--primary)",
                fontWeight: 700,
                fontSize: "1rem",
                display: "inline-block",
                marginBottom: "1.5rem",
                padding: "0.75rem 1.5rem",
                background: "rgba(99, 102, 241, 0.1)",
                borderRadius: "999px",
                border: "1px solid rgba(99, 102, 241, 0.2)",
              }}
            >
              {t("projects-badge")}
            </motion.span>
            <h2
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900 }}
            >
              {t("projects-title")}
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {loading
              ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
              : projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: "120px 0" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            style={{
              background:
                "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))",
              borderRadius: "2.5rem",
              padding: "5rem 3rem",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: -100,
                background:
                  "conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.1), transparent)",
              }}
            />
            <div style={{ position: "relative", zIndex: 10 }}>
              <motion.span
                whileHover={{ scale: 1.2 }}
                style={{
                  color: "var(--primary)",
                  fontWeight: 700,
                  marginBottom: "2rem",
                  display: "block",
                  fontSize: "1.1rem",
                }}
              >
                {t("contact-badge")}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  fontWeight: 900,
                  marginBottom: "2rem",
                }}
              >
                {t("contact-title")}
              </motion.h2>
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "var(--text-secondary)",
                  marginBottom: "4rem",
                }}
              >
                {t("contact-subtitle")}
              </p>

              <ContactInfo />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Skill Card Component
const SkillCard = ({ icon, title, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotateY: -30 }}
    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
    whileHover={{ y: -15, rotateY: 10, scale: 1.05 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15, type: "spring", stiffness: 200 }}
    style={{
      background:
        "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
      padding: "3rem 2rem",
      borderRadius: "1.5rem",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      transformStyle: "preserve-3d",
      perspective: "1000px",
    }}
  >
    <motion.div
      whileHover={{ scale: 1.3, rotate: 360 }}
      transition={{ duration: 0.6 }}
      style={{
        color: "var(--primary)",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {React.cloneElement(icon, { size: 48, strokeWidth: 2 })}
    </motion.div>
    <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>{title}</h3>
  </motion.div>
);

// Skeleton Card
const SkeletonCard = () => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    style={{
      height: 450,
      background: "rgba(255,255,255,0.05)",
      borderRadius: "1.5rem",
    }}
  />
);

export default Home;
