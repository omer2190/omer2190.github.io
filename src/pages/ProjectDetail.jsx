import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../services/supabase";
import { useLanguage } from "../context/LanguageContext";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import Loader from "../components/Loader";
import SEO from "../components/SEO";

const ProjectDetail = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    // Force direction on mount in case of direct navigation
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProject(data);

        // Initial active image
        if (data.images?.length > 0) {
          setActiveImage(data.images[0]);
        } else {
          const folderId = String(data.id).startsWith("p")
            ? data.id
            : `p${data.id}`;
          setActiveImage(`assets/projects/${folderId}/p (1).png`);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader />;
  if (!project)
    return (
      <div
        className="container"
        style={{ padding: "200px 0", textAlign: "center" }}
      >
        Project not found.
      </div>
    );

  const title = lang === "ar" ? project.title_ar : project.title_en;
  const description =
    lang === "ar" ? project.description_ar : project.description_en;
  const content =
    lang === "ar"
      ? project.content_ar || project.description_ar
      : project.content_en || project.description_en;

  // Gallery images logic
  let gallery = [];
  if (project.images && project.images.length > 0) {
    gallery = project.images;
  } else {
    const folderId = String(project.id).startsWith("p")
      ? project.id
      : `p${project.id}`;
    gallery = Array.from(
      { length: project.image_count || 0 },
      (_, i) => `assets/projects/${folderId}/p (${i + 1}).png`,
    );
  }

  return (
    <div className="project-detail" style={{ padding: "120px 0" }}>
      <SEO
        title={title}
        description={description}
        url={`/project/${id}`}
        article={true}
      />

      <div className="container">
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
            color: "var(--primary)",
            fontWeight: 600,
          }}
        >
          {lang === "ar" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          {t("back-to-projects")}
        </Link>

        <header style={{ marginBottom: "3rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <div>
              <span
                style={{
                  color: "var(--text-muted)",
                  marginBottom: "0.5rem",
                  display: "block",
                  fontWeight: 600,
                }}
              >
                {project.year}
              </span>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: 900,
                  marginBottom: "1rem",
                }}
              >
                {title}
              </h1>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "var(--primary)",
                  color: "white",
                  padding: "1rem 2rem",
                  borderRadius: "0.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {t("visit-project")}
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "3rem",
          }}
        >
          <div className="gallery-section">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={activeImage}
              alt={title}
              style={{
                width: "100%",
                borderRadius: "1.5rem",
                boxShadow: "var(--shadow-xl)",
                marginBottom: "1.5rem",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "1rem",
                overflowX: "auto",
                paddingBottom: "1rem",
              }}
            >
              {gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    border:
                      activeImage === img
                        ? "2px solid var(--primary)"
                        : "2px solid transparent",
                    opacity: activeImage === img ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="content-section">
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: "1.5rem",
              }}
            >
              {lang === "ar" ? "عن المشروع" : "About Project"}
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                lineHeight: 1.8,
              }}
            >
              {description}
            </p>
            <div
              style={{
                height: "1px",
                background: "rgba(255,255,255,0.05)",
                marginBottom: "2rem",
              }}
            ></div>
            <div
              style={{
                whiteSpace: "pre-wrap",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
              }}
            >
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
