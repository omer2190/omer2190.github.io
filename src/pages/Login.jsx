import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../services/supabase";
import { useLanguage } from "../context/LanguageContext";
import { Lock, Mail, ShieldAlert } from "lucide-react";
import SEO from "../components/SEO";
import AnimatedBackground from "../components/AnimatedBackground";

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <SEO title={t("login-title")} />
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{
          maxWidth: "450px",
          width: "100%",
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "2rem",
          padding: "3rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              width: "80px",
              height: "80px",
              background:
                "linear-gradient(135deg, var(--primary), var(--secondary))",
              borderRadius: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
            }}
          >
            <Lock size={40} color="white" />
          </motion.div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              marginBottom: "0.5rem",
            }}
          >
            {t("login-title")}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>{t("nav-logo")} CMS</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              padding: "1rem",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "1rem",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "2rem",
              fontSize: "0.9rem",
            }}
          >
            <ShieldAlert size={20} />
            {error === "Invalid login credentials"
              ? t("lang") === "ar"
                ? "بيانات الدخول غير صحيحة"
                : "Invalid credentials"
              : error}
          </motion.div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={{ position: "relative" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.75rem",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              {t("login-email")}
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                style={{
                  position: "absolute",
                  left: "1.25rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
                size={20}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1rem 1.25rem 1rem 3.25rem",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")
                }
              />
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.75rem",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              {t("login-password")}
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                style={{
                  position: "absolute",
                  left: "1.25rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
                size={20}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1rem 1.25rem 1rem 3.25rem",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")
                }
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            style={{
              marginTop: "1rem",
              padding: "1.25rem",
              background:
                "linear-gradient(135deg, var(--primary), var(--secondary))",
              color: "white",
              border: "none",
              borderRadius: "1rem",
              fontSize: "1.1rem",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: "24px",
                  height: "24px",
                  border: "3px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                }}
              />
            ) : (
              t("login-button")
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
