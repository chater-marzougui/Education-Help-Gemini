import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function SEO({
  title = 'PDF AI Viewer - Analyze PDFs with Gemini AI',
  description = 'A powerful web-based PDF viewer with AI-powered slide analysis and explanation capabilities using Google\'s Gemini API. Upload PDFs and get instant explanations and insights.',
  keywords = 'PDF viewer, AI analysis, Gemini AI, PDF helper, education, document analysis, slide explanation, AI assistant',
  ogTitle,
  ogDescription,
  ogImage = '/assets/logo.png'
}: SEOProps) {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.content = content;
    };

    // Standard meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', 'Chater Marzougui');
    setMetaTag('robots', 'index, follow');
    
    // Open Graph tags
    setMetaTag('og:title', ogTitle || title, true);
    setMetaTag('og:description', ogDescription || description, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', window.location.href, true);
    
    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', ogTitle || title);
    setMetaTag('twitter:description', ogDescription || description);
    setMetaTag('twitter:image', ogImage);
    
    // Theme color
    setMetaTag('theme-color', '#6366f1');
    
    // Mobile optimization
    setMetaTag('mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    setMetaTag('apple-mobile-web-app-title', 'PDF AI Viewer');
  }, [title, description, keywords, ogTitle, ogDescription, ogImage]);

  return null;
}
