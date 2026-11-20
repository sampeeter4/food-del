import React from 'react'
import { Link } from 'react-router-dom'
import './SitePages.css'

const highlights = [
  { number: '01', title: 'Everyday favorites', text: 'Find familiar meals and satisfying options for your everyday cravings.' },
  { number: '02', title: 'Something new', text: 'Explore different categories and discover a dish you have not tried before.' },
  { number: '03', title: 'A simpler order', text: 'Keep your favorites together, review your cart, and place your order in a few steps.' }
]

// Demo-only restaurant listings. Ratings, prices and delivery times are sample values.
const demoRestaurants = [
  { id: 1, name: 'Spice Route Kitchen', cuisine: 'Indian · Biryani · North Indian', rating: '4.8', time: '25–35 min', price: '₹250 for two', image: '/menu-images/restaurants/restaurant_01.webp', badge: 'Popular choice' },
  { id: 2, name: 'Malabar Dum House', cuisine: 'Malabar · Biryani · Kerala', rating: '4.7', time: '30–40 min', price: '₹280 for two', image: '/menu-images/restaurants/restaurant_02.webp', badge: 'Local favorite' },
  { id: 3, name: 'Burger Boulevard', cuisine: 'Burgers · Fast Food · American', rating: '4.6', time: '20–30 min', price: '₹200 for two', image: '/menu-images/restaurants/restaurant_03.webp', badge: 'Quick bites' },
  { id: 4, name: 'Wok & Roll', cuisine: 'Chinese · Noodles · Asian', rating: '4.5', time: '30–40 min', price: '₹300 for two', image: '/menu-images/restaurants/restaurant_04.webp', badge: 'Chef’s pick' },
  { id: 5, name: 'The Pizza Corner', cuisine: 'Pizza · Italian · Pasta', rating: '4.7', time: '25–40 min', price: '₹350 for two', image: '/menu-images/restaurants/restaurant_05.webp', badge: 'Best seller' },
  { id: 6, name: 'Kerala Kitchen', cuisine: 'Kerala · South Indian · Meals', rating: '4.8', time: '25–35 min', price: '₹180 for two', image: '/menu-images/restaurants/restaurant_06.webp', badge: 'Homestyle' },
  { id: 7, name: 'Sweet Treats Café', cuisine: 'Desserts · Bakery · Beverages', rating: '4.4', time: '15–25 min', price: '₹150 for two', image: '/menu-images/restaurants/restaurant_07.webp', badge: 'Something sweet' },
  { id: 8, name: 'Tandoori Tales', cuisine: 'Tandoori · Grill · North Indian', rating: '4.7', time: '30–40 min', price: '₹320 for two', image: '/menu-images/restaurants/restaurant_08.webp', badge: 'Grill specials' },
  { id: 9, name: 'Dosa Junction', cuisine: 'South Indian · Dosa · Idli', rating: '4.6', time: '15–25 min', price: '₹160 for two', image: '/menu-images/restaurants/restaurant_09.webp', badge: 'Breakfast favorite' },
  { id: 10, name: 'Coastal Catch', cuisine: 'Seafood · Fish · Kerala', rating: '4.8', time: '35–45 min', price: '₹380 for two', image: '/menu-images/restaurants/restaurant_10.webp', badge: 'Seafood special' },
  { id: 11, name: 'Wrap Station', cuisine: 'Wraps · Rolls · Fast Food', rating: '4.5', time: '20–30 min', price: '₹190 for two', image: '/menu-images/food_11.png', badge: 'On the go' },
  { id: 12, name: 'Paneer Palace', cuisine: 'Vegetarian · North Indian · Paneer', rating: '4.6', time: '25–35 min', price: '₹260 for two', image: '/menu-images/food_12.png', badge: 'Veg delights' },
  { id: 13, name: 'The Chaat Hub', cuisine: 'Street Food · Chaat · Snacks', rating: '4.5', time: '15–25 min', price: '₹140 for two', image: '/menu-images/food_13.png', badge: 'Street favorites' },
  { id: 14, name: 'Grill & Sizzle', cuisine: 'Grill · Kebabs · Continental', rating: '4.7', time: '30–40 min', price: '₹340 for two', image: '/menu-images/food_14.png', badge: 'Flame grilled' },
  { id: 15, name: 'Juice Garden', cuisine: 'Juices · Shakes · Beverages', rating: '4.4', time: '10–20 min', price: '₹130 for two', image: '/menu-images/food_15.png', badge: 'Fresh & cool' }
]

