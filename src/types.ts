export interface RestaurantSettings {
  name: string;
  slogan: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  googleMapsUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  noticeText: string;
  primaryColor: string;
  accentColor: string;
  flameEffectsEnabled: boolean;
  themeMode: 'dark' | 'light' | 'auto';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  visible: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  history: string;
  price: number;
  oldPrice?: number;
  isCombo: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  prepTime: string;
  ingredients: string[];
  imageUrl: string;
  gallery: string[];
  availability: boolean;
  spicyLevel: number; // 0 to 3
  status: 'active' | 'inactive';
  order: number;
  seoKeywords?: string;
}

export interface OfferCombo {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  badge: string;
  imageUrl: string;
  includesItems: string[];
  status: 'active' | 'inactive';
}

export interface ScheduleItem {
  id: string;
  dayGroup: string; // e.g. "SÁBADOS", "DOMINGOS", "FERIADOS"
  hours: string; // e.g. "08:00 AM - 18:00 PM"
  status: 'ABIERTO' | 'CERRADO' | 'SOLO_PRESENCIAL';
  note: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  city: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  mediaType: 'image' | 'video';
  url: string;
  thumbnail: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  threads: string;
  youtube: string;
  whatsapp: string;
  email: string;
}

export interface SEOMetadata {
  pageTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ip: string;
  details: string;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  ip: string;
  status: 'success' | 'failed' | 'blocked';
}

export interface FullAppDatabase {
  settings: RestaurantSettings;
  categories: Category[];
  products: Product[];
  offers: OfferCombo[];
  schedules: ScheduleItem[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  faqs: FAQ[];
  socialLinks: SocialLinks[];
  seoMetadata: SEOMetadata[];
  auditLogs: AuditLog[];
  securityLogs: SecurityLog[];
  version: string;
  updatedAt: string;
}
