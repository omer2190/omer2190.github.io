import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext";

const SEO = ({ title, description, image, article, keywords, url }) => {
  const { lang, t } = useLanguage();
  const siteName = lang === "ar" ? "عمر الدباغ" : "Omer Al-Dabbagh";
  const defaultDescription =
    lang === "ar"
      ? "عمر الدباغ - مطور تطبيقات موبايل وأنظمة أعمال متكاملة متخصص في بناء الحلول التقنية المبتكرة."
      : "Omer Al-Dabbagh - Professional Mobile and Business Systems Developer specializing in innovative tech solutions.";

  const siteUrl = "https://omer2190.github.io"; // Change to your actual domain
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;

  const defaultKeywords =
    lang === "ar"
      ? "مطور برمجيات, برمجة تطبيقات, جافاسكريبت, فلاتر, تطوير ويب, عمر الدباغ, مبرمج عراقي, تطبيقات موبايل"
      : "software developer, mobile apps, flutter, web development, react, nodejs, iraqi developer, omer al-dabbagh";

  const seo = {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || defaultDescription,
    image: image || `${siteUrl}/og-image.png`,
    keywords: keywords || defaultKeywords,
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language / Region */}
      <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} />

      {/* Open Graph / Facebook */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:site" content="@omer2190" />

      {/* Search Engine Optimization */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
};

export default SEO;
