import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Product, CartItem, CartContextType } from '../types/product';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // Cập nhật số lượng
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // Xóa sạch giỏ hàng
  const clearCart = () => {
    setItems([]);
  };

  // Các giá trị tính toán tự động
  const { totalCount, subtotal, discountTotal, totalPrice } = useMemo(() => {
    let count = 0;
    let sub = 0;
    let disc = 0;

    items.forEach((item) => {
      count += item.quantity;
      const originalPrice = item.product.price * item.quantity;
      sub += originalPrice;
      const discountAmount = originalPrice * ((item.product.discountPercentage || 0) / 100);
      disc += discountAmount;
    });

    const finalPrice = Math.max(0, sub - disc);

    return {
      totalCount: count,
      subtotal: Math.round(sub * 100) / 100,
      discountTotal: Math.round(disc * 100) / 100,
      totalPrice: Math.round(finalPrice * 100) / 100,
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        discountTotal,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được sử dụng bên trong CartProvider!');
  }
  return context;
};
