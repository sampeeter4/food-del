import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { food_list as fallbackFoods } from "../../assets/assets";
import "./FoodDetails.css";
import { getFoodImageUrl } from "../../utils/foodImage";
const FoodDetails = () => {
  const { foodId } = useParams(); const { food_list, url, currency, addToCart, cartItems } = useContext(StoreContext);
  const [quantity,setQuantity]=useState(1); const [instructions,setInstructions]=useState("");
  const food=food_list.find(item=>String(item._id)===String(foodId));
  if(!food)return <main className="food-details-empty"><h2>Dish not found</h2><p>This dish may have been removed or is unavailable.</p><Link to="/menu">Return to menu</Link></main>;
  const image = getFoodImageUrl(food.image, food, url);
  const add=async()=>{for(let i=0;i<quantity;i++)await addToCart(food._id)};
  return <main className="food-details-page"><Link className="food-details-back" to="/menu">← Back to menu</Link><section className="food-details-card"><img className="food-details-image" src={image} alt={food.name} onError={e=>{e.currentTarget.src=fallbackFoods[0].image}}/><div className="food-details-content"><span className="food-details-tag">{food.category} · {food.isVeg?"Vegetarian":"Chef's special"}</span><h1>{food.name}</h1><div className="food-details-rating">★ {Number(food.rating||4.5).toFixed(1)} <small>({food.ratingCount||120} customer ratings)</small></div><p className="food-details-description">{food.description}</p><div className="food-details-ingredients"><strong>Ingredients</strong><p>{(food.ingredients || []).join(", ") || "Please ask the restaurant for ingredient details."}</p></div><div className="food-details-facts"><span>⏱ {food.preparationMinutes||20} min preparation</span><span>{food.isVeg?"🟢 Veg":"🔴 Non-Veg"}</span><span>Freshly prepared</span></div><h2 className="food-details-price">{currency}{food.price}</h2><label className="food-details-instructions">Special instructions<textarea value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Add preferences or allergy notes (optional)"/></label><div className="food-details-actions"><div className="food-details-quantity"><button onClick={()=>setQuantity(q=>Math.max(1,q-1))}>−</button><strong>{quantity}</strong><button onClick={()=>setQuantity(q=>q+1)}>+</button></div><button className="food-details-add" onClick={add}>Add to Cart · {currency}{food.price*quantity}</button></div>{cartItems[food._id]>0&&<p className="food-details-in-cart">{cartItems[food._id]} currently in your cart</p>}</div></section></main>;
};
export default FoodDetails;
