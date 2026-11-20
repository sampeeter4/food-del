import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = ({ onLogout }) => <div className='navbar'><img className='logo' src={assets.logo} alt='MealMate' /><div className='admin-navbar-actions'><span>Admin dashboard</span><img className='profile' src={assets.profile_image} alt='Admin profile' /><button type='button' onClick={onLogout}>Logout</button></div></div>
export default Navbar
