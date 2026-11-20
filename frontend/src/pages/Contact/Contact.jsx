import React from 'react'
import { Link } from 'react-router-dom'
import './SitePages.css'

export default function Contact() {
  return <main className='site-page'><section className='site-hero'><span className='site-eyebrow'>WE ARE HERE TO HELP</span><h1>Let's make your MealMate experience better.</h1><p>Have a question about browsing the menu or placing an order? Start with the information below.</p></section><section className='contact-grid'><article className='contact-card'><span className='contact-icon'>01</span><h2>Order questions</h2><p>Review your cart and order details before checkout. If you are signed in, you can also visit your orders page.</p><Link to='/myorders'>View my orders →</Link></article><article className='contact-card'><span className='contact-icon'>02</span><h2>Food and menu</h2><p>Explore each category to see the dishes currently listed, along with their descriptions and prices.</p><Link to='/menu'>Browse the menu →</Link></article><article className='contact-card'><span className='contact-icon'>03</span><h2>Contact information</h2><p>Official customer support email and phone details have not yet been configured for this website.</p><span className='site-note'>Support contact details coming soon.</span></article></section></main>
}
