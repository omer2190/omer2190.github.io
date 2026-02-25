import React from "react";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        padding: "4rem 0 2rem",
        textAlign: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        marginTop: "4rem",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>
          &copy; {new Date().getFullYear()} {t("copyright")}
        </p>
        <a
          href="/login"
          style={{ color: "rgba(255,255,255,0.05)", fontSize: "0.8rem" }}
          title="Admin Login"
        >
          <i className="fas fa-lock"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
