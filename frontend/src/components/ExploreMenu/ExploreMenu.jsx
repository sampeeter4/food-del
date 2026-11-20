import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const ExploreMenu = ({ category, setCategory }) => {
  const { menu_list } = useContext(StoreContext)
  const navigate = useNavigate()

  const openCategory = (name) => {
    setCategory(name)
    navigate('/category/' + encodeURIComponent(name))
  }

  return (
    <section className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Find something you'll love. Choose a collection to see its dishes, ingredients, and prices.</p>
      <div className='explore-menu-list'>
        {menu_list.map((item) => (
          <button type='button' onClick={() => openCategory(item.menu_name)} key={item.menu_name} className='explore-menu-list-item'>
            <img src={item.menu_image} className={category === item.menu_name ? 'active' : ''} alt={item.menu_name + ' dishes'} />
            <p>{item.menu_name}</p>
            <span>View collection</span>
          </button>
        ))}
      </div>
      <hr />
    </section>
  )
}

export default ExploreMenu
