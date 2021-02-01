import { useState, useContext, createContext, useEffect } from 'react';
import { initiateCheckout } from '../lib/payments.js'
import products from '../products.json';

const localStorageKey = 'spacejelly_cart';

const defaultCart = {
  products: {}
}

export const CartContext = createContext();

export function useCartState() {

  const [cart, updateCart] = useState(defaultCart);

  useEffect(() => {
    const localStorageItems = window.localStorage.getItem(localStorageKey);
    const data = localStorageItems && JSON.parse(localStorageItems);
    if(data) {
      updateCart(data);
    }
  }, []);

  useEffect(()=> {
    const data = JSON.stringify(cart);
    window.localStorage.setItem(localStorageKey, data);
  }, [cart])

  const cartItems = Object.keys(cart.products).map(key => {
    const product = products.find(({ id }) => `${id}` === `${key}`);
    return {
      ...cart.products[key],
      pricePerUnit: product.price
    }
  });

  const subtotal = cartItems.reduce((accumulator, { pricePerUnit, quantity }) => {
    return accumulator + ( pricePerUnit * quantity );
  }, 0);

  const quantity = cartItems.reduce((accumulator, { quantity }) => {
    return accumulator + quantity;
  }, 0);

  function addToCart({ id }) {
    updateCart((prev) => {
      let cart = {...prev};

      if ( cart.products[id] ) {
        cart.products[id].quantity = cart.products[id].quantity + 1;
      } else {
        cart.products[id] = {
          id,
          quantity: 1
        }
      }

      return cart;
    })
  }

  const checkout = () => {
    return initiateCheckout({
      lineItems: cartItems.map(({ id, quantity }) => {
        return {
          price: id,
          quantity
        }
      })
    }).finally(() => {
      window.localStorage.removeItem(localStorageKey);
    })
  }

  return {
    cart,
    subtotal,
    quantity,
    addToCart,
    checkout
  }

}
export function useCart() {
  const cart = useContext(CartContext);
  return cart;
}