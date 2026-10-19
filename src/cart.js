const PROMO_CODE = 'SAVE10';
const PROMO_DISCOUNT_PERCENT = 10;
const PROMO_MIN_SUBTOTAL = 20000;
const DELIVERY_PRICE = 30000;
const FREE_DELIVERY_MIN_SUBTOTAL = 50000;

function assertValidQuantity(quantity, stock) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new RangeError('Количество должно быть положительным целым числом.');
  }
  if (quantity > stock) {
    throw new RangeError(`На складе только ${stock} шт.`);
  }
}

function addToCart(cart, product, quantity) {
  const existingItem = cart.find((item) => item.id === product.id);
  const nextQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

  assertValidQuantity(quantity, product.stock);
  assertValidQuantity(nextQuantity, product.stock);

  if (!existingItem) return [...cart, { ...product, quantity }];
  return cart.map((item) => (item.id === product.id ? { ...item, quantity: nextQuantity } : item));
}

function changeQuantity(cart, productId, quantity) {
  const targetItem = cart.find((item) => item.id === productId);
  if (!targetItem) return [...cart];

  assertValidQuantity(quantity, targetItem.stock);

  return cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);
  const isPromoApplied = promoCode === PROMO_CODE && subtotal >= PROMO_MIN_SUBTOTAL;
  const discount = isPromoApplied ? Math.round((subtotal * PROMO_DISCOUNT_PERCENT) / 100) : 0;
  const delivery = subtotal < FREE_DELIVERY_MIN_SUBTOTAL ? DELIVERY_PRICE : 0;

  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
