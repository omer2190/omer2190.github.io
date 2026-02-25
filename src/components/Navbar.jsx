import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Globe, Code, Menu, X } from "lucide-react";

const Navbar = () => {
  const { lang, t, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.8, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [8, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#home", label: t("nav-home") },
    { href: "/#about", label: t("nav-about") },
    { href: "/#projects", label: t("nav-projects") },
    { href: "/#contact", label: t("nav-contact") },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        opacity: navOpacity,
        background: scrolled
          ? "rgba(15, 23, 42, 0.95)"
          : "rgba(15, 23, 42, 0.7)",
        backdropFilter: `blur(${scrolled ? "20px" : "12px"})`,
        borderBottom: scrolled
          ? "1px solid rgba(99, 102, 241, 0.2)"
          : "1px solid rgba(255, 255, 255, 0.05)",
        padding: scrolled ? "0.75rem 0" : "1.25rem 0",
        boxShadow: scrolled ? "0 10px 40px rgba(0, 0, 0, 0.3)" : "none",
        transition:
          "padding 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, border-bottom 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            zIndex: 1001,
          }}
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--secondary))",
              borderRadius: "12px",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Code size={24} color="white" />
          </motion.div>
          <motion.span
            whileHover={{ scale: 1.05 }}
            style={{
              fontWeight: 900,
              fontSize: "1.5rem",
              background: "linear-gradient(135deg, #ffffff, #a5b4fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {lang === "ar" ? "عمر الدباغ" : "Omer Al-Dabbagh"}
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div
          className="nav-links"
          style={{ display: "flex", gap: "2rem", alignItems: "center" }}
        >
          <div style={{ display: "flex", gap: "2rem" }}>
            {navLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                aria-label={link.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  y: -3,
                  color: "var(--primary)",
                }}
                style={{
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  position: "relative",
                  transition: "color 0.3s ease",
                }}
              >
                {link.label}
                <motion.div
                  whileHover={{ scaleX: 1 }}
                  style={{
                    position: "absolute",
                    bottom: -5,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background:
                      "linear-gradient(90deg, var(--primary), var(--secondary))",
                    scaleX: 0,
                    transformOrigin: "left",
                  }}
                />
              </motion.a>
            ))}
          </div>

          {/* Language Toggle */}
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "999px",
              background:
                "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              color: "var(--text-primary)",
              fontWeight: 700,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Globe size={18} />
            </motion.div>
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
            <motion.div
              whileHover={{ scale: 1.5 }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at center, rgba(99, 102, 241, 0.2), transparent 70%)",
                pointerEvents: "none",
              }}
            />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