export default function Discover() {
  return <main className='site-page'>
    <section className='discover-hero'>
      <div className='discover-hero-content'>
        <span className='discover-hero-kicker'><span className='discover-hero-kicker-dot'></span> GOOD FOOD, GOOD MOOD</span>
        <h1>Discover food<br /><span>you’ll love.</span></h1>
        <p>Find your next favorite meal from handpicked restaurants and delicious local flavors.</p>
        <div className='discover-hero-actions'>
          <a className='discover-hero-primary' href='#restaurants-heading'>Explore restaurants <span aria-hidden='true'>→</span></a>
          <Link className='discover-hero-secondary' to='/menu'>Browse menu</Link>
        </div>
        <div className='discover-hero-trust'><span>Fresh flavors</span><i></i><span>Great choices</span><i></i><span>Made for you</span></div>
      </div>
      <div className='discover-hero-visual'>
        <div className='discover-hero-image-wrap'><img src='/menu-images/restaurants/restaurant_01.webp' alt='A delicious meal from MealMate' /></div>
        <div className='discover-hero-image-accent'></div>
        <div className='discover-hero-floating-card'><span className='discover-hero-floating-icon'>★</span><div><strong>Delicious choices</strong><small>Your next favorite is waiting</small></div></div>
        <span className='discover-hero-side-label'>MADE WITH FLAVOR</span>
      </div>
    </section>

    <section className='demo-restaurants-section' aria-labelledby='restaurants-heading'>
      <div className='demo-restaurants-heading'>
        <div>
          <span className='site-eyebrow'>FIND YOUR NEXT FAVORITE</span>
          <h2 id='restaurants-heading'>Popular restaurants near you</h2>

        </div>

      </div>

      <div className='demo-restaurants-grid'>
        {demoRestaurants.map((restaurant) => (
          <article className='demo-restaurant-card' key={restaurant.id}>
            <div className='demo-restaurant-image'>
              <img src={restaurant.image} alt={`${restaurant.name} food`} loading='lazy' />
              <span className='demo-restaurant-badge'>{restaurant.badge}</span>
              <span className='demo-rating'>★ {restaurant.rating}</span>
            </div>
            <div className='demo-restaurant-info'>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.cuisine}</p>
              <div className='demo-restaurant-meta'>
                <span>◷ {restaurant.time}</span>
                <span>{restaurant.price}</span>
              </div>
              <Link to='/menu' className='demo-restaurant-link'>View menu <span aria-hidden='true'>→</span></Link>
            </div>
          </article>
        ))}
      </div>
      <p className='demo-data-note'>Demo content only: restaurant names, ratings, prices and delivery times are illustrative and are not live restaurant listings.</p>
    </section>

    <section className='site-feature-grid'>
      {highlights.map((item) => (
        <article className='site-feature-card' key={item.number}>
          <span>{item.number}</span><h2>{item.title}</h2><p>{item.text}</p>
        </article>
      ))}
    </section>

    <section className='site-callout'>
      <div><span className='site-eyebrow'>YOUR NEXT FAVORITE AWAITS</span><h2>What are you in the mood for?</h2><p>Browse our eight food collections and find something delicious.</p></div>
      <Link className='site-primary-button' to='/menu'>Browse categories</Link>
    </section>
  </main>
}
