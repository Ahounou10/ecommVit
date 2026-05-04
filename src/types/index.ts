export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: 'homme' | 'femme' | 'mixte';
  subcategory: 'tshirts' | 'jeans' | 'robes' | 'chaussures';
  sizes: string[];
  colors: string[];
  stock: number;
  promo_percent: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selected_size: string;
  selected_color: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  address: string;
  city: string;
}
