import { useEffect } from 'react';
import { CART_UPDATE_EVENT } from '@/lib/cart';

export function useCartSync(onCartUpdate: () => void) {
  useEffect(() => {
    const handleCartUpdate = () => onCartUpdate();

    window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate);
    window.addEventListener('focus', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate);
      window.removeEventListener('focus', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, [onCartUpdate]);
}
