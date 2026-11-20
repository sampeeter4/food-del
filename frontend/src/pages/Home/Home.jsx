import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { assets, menu_list } from "../../assets/assets";
import "./Home.css";
import { getFoodImageUrl } from "../../utils/foodImage";

const Home = () => {
  const { food_list, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const names = ["Mama Puz Kitchen", "Pizza Palace", "Burger Hub"];
  const picks = food_list.slice(0, 3);
  const restaurants = picks.length ? picks : menu_list.slice(0, 3);

  return (
    <main className="mm-home">
      <div className="mm-home-main">
        <section className="mm-hero">
          <div className="mm-hero-copy">
            <span className="mm-kicker">✦ FAST DELIVERY · BEST PRICES</span>
            <h1>Delicious Food,<br />Delivered <em>Fast.</em></h1>
            <p>Order from your favorite restaurants near you.</p>
            <div className="mm-location"><span>⌖</span><input placeholder="Enter your location" aria-label="Your location" /><Link to="/discover">Find Food →</Link></div>
            <div className="mm-proof"><b>★★★★★</b><small>Join 50,000+ happy customers · 4.8 rating</small></div>
          </div>
          <div className="mm-hero-art"><img src={assets.header_img} alt="Freshly prepared food" /><div className="mm-delivery-pill"><strong>25 min</strong><small>Delivery time</small></div><div className="mm-rating-pill">⭐ 4.7 <small>Avg. rating</small></div></div>
        </section>
        <section className="mm-categories">
          <div className="mm-section-heading"><h2>Explore Categories</h2><Link to="/menu">View all →</Link></div>
          <div className="mm-category-list">{menu_list.slice(0, 6).map(item => <button className="mm-category" key={item.menu_name} onClick={() => navigate("/category/" + encodeURIComponent(item.menu_name))}><img src={item.menu_image} alt="" /><strong>{item.menu_name}</strong></button>)}</div>
        </section>
        <section className="mm-app-banner">
          <div className="mm-phone-art"><div className="mm-phone"><span>MealMate</span><img src={menu_list[1].menu_image} alt="App preview" /></div></div>
          <div><span className="mm-kicker">✦ GET THE APP</span><h2>Download our<br /><em>mobile app</em></h2><p>Enjoy faster ordering, exclusive offers and real-time order updates.</p><div className="mm-store-links"><img src={assets.app_store} alt="App Store" /><img src={assets.play_store} alt="Google Play" /></div></div>
        </section>
      </div>
      <aside className="mm-sidebar">
        <section className="mm-popular"><div className="mm-section-heading"><h2>Popular Restaurants</h2><Link to="/discover">View all →</Link></div><div className="mm-restaurant-list">{restaurants.map((item, i) => <article className="mm-restaurant" key={item._id || item.menu_name}><div className="mm-restaurant-image"><img src={getFoodImageUrl(item.image || item.menu_image, item, url)} alt="Food" /><span>♡</span></div><strong>{item.name || names[i]}</strong><small>{item.category || "Local dishes"} · 25 min</small><div className="mm-restaurant-bottom"><b>⭐ 4.{7 - i}</b><Link to={item._id ? "/food/" + item._id : "/menu"}>Order Now</Link></div></article>)}</div></section>
        <section className="mm-offer"><span>SPECIAL OFFER</span><h2>Get 20% off<br />your first order</h2><Link to="/menu">Order Now →</Link></section>
        <section className="mm-testimonials"><div className="mm-section-heading"><h2>What Our Customers Say</h2><Link to="/contact">View all →</Link></div><div className="mm-quotes"><article><b>“</b><p>MealMate makes it so easy to enjoy my favorite meals delivered fresh and fast!</p><strong>Sarah K.</strong><small>★★★★★</small></article><article><b>“</b><p>Great variety of restaurants and the delivery is always on time.</p><strong>James R.</strong><small>★★★★★</small></article><article><b>“</b><p>The best food delivery experience. Fast, fresh and highly recommended!</p><strong>Priya T.</strong><small>★★★★★</small></article></div></section>
        <footer className="mm-sidebar-footer"><strong>🍴 MealMate</strong><span>Company　Support　For Restaurants</span><small>© 2026 MealMate. All rights reserved.</small></footer>
      </aside>
    </main>
  );
};
export default Home;
