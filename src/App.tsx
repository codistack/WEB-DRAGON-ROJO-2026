import React, { useState, useEffect } from 'react';
import { FlameCanvas } from './components/FlameCanvas';
import { Navbar } from './components/Navbar';
import { NoticeBar } from './components/NoticeBar';
import { Hero } from './components/Hero';
import { FlavorQuiz } from './components/FlavorQuiz';
import { MenuSection } from './components/MenuSection';
import { CombosSection } from './components/CombosSection';
import { CharcoalSecret } from './components/CharcoalSecret';
import { LocationSection } from './components/LocationSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { DishDetailModal } from './components/DishDetailModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FullAppDatabase, Product } from './types';
import { INITIAL_DATABASE } from './data/initialData';

export default function App() {
  const [data, setData] = useState<FullAppDatabase>(INITIAL_DATABASE);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSection, setActiveSection] = useState('inicio');

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('dragon_admin_token'));
  const [adminUser, setAdminUser] = useState<any>(null);

  // Path detection for secret admin route /dragonrojoec
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch Public Restaurant Data
  const fetchPublicData = async () => {
    try {
      const res = await fetch('/api/public/data');
      const json = await res.json();
      if (json.success && json.data) {
        setData((prev) => ({
          ...prev,
          settings: json.data.settings || prev.settings,
          categories: json.data.categories || prev.categories,
          products: json.data.products || prev.products,
          offers: json.data.offers || prev.offers,
          schedules: json.data.schedules || prev.schedules,
          testimonials: json.data.testimonials || prev.testimonials,
          gallery: json.data.gallery || prev.gallery,
          faqs: json.data.faqs || prev.faqs,
          socialLinks: json.data.socialLinks ? [json.data.socialLinks] : prev.socialLinks,
          seoMetadata: json.data.seoMetadata ? [json.data.seoMetadata] : prev.seoMetadata,
        }));
      }
    } catch (err) {
      console.warn('Using initial seed fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  const handleAdminSuccessLogin = (token: string, user: any) => {
    localStorage.setItem('dragon_admin_token', token);
    setAdminToken(token);
    setAdminUser(user);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('dragon_admin_token');
    setAdminToken(null);
    setAdminUser(null);
  };

  // Check if user is accessing secret route /dragonrojoec
  const isSecretAdminRoute = currentPath.toLowerCase().startsWith('/dragonrojoec');

  if (isSecretAdminRoute) {
    if (adminToken) {
      return <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />;
    }
    return <AdminLogin onSuccessLogin={handleAdminSuccessLogin} />;
  }

  const socialLinks = data.socialLinks[0] || INITIAL_DATABASE.socialLinks[0];

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      darkMode ? 'bg-[#050505] text-[#F5F5F5]' : 'bg-zinc-50 text-zinc-900'
    }`}>
      {/* Background Animated Flame/Ember Canvas */}
      <FlameCanvas enabled={data.settings.flameEffectsEnabled} />

      {/* Navigation Header */}
      <Navbar
        settings={data.settings}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        activeSection={activeSection}
      />

      {/* Sticky Mandatory Notice Bar */}
      <NoticeBar noticeText={data.settings.noticeText} />

      {/* Main Public Page Content */}
      <main className="relative z-10">
        <Hero settings={data.settings} />

        <FlavorQuiz
          products={data.products}
          onSelectProduct={(product) => setSelectedProduct(product)}
        />

        <MenuSection
          categories={data.categories}
          products={data.products}
          onSelectProduct={(product) => setSelectedProduct(product)}
        />

        <CombosSection
          offers={data.offers}
          googleMapsUrl={data.settings.googleMapsUrl}
        />

        <CharcoalSecret />

        <LocationSection
          settings={data.settings}
          schedules={data.schedules}
        />

        <GallerySection gallery={data.gallery} />

        <TestimonialsSection testimonials={data.testimonials} />

        <FaqSection faqs={data.faqs} />
      </main>

      {/* Footer */}
      <Footer settings={data.settings} socials={socialLinks} />

      {/* Dish Detailed Modal */}
      <DishDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        googleMapsUrl={data.settings.googleMapsUrl}
      />
    </div>
  );
}
