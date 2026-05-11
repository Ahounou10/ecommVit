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

  const price = product.promo_percent
    ? getDiscountedPrice(product.price, product.promo_percent)
    : product.price;

  return ` *Commande produit*
Bonjour, je souhaite commander ce produit :
 Produit : ${product.name}
 Taille : ${item.size || 'Non précisé'}
 Couleur : ${item.color || 'Non précisé'}
 Quantité : ${item.quantity}
 Prix : ${price} FCFA

 Image : ${product.image_url}

Merci `;
}

// Format pour le panier (plusieurs produits cohérent)
export function formatCartWhatsAppMessage(items: CartItem[]): string {
  const productsList = items
    .map((item, index) => {
      const product = item.product;
      const price = product.promo_percent
        ? getDiscountedPrice(product.price, product.promo_percent)
        : product.price;

      return `${index + 1}. ${product.name}
   • Taille : ${item.size || 'Non précisé'}
   • Couleur : ${item.color || 'Non précisé'}
   • Quantité : ${item.quantity}
   • Prix unitaire : ${price} FCFA
   • Sous-total : ${price * item.quantity} FCFA`;
    })
    .join('\n\n');

  const total = items.reduce((sum, item) => {
    const product = item.product;
    const price = product.promo_percent
      ? getDiscountedPrice(product.price, product.promo_percent)
      : product.price;
    return sum + price * item.quantity;
  }, 0);

  return ` *COMMANDE - PANIER*

Bonjour, je souhaite passer la commande suivante :

${productsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *TOTAL : ${total} FCFA*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Merci !`;
}

export function getWhatsAppLink(message: string) {
  const phone = '2250142078670';

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}