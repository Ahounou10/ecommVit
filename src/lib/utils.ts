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

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
};

// ✅ VERSION SÉCURISÉE (SANS any)
export function formatWhatsAppMessage(item: CartItem): string {
  const product = item.product;

  const price = product.promo_percent
    ? getDiscountedPrice(product.price, product.promo_percent)
    : product.price;

  return ` *Commande produit*

 Produit : ${product.name}
 Taille : ${item.size || 'Non précisé'}
 Couleur : ${item.color || 'Non précisé'}
 Quantité : ${item.quantity}
 Prix : ${price} FCFA

 Image : ${product.image_url}

Merci `;
}

export function getWhatsAppLink(message: string) {
  const phone = '2250142078670';

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}