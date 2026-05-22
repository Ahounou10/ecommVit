import type { Product } from '@/types';
import { dispatchCartUpdate } from '@/hooks/useCartSync';

export type CartItem = {
  cartItemId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
};

const CART_KEY = 'cart';

// notifier React que le panier a changé
function notifyCartUpdate() {
  window.dispatchEvent(new Event('cartUpdated'));
}

// générer ID unique
function generateCartItemId(): string {
  return crypto.randomUUID();
}

// récupérer panier
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(CART_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) => ({
      ...item,
      cartItemId:
        item.cartItemId || crypto.randomUUID(),
    }));
  } catch (error) {
    console.error('Cart parse error:', error);
    return [];
  }
}

// sauvegarder panier
export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

  dispatchCartUpdate();
}

// ajouter produit
export function addToCart(
  product: Product,
  quantity: number,
  size?: string,
  color?: string
): void {
  const cart = getCart();

  const newItem: CartItem = {
    cartItemId: generateCartItemId(),
    product,
    quantity,
    size,
    color,
  };

  cart.push(newItem);

  saveCart(cart);
}

// modifier item précis
export function updateCartItemById(
  cartItemId: string,
  product: Product,
  quantity?: number,
  size?: string,
  color?: string
): void {
  const cart = getCart();

  const updated = cart.map((item) => {
    if (item.cartItemId !== cartItemId) {
      return item;
    }

    return {
      ...item,
      product,
      quantity:
        quantity !== undefined
          ? quantity
          : item.quantity,
      size: size ?? item.size,
      color: color ?? item.color,
    };
  });

  saveCart(updated);
}

// supprimer item
export function removeCartItemById(
  cartItemId: string
): void {
  const cart = getCart();

  const updated = cart.filter(
    (item) => item.cartItemId !== cartItemId
  );

  saveCart(updated);
}

// récupérer item précis
export function getCartItemById(
  cartItemId: string
): CartItem | undefined {
  const cart = getCart();

  return cart.find(
    (item) => item.cartItemId === cartItemId
  );
}

// vider panier
export function clearCart(): void {
  localStorage.removeItem(CART_KEY);

  dispatchCartUpdate();
}