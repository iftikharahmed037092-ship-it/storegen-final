"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import type {
  Product
} from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];

  addToCart: (
    product: Product
  ) => void;

  removeFromCart: (
    productId: string
  ) => void;

  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  totalItems: number;
  totalPrice: number;
}

const CartContext =
  createContext<
    CartContextValue | undefined
  >(undefined);

function storageKey(
  storeId: string
) {
  return `store-cart-${storeId}`;
}

export function CartProvider({
  storeId,
  children
}: {
  storeId: string;
  children: React.ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          storageKey(storeId)
        );

      if (saved) {
        setItems(
          JSON.parse(saved)
        );
      }
    } catch {
      setItems([]);
    }
  }, [storeId]);

  useEffect(() => {
    localStorage.setItem(
      storageKey(storeId),
      JSON.stringify(items)
    );
  }, [items, storeId]);

  function addToCart(
    product: Product
  ) {
    setItems(current => {
      const existing =
        current.find(
          item =>
            item.product.id ===
            product.id
        );

      if (existing) {
        return current.map(
          item =>
            item.product.id ===
            product.id
              ? {
                  ...item,
                  quantity:
                    Math.min(
                      item.quantity + 1,
                      product.stock
                    )
                }
              : item
        );
      }

      return [
        ...current,
        {
          product,
          quantity: 1
        }
      ];
    });
  }

  function removeFromCart(
    productId: string
  ) {
    setItems(current =>
      current.filter(
        item =>
          item.product.id !==
          productId
      )
    );
  }

  function updateQuantity(
    productId: string,
    quantity: number
  ) {
    setItems(current =>
      current
        .map(item => {
          if (
            item.product.id !==
            productId
          ) {
            return item;
          }

          const safeQuantity =
            Math.max(
              1,
              Math.min(
                quantity,
                item.product.stock
              )
            );

          return {
            ...item,
            quantity:
              safeQuantity
          };
        })
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems =
    items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const totalPrice =
    items.reduce(
      (sum, item) =>
        sum +
        item.product.price *
          item.quantity,
      0
    );

  const value =
    useMemo(
      () => ({
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
      }),
      [
        items,
        totalItems,
        totalPrice
      ]
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
