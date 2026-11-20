import React from 'react'
import { Link } from 'react-router-dom'
import './About.css'

function AboutIcon({ name, className = '' }) {
  const iconPaths = {
    utensils: <><path d="M4 3v7a3 3 0 0 0 6 0V3" /><path d="M7 3v18" /><path d="M16 3v7a3 3 0 0 0 3 3V3" /><path d="M19 13v8" /></>,
    layout: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M9 9h12" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    'shopping-bag': <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    'check-circle': <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 9" /></>,
    'arrow-up-right': <><path d="M7 17 17 7M7 7h10v10" /></>,
    sparkles: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /><path d="m5 3 .7 1.8L7.5 5.5l-1.8.7L5 8l-.7-1.8-1.8-.7 1.8-.7L5 3Z" /></>
  };
  return <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name] || iconPaths.sparkles}</svg>;
}

const values = [
  { number: '01', icon: 'utensils', label: 'OUR PROMISE', title: 'Food comes first', text: 'A menu should make it easy to discover dishes, understand what is available, and choose what you are craving.' },
  { number: '02', icon: 'layout', label: 'OUR APPROACH', title: 'Simple by design', text: 'We keep the experience clear, from exploring food categories to reviewing your cart and placing an order.' },
  { number: '03', icon: 'users', label: 'OUR COMMUNITY', title: 'Made for everyone', text: 'Whether you want a familiar favorite or something different, there is always something new to explore.' }
]

const steps = [
  { number: '01', icon: 'search', caption: 'FIND YOUR CRAVING', title: 'Explore', text: 'Browse the menu and discover dishes across different food categories.' },
  { number: '02', icon: 'shopping-bag', caption: 'MAKE IT YOURS', title: 'Choose', text: 'Open a dish, review its details, and add your picks to the cart.' },
  { number: '03', icon: 'check-circle', caption: 'READY WHEN YOU ARE', title: 'Enjoy', text: 'Review your order details and continue through the checkout experience.' }
]

export default function About() {
  return (
    <main className='about-page'>
      <section className='about-hero'>
        <div className='about-hero-copy'>
          <span className='about-kicker'><span></span> GET TO KNOW MEALMATE</span>
          <h1>Good food makes<br /><em>every moment</em><br />better.</h1>
          <p>MealMate brings your food discovery experience into one simple place. Explore the menu, find dishes you love, and make your next meal choice with ease.</p>
          <div className='about-hero-actions'>
            <Link to='/menu' className='about-button-primary'>Explore our menu <span aria-hidden='true'>→</span></Link>
            <Link to='/discover' className='about-button-secondary'>Discover restaurants</Link>
          </div>
          <div className='about-hero-note'><span>Thoughtful discovery</span><i></i><span>Easy choices</span><i></i><span>Good food moments</span></div>
        </div>
        <div className='about-hero-art'>
          <div className='about-hero-photo about-hero-photo-main'><img src='/menu-images/restaurants/restaurant_01.webp' alt='A delicious meal from MealMate' /></div>
          <div className='about-hero-photo about-hero-photo-small'><img src='/menu-images/restaurants/restaurant_05.webp' alt='Food selection from MealMate' /></div>
          <div className='about-hero-sticker'><span>♥</span><strong>Made for<br />food lovers</strong></div>
          <div className='about-hero-orbit'></div>
        </div>
      </section>

      <section className='about-story'>
        <div className='about-story-image'><img src='/menu-images/restaurants/restaurant_06.webp' alt='A meal ready to be enjoyed' /><span>GOOD FOOD, GOOD MOOD</span></div>
        <div className='about-story-copy'>
          <span className='about-section-kicker'>OUR STORY</span>
          <h2>A little more joy<br />in every food choice.</h2>
          <p>Choosing what to eat should feel exciting, not complicated. MealMate is designed to help you move from a craving to a choice with a clear menu, helpful dish details, and a straightforward cart experience.</p>
          <p>From everyday comfort food to something you have not tried before, our goal is to make food discovery feel welcoming, simple, and enjoyable.</p>
          <Link to='/discover' className='about-text-link'>Find something delicious <span aria-hidden='true'>→</span></Link>
        </div>
      </section>

      <section className='about-values-section'>
        <div className='about-section-heading'><span className='about-section-kicker'>WHAT MATTERS TO US</span><h2>Our approach is simple.</h2><p>A good food experience starts with the little things.</p></div>
        <div className='about-values-grid'>
          {values.map((value) => <article className='about-value-card' key={value.number}>
            <div className='about-value-top'><span className='about-value-number'>{value.number}</span><span className='about-value-label'>{value.label}</span></div>
            <div className='about-value-mark'><AboutIcon name={value.icon} /></div>
            <h3>{value.title}</h3><p>{value.text}</p>
            <span className='about-value-bottom'>MEALMATE <AboutIcon name='sparkles' /></span>
          </article>)}
        </div>
      </section>

      <section className='about-steps-section'>
        <div className='about-steps-heading'><span className='about-section-kicker'>HOW MEALMATE WORKS</span><h2>From craving to cart.</h2><p>Your next meal is only a few simple steps away.</p></div>
        <div className='about-steps-grid'>
          {steps.map((step) => <article className='about-step-card' key={step.number}>
            <div className='about-step-top'><span className='about-step-number'>STEP {step.number}</span><span className='about-step-arrow'><AboutIcon name='arrow-up-right' /></span></div>
            <div className='about-step-icon'><AboutIcon name={step.icon} /></div>
            <div className='about-step-copy'><span>{step.caption}</span><h3>{step.title}</h3><p>{step.text}</p></div>
          </article>)}
        </div>
      </section>

      <section className='about-cta'><div><span className='about-section-kicker'>YOUR NEXT FAVORITE AWAITS</span><h2>Ready to find your next favorite?</h2><p>Take a look around and see what is on the menu.</p></div><Link to='/menu' className='about-button-primary'>Browse the menu <span aria-hidden='true'>→</span></Link></section>
    </main>
  )
}
