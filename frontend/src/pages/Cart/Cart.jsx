import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import "./Cart.css";
import { getFoodImageUrl } from "../../utils/foodImage";
const Cart = () => {
  const { cartItems, food_list, addToCart, removeFromCart, clearCart, getTotalCartAmount, url, currency, deliveryCharge } = useContext(StoreContext);
  const navigate = useNavigate();
  const items = food_list.filter(item => (cartItems[item._id] || 0) > 0);
  const total = getTotalCartAmount();
  const image = (value, item) => getFoodImageUrl(value, item, url);
  return <main className="mealmate-cart-page"><div className="mealmate-cart-heading"><span>YOUR ORDER</span><h1>Shopping Cart</h1><p>Review your delicious picks before checkout.</p></div>{items.length ? <><div className="mealmate-cart-table"><div className="mealmate-cart-head"><span>Item</span><span>Price</span><span>Quantity</span><span>Total</span><span></span></div>{items.map(item=><article className="mealmate-cart-row" key={item._id}><div className="mealmate-cart-product"><img src={image(item.image,item)} alt={item.name}/><div><strong>{item.name}</strong><small>{item.category}</small></div></div><strong>{currency}{item.price}</strong><div className="mealmate-cart-qty"><button onClick={()=>removeFromCart(item._id)} aria-label="Decrease quantity">−</button><span>{cartItems[item._id]}</span><button onClick={()=>addToCart(item._id)} aria-label="Increase quantity">+</button></div><strong>{currency}{item.price*cartItems[item._id]}</strong><button className="mealmate-cart-remove" onClick={()=>{for(let i=0;i<cartItems[item._id];i++) removeFromCart(item._id)}} aria-label={`Remove ${item.name}`}>×</button></article>)}</div><div className="mealmate-cart-summary"><button className="mealmate-clear-cart" onClick={()=>{clearCart();toast.info("Cart cleared")}}>Clear cart</button><section><h2>Cart Totals</h2><div><span>Subtotal</span><strong>{currency}{total.toFixed(2)}</strong></div><div><span>Delivery fee</span><strong>{currency}{deliveryCharge.toFixed(2)}</strong></div><div className="mealmate-cart-grand"><span>Total</span><strong>{currency}{(total+deliveryCharge).toFixed(2)}</strong></div><button onClick={()=>navigate("/order")}>Proceed to Checkout →</button><small>Secure checkout · Freshly prepared food</small></section></div></> : <div className="mealmate-empty-cart"><span>🛒</span><h2>Your cart is empty</h2><p>Looks like you haven't added anything delicious yet.</p><button onClick={()=>navigate("/menu")}>Explore the menu</button></div>}</main>;
};
export default Cart;
