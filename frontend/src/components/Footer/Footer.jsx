import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <div className='footer-brand'>Meal<span>Mate</span></div>
            <p>Good meals make everyday moments better. Explore the menu, find your favorites, and enjoy a simpler way to order.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li><Link to='/about'>About us</Link></li>
                <li><Link to='/discover'>Discover</Link></li>
                <li><Link to='/menu'>Our menu</Link></li>
                <li><Link to='/mobile-app'>Mobile app</Link></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>Customer support</li>
                <li>Contact details will be added here.</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">&copy; {new Date().getFullYear()} MealMate. Built for good food moments.</p>
    </div>
  )
}

export default Footer
