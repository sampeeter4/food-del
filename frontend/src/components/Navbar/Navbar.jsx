import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const { cartItems, token, setToken } = useContext(StoreContext);
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = Object.values(cartItems || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const active = path => path === "/" ? location.pathname === "/" : location.pathname === path || (path === "/menu" && location.pathname.startsWith("/category"));
  const logout = () => { localStorage.removeItem("token"); setToken(""); navigate("/"); };
  return <header className="navbar-shell"><nav className="navbar">
    <Link to="/" className="brand-mark" aria-label="MealMate home"><span className="brand-icon">♨</span><span className="brand-copy"><strong>Meal<span>Mate</span></strong><small>Food Delivery</small></span></Link>
    <ul className="navbar-menu">
      <li><Link to="/" className={active("/") ? "active" : ""}>Home</Link></li>
      <li><Link to="/menu" className={active("/menu") ? "active" : ""}>Menu</Link></li>
      <li><Link to="/discover" className={active("/discover") ? "active" : ""}>Restaurants</Link></li>
      <li><Link to="/discover" className="">Offers</Link></li>
      <li><Link to="/about" className={active("/about") ? "active" : ""}>About Us</Link></li>
    </ul>
    <div className="navbar-right">
      <button className="nav-icon-button" aria-label="Search menu" onClick={() => navigate("/menu")}><img src={assets.search_icon} alt="" /></button>
      <Link to="/cart" className="navbar-search-icon nav-cart" aria-label="Shopping cart"><img src={assets.basket_icon} alt="" />{cartCount > 0 && <span className="nav-cart-count">{cartCount}</span>}</Link>
      {!token ? <button className="nav-signin" onClick={() => setShowLogin(true)}><span>♙</span> Sign In</button> : <div className="navbar-profile"><img src={assets.profile_icon} alt="Profile" /><ul className="navbar-profile-dropdown"><li onClick={() => navigate("/myorders")}><img src={assets.bag_icon} alt=""/><p>Orders</p></li><hr/><li onClick={logout}><img src={assets.logout_icon} alt=""/><p>Logout</p></li></ul></div>}
    </div>
  </nav></header>;
};
export default Navbar;
