import { useEffect, useCallback } from 'react';

// Événement custom pour synchroniser le panier entre les pages
const CART_UPDATE_EVENT = 'cart-updated';

export function useCartSync(onCartUpdate: () => void) {
  useEffect(() => {
    // Écouter l'événement custom de mise à jour du panier
    const handleCartUpdate = () => {
      onCartUpdate();
    };

    window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate);

    // Aussi vérifier au focus (quand on revient à l'onglet)
    const handleFocus = () => {
      onCartUpdate();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate);
      window.removeEventListener('focus', handleFocus);
    };
  }, [onCartUpdate]);
}

export function dispatchCartUpdate() {
  // Déclencher l'événement custom pour notifier tous les listeners
  window.dispatchEvent(new Event(CART_UPDATE_EVENT));
}
