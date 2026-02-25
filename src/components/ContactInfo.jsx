import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Facebook } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ContactInfo = () => {
  const { lang } = useLanguage();

  const contactMethods = [
    {
      icon: <Mail />,
      label: lang === "ar" ? "البريد الإلكتروني" : "Email",
      value: "omer11.oo13@gmail.com",
      href: "mailto:omer11.oo13@gmail.com",
    },
    {
      icon: <Phone />,
      label: lang === "ar" ? "الهاتف" : "Phone",
      value: "+964 787 840 9236",
      href: "tel:+9647878409236",
    },
    {
      icon: <MapPin />,
      label: lang === "ar" ? "الموقع" : "Location",
      value: lang === "ar" ? "العراق" : "Iraq",
    },
  ];

  const socialLinks = [
    {
      icon: <Github />,
      name: "GitHub",
      url: "https://github.com/omer2190",
      color: "#333",
    },
    {
      icon: <Linkedin />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/omer-al-dabbagh-5638a328b/",
      color: "#0077B5",
    },
    {
      icon: <Facebook />,
      name: "Facebook",
      url: "https://www.facebook.com/omer2190",
      color: "#1877F2",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "2rem",
      }}
    >
      {/* Contact Methods */}
      {contactMethods.map((contact, index) => (
        <motion.a
          key={index}
          href={contact.href}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "1.25rem",
            padding: "2rem",
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              top: "-50%",
              right: "-50%",
              width: "200%",
              height: "200%",
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.05), transparent 60%)",
            }}
          />
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            style={{
              color: "var(--primary)",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {React.cloneElement(contact.icon, { size: 40 })}
          </motion.div>
          <h4
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            {contact.label}
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            {contact.value}
          </p>
        </motion.a>
      ))}

      {/* Social Links - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          gap: "1.5rem",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "2rem",
        }}
      >
        {socialLinks.map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${social.color}, ${social.color}dd)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute",
                inset: -5,
                borderRadius: "50%",
                border: `2px solid ${social.color}`,
                opacity: 0.5,
              }}
            />
            {React.cloneElement(social.icon, { size: 30 })}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};

export default ContactInfo;
