import React from 'react'
import './Header.css'

const Header = () => {
    return (
        <div className='header'>
            <div className='header-contents'>
                <span className='header-kicker'>A fresh take on everyday meals</span>
                <h2>Make room for something delicious.</h2>
                <p>Discover satisfying meals, explore new flavors, and bring your favorites together in one easy ordering experience.</p>
                <button onClick={() => document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' })}>Explore the menu</button>
            </div>
        </div>
    )
}

export default Header
