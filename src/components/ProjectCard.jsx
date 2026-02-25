import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { ArrowUpRight, Star } from "lucide-react";

const ProjectCard = ({ project, index }) => {
  const { lang } = useLanguage();

  const title = lang === "ar" ? project.title_ar : project.title_en;
  const description =
    lang === "ar" ? project.description_ar : project.description_en;

  let mainImage = null;
  if (project.images && project.images.length > 0) {
    mainImage = project.images[0];
  } else {
    const folderId = String(project.id).startsWith("p")
      ? project.id
      : `p${project.id}`;
    mainImage = `assets/projects/${folderId}/p (1).png`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      <Link to={`/project/${project.id}`} className="project-card-link">
        <motion.article
          whileHover={{
            y: -20,
            rotateY: 5,
            rotateX: 5,
            scale: 1.02,
            boxShadow: "0 30px 80px rgba(99, 102, 241, 0.3)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            background:
              "linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "2rem",
            padding: "0",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transformStyle: "preserve-3d",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Animated Border Glow */}
          <motion.div
            animate={{
              background: [
                "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)",
                "linear-gradient(180deg, transparent, rgba(236, 72, 153, 0.5), transparent)",
                "linear-gradient(270deg, transparent, rgba(99, 102, 241, 0.5), transparent)",
                "linear-gradient(360deg, transparent, rgba(236, 72, 153, 0.5), transparent)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: "2rem",
              opacity: 0,
              pointerEvents: "none",
            }}
            whileHover={{ opacity: 1 }}
          />

          {/* Image Section */}
          <div
            className="image-container"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <motion.img
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.6 }}
              src={mainImage}
              alt={title}
              style={{ width: "100%", height: "280px", objectFit: "cover" }}
            />

            {/* Overlay with Year Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent 60%)",
                display: "flex",
                alignItems: "flex-end",
                padding: "2rem",
              }}
            >
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--secondary))",
                  color: "white",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "999px",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
                }}
              >
                {project.year}
              </motion.span>
            </motion.div>

            {/* Floating Star Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                padding: "0.75rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <Star size={20} fill="rgba(255, 255, 255, 0.8)" stroke="none" />
            </motion.div>
          </div>

          {/* Content Section */}
          <div
            style={{
              padding: "2rem",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: "1.6rem", fontWeight: 900, flex: 1 }}>
                {title}
              </h3>
              <motion.div
                whileHover={{ scale: 1.3, rotate: 45 }}
                transition={{ type: "spring", stiffness: 400 }}
                style={{
                  background: "rgba(99, 102, 241, 0.1)",
                  borderRadius: "50%",
                  padding: "0.5rem",
                  marginLeft: "1rem",
                }}
              >
                <ArrowUpRight size={20} style={{ color: "var(--primary)" }} />
              </motion.div>
            </div>

            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                flex: 1,
              }}
            >
              {description}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {project.tags?.slice(0, 3).map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.15))",
                    color: "var(--text-primary)",
                    padding: "0.4rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.1)",
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
