import React from 'react'
import { Link } from 'react-router-dom'
import './SitePages.css'

export default function MobileApp() {
  return <main className='site-page'><section className='site-hero'><span className='site-eyebrow'>MEALMATE ON THE GO</span><h1>A convenient experience on every screen.</h1><p>Browse MealMate from your phone, explore food categories, add dishes to your cart, and review your order wherever you are.</p><Link className='site-primary-button' to='/menu'>Explore on mobile</Link></section><section className='mobile-feature-layout'><div className='mobile-visual'><div className='mobile-phone'><div className='mobile-phone-camera'></div><span>MealMate</span><strong>Good food<br/>starts here.</strong><div className='mobile-phone-pill'>Explore menu&nbsp; →</div></div></div><div className='mobile-copy'><span className='site-eyebrow'>MADE FOR EVERYDAY USE</span><h2>All the essentials, in one place.</h2><ul><li>Browse food categories and dishes</li><li>View descriptions and prices</li><li>Add items to your cart</li><li>Review your order before checkout</li></ul><p className='site-note'>A separate iOS or Android app is not being advertised here. You can use the MealMate website in your mobile browser.</p></div></section></main>
}
