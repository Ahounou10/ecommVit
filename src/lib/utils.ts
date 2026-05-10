import { type ClassValue, clsx } from 'clsx';
import type { Product } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountedPrice(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100));
}

export function formatWhatsAppMessage(
  product: Product,
  size: string,
  color: string
): string {
  const discountedPrice = getDiscountedPrice(
    product.price,
    product.promo_percent
  );

  return `
Bonjour, je veux commander :

🛍 Produit : ${product.name}
 Taille : ${size}
 Couleur : ${color}
 Prix : ${formatPrice(discountedPrice)}

 Image :
${product.image_url}

Merci.
`;
}

export function getWhatsAppLink(message: string) {
  const phone = '2250142078670';

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
