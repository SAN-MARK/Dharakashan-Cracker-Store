export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  isBestSeller: boolean;
  safetyRating: string; // e.g., "PESO Certified"
  brand: string; // e.g., "Standard", "Sivakasi Elite", "Sparkle Safe"
  soundLevel?: "Silent" | "Low" | "Medium" | "High";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Page = 'home' | 'about' | 'shop' | 'login' | 'contact';

export interface UserSession {
  email: string | null;
  name: string | null;
  role: 'OWNER' | 'FINDER' | 'CUSTOMER';
  isLoggedIn: boolean;
}
