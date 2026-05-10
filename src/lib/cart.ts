import type { Product } from '@/types';

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
};

const CART_KEY = 'cart';


// récupérer panier
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? (JSON.parse(data) as CartItem[]) : [];
}

// sauvegarder panier
export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ajouter produit
export function addToCart(item: CartItem) {
  const cart = getCart();

  const index = cart.findIndex(
    (c) =>
      c.product.id === item.product.id &&
      c.size === item.size &&
      c.color === item.color
  );

  if (index !== -1) {
    cart[index].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}

// vider panier
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}