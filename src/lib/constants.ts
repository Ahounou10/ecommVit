export const CATEGORIES = {
  homme: 'Homme',
  femme: 'Femme',
  mixte: 'Mixte'
} as const;

export const SUBCATEGORIES = {
  tshirts: 'T-Shirts',
  jeans: 'Jeans',
  robes: 'Robes',
  chaussures: 'Chaussures'
} as const;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const COLORS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Blanc', value: '#FFFFFF' },
  { name: 'Beige', value: '#F5F5DC' },
  { name: 'Vert foncé', value: '#1B4D3E' },
  { name: 'Gris', value: '#808080' },
  { name: 'Bleu', value: '#0066CC' },
  { name: 'Rouge', value: '#DC143C' },
  { name: 'Marron', value: '#8B4513' }
] as const;

export const BRAND_NAME = 'Boutique Vêtements';
export const BRAND_PHONE = process.env.NEXT_PUBLIC_PHONE || '+225XXXXXXXXXX';
export const BRAND_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || '+225XXXXXXXXXX';
export const BRAND_INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM || '@boutique';
export const BRAND_FACEBOOK = process.env.NEXT_PUBLIC_FACEBOOK || 'boutique';
export const BRAND_ADDRESS = process.env.NEXT_PUBLIC_ADDRESS || '123 Rue de la Boutique';
export const BRAND_CITY = process.env.NEXT_PUBLIC_CITY || 'Abidjan';

export const CURRENCY = 'FCFA';
