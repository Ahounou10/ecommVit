import type { Product } from '@/types';

export type CartItem = {
  cartItemId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
};

export type CartActionResult = {
  success: boolean;
  message: string;
};

const CART_KEY = 'cart';
export const CART_UPDATE_EVENT = 'cartUpdated';

function notifyCartUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
  }
}

function generateCartItemId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeCartItem(value: unknown): CartItem | null {
  if (!value || typeof value !== 'object') return null;

  const item = value as Partial<CartItem>;
  const product = item.product;

  if (!product || typeof product !== 'object' || !product.id) return null;

  const quantity = Number(item.quantity);
  if (!Number.isFinite(quantity) || quantity < 1) return null;

  return {
    cartItemId:
      typeof item.cartItemId === 'string' && item.cartItemId
        ? item.cartItemId
        : generateCartItemId(),
    product: product as Product,
    quantity: Math.floor(quantity),
    size: typeof item.size === 'string' ? item.size : undefined,
    color: typeof item.color === 'string' ? item.color : undefined,
  };
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .map(normalizeCartItem)
      .filter((item): item is CartItem => item !== null);

    // Migre les anciens articles et nettoie les entrées invalides.
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      window.localStorage.setItem(CART_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch (error) {
    console.error('Impossible de lire le panier :', error);
    return [];
  }
}

export function saveCart(cart: CartItem[]): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    notifyCartUpdate();
    return true;
  } catch (error) {
    console.error('Impossible d’enregistrer le panier :', error);
    return false;
  }
}

export function addToCart(
  product: Product,
  quantity = 1,
  size?: string,
  color?: string
): CartActionResult {
  if (!product || !product.id) {
    return { success: false, message: 'Ce produit est invalide.' };
  }

  const requestedQuantity = Math.floor(Number(quantity));
  if (!Number.isFinite(requestedQuantity) || requestedQuantity < 1) {
    return { success: false, message: 'La quantité demandée est invalide.' };
  }

  const availableStock = Math.max(0, Number(product.stock) || 0);
  if (availableStock === 0) {
    return { success: false, message: 'Ce produit est en rupture de stock.' };
  }

  const cart = getCart();
  const existingIndex = cart.findIndex(
    (item) =>
      item.product.id === product.id &&
      item.size === size &&
      item.color === color
  );

  if (existingIndex >= 0) {
    const existing = cart[existingIndex];
    const nextQuantity = Math.min(
      existing.quantity + requestedQuantity,
      availableStock
    );

    if (nextQuantity === existing.quantity) {
      return { success: false, message: 'La quantité maximale disponible est déjà dans le panier.' };
    }

    cart[existingIndex] = { ...existing, product, quantity: nextQuantity };
    if (!saveCart(cart)) {
      return { success: false, message: 'Impossible d’enregistrer le panier sur cet appareil.' };
    }

    return {
      success: true,
      message: nextQuantity < existing.quantity + requestedQuantity
        ? 'La quantité a été limitée au stock disponible.'
        : 'Quantité mise à jour dans le panier.',
    };
  }

  const finalQuantity = Math.min(requestedQuantity, availableStock);
  cart.push({
    cartItemId: generateCartItemId(),
    product,
    quantity: finalQuantity,
    size,
    color,
  });
  if (!saveCart(cart)) {
    return { success: false, message: 'Impossible d’enregistrer le panier sur cet appareil.' };
  }

  return {
    success: true,
    message: finalQuantity < requestedQuantity
      ? 'La quantité a été limitée au stock disponible.'
      : 'Produit ajouté au panier.',
  };
}

export function updateCartItemById(
  cartItemId: string,
  product: Product,
  quantity?: number,
  size?: string,
  color?: string
): boolean {
  const cart = getCart();
  const index = cart.findIndex((item) => item.cartItemId === cartItemId);

  if (index === -1) return false;

  const currentItem = cart[index];
  const nextQuantity = quantity === undefined
    ? currentItem.quantity
    : Math.floor(Number(quantity));

  if (!Number.isFinite(nextQuantity) || nextQuantity < 1) return false;
  if (nextQuantity > Math.max(0, Number(product.stock) || 0)) return false;

  cart[index] = {
    ...currentItem,
    product,
    quantity: nextQuantity,
    size: size ?? currentItem.size,
    color: color ?? currentItem.color,
  };

  return saveCart(cart);
}

export function updateCartQuantity(
  cartItemId: string,
  quantity: number
): CartActionResult {
  const cart = getCart();
  const index = cart.findIndex((item) => item.cartItemId === cartItemId);

  if (index === -1) {
    return { success: false, message: 'Cet article n’existe plus dans le panier.' };
  }

  const nextQuantity = Math.floor(Number(quantity));
  const stock = Math.max(0, Number(cart[index].product.stock) || 0);

  if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
    return { success: false, message: 'La quantité doit être au minimum de 1.' };
  }

  if (nextQuantity > stock) {
    return { success: false, message: 'La quantité demandée dépasse le stock disponible.' };
  }

  cart[index] = { ...cart[index], quantity: nextQuantity };
  if (!saveCart(cart)) {
    return { success: false, message: 'Impossible d’enregistrer le panier sur cet appareil.' };
  }

  return { success: true, message: 'Quantité mise à jour.' };
}

export function removeCartItemById(cartItemId: string): boolean {
  const cart = getCart().filter((item) => item.cartItemId !== cartItemId);
  return saveCart(cart);
}

export function getCartItemById(cartItemId: string): CartItem | undefined {
  return getCart().find((item) => item.cartItemId === cartItemId);
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(CART_KEY);
    notifyCartUpdate();
  } catch (error) {
    console.error('Impossible de vider le panier :', error);
  }
}
