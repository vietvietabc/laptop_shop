import { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], total: 0, count: 0 });
      return;
    }
    try {
      const response = await cartApi.get();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId) => {
    try {
      await cartApi.add(productId);
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      if (action === 'increase') {
        await cartApi.increase(productId);
      } else {
        await cartApi.decrease(productId);
      }
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const removeItem = async (cartDetailId) => {
    try {
      await cartApi.remove(cartDetailId);
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      setCart({ items: [], total: 0, count: 0 });
    } catch (error) {
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateQuantity, 
      removeItem, 
      clearCart,
      fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};