import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { menu_list } from "../assets/assets";
import { menuCatalog } from "../data/menuCatalog";
import { toast } from "react-toastify";
export const StoreContext = createContext(null);
const isDatabaseId = id => /^[a-f\d]{24}$/i.test(String(id));
const StoreContextProvider = ({ children }) => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [food_list, setFoodList] = useState(menuCatalog);
  const [cartItems, setCartItems] = useState(() => { try { return JSON.parse(localStorage.getItem("mealmate-cart") || "{}"); } catch { return {}; } });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [foodLoading, setFoodLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const currency = "₹";
  const deliveryCharge = 50;
  useEffect(() => { localStorage.setItem("mealmate-cart", JSON.stringify(cartItems)); }, [cartItems]);
  const addToCart = async itemId => {
    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token && isDatabaseId(itemId)) {
      try { await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } }); }
      catch (error) { setCartItems(prev => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 1) - 1) })); toast.error(error.response?.data?.message || "Could not update your account cart"); throw error; }
    }
    toast.success("Added to your cart", { autoClose: 1200 });
  };
  const removeFromCart = async itemId => {
    setCartItems(prev => { const next = { ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }; if (!next[itemId]) delete next[itemId]; return next; });
    if (token && isDatabaseId(itemId)) { try { await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } }); } catch { toast.error("Cart sync failed. Please refresh after reconnecting."); } }
  };
  const clearCart = () => setCartItems({});
  const getTotalCartAmount = () => food_list.reduce((total, item) => total + (Number(item.price) || 0) * (cartItems[item._id] || 0), 0);
  const fetchFoodList = async () => {
    setFoodLoading(true);
    try {
      const response = await axios.get(`${url}/api/food/list`, { timeout: 7000 });
      if (!response.data.success) throw new Error(response.data.message || "Unable to load menu");
      const databaseFoods = response.data.data || [];
      const byName = new Map(databaseFoods.map(item => [item.name.trim().toLowerCase(), item]));
      const seededCatalog = menuCatalog.map(demo => byName.get(demo.name.toLowerCase()) || demo);
      const catalogNames = new Set(menuCatalog.map(item => item.name.toLowerCase()));
      setFoodList([...seededCatalog, ...databaseFoods.filter(item => !catalogNames.has(item.name.trim().toLowerCase()))]);
      setApiError("");
    } catch (error) {
      setFoodList(menuCatalog);
      setApiError("Showing the MealMate sample catalog. Connect MongoDB and seed the catalog to enable checkout.");
    } finally { setFoodLoading(false); }
  };
  const loadCartData = async authToken => {
    const value = typeof authToken === "string" ? authToken : authToken?.token;
    if (!value) return;
    try { const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token: value } }); if (response.data.success) setCartItems(prev => ({ ...prev, ...(response.data.cartData || {}) })); }
    catch (error) { if (error.response?.status === 401) { localStorage.removeItem("token"); setToken(""); } }
  };
  useEffect(() => { fetchFoodList(); if (token) loadCartData(token); }, []);
  const contextValue = { url, food_list, menu_list, cartItems, addToCart, removeFromCart, clearCart, getTotalCartAmount, token, setToken, loadCartData, setCartItems, currency, deliveryCharge, foodLoading, apiError, refreshFoodList: fetchFoodList };
  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};
export default StoreContextProvider;
