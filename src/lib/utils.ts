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

// Format pour un seul produit (commande directe)
export function formatWhatsAppMessage(item: CartItem): string {
  const product = item.product;
  const productImage = product.images?.[0] || product.image_url;

  return ` *Commande produit*
Bonjour, je souhaite commander ce produit :
 Nom : ${product.name}
 Taille : ${item.size || 'Non précisé'}
 Couleur : ${item.color || 'Non précisé'}
 Quantité : ${item.quantity}
 
 Image : ${productImage}

Merci `;
}

// Format clair pour une commande contenant plusieurs produits
export function formatCartWhatsAppMessage(items: CartItem[]): string {
  const productsList = items
    .map((item, index) => {
      const product = item.product;
      const productImage = product.images?.[0] || product.image_url;

      return `🛍️ *Article ${index + 1} — ${product.name}*
Taille : ${item.size || 'Non précisée'}
Couleur : ${item.color || 'Non précisée'}
Quantité : ${item.quantity}

📷 *Photo du produit :*
${productImage || 'Photo non disponible'}`;
    })
    .join('\n\n━━━━━━━━━━━━━━\n\n');

  return `🛒 *COMMANDE — PANIER*

Bonjour, je souhaite passer la commande suivante :

${productsList}

Merci pour votre attention !`;
}

export function getWhatsAppLink(message: string) {
  const phone = '2250142078670';

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}