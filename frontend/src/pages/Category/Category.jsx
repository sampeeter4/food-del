import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import './Category.css'
import { getFoodImageUrl } from '../../utils/foodImage'

const categoryCopy = {
  Salad: 'Fresh, colorful bowls made for a lighter and brighter meal.',
  Rolls: 'Flavor-packed rolls, wraps, and easy-to-enjoy bites.',
  Deserts: 'Sweet treats for a little moment of happiness.',
  Sandwich: 'Toasted, stacked, and satisfying sandwiches.',
  Cake: 'Soft, sweet slices for celebrations and everyday cravings.',
  'Pure Veg': 'Vegetarian favorites prepared with delicious ingredients.',
  Pasta: 'Comforting pasta dishes with rich and familiar flavors.',
  Noodles: 'Warm, savory noodle favorites for every appetite.'
}

const Category = () => {
  const { categoryName } = useParams()
  const { menu_list, food_list, url, currency } = useContext(StoreContext)
  const name = decodeURIComponent(categoryName || '')
  const menu = menu_list.find((item) => item.menu_name.toLowerCase() === name.toLowerCase())
  const items = food_list.filter((item) => item.category?.toLowerCase() === name.toLowerCase())

  return (
    <main className='category-page'>
      <Link className='category-back' to='/'>← Back to home</Link>
      <section className='category-hero'>
        {menu && <img src={menu.menu_image} alt={name + ' collection'} />}
        <div>
          <span className='category-eyebrow'>MEALMATE COLLECTION</span>
          <h1>{name}</h1>
          <p>{categoryCopy[name] || 'Explore delicious picks from this collection, selected for your next meal.'}</p>
          <strong>{items.length} {items.length === 1 ? 'dish' : 'dishes'} in this collection</strong>
        </div>
      </section>
      <section className='category-products'>
        <div className='category-section-heading'>
          <div><span className='category-eyebrow'>MADE TO BE ENJOYED</span><h2>Explore {name}</h2></div>
          <Link to='/'>Browse all categories</Link>
        </div>
        {items.length ? (
          <div className='category-product-grid'>
            {items.map((item) => (
              <Link to={'/food/' + item._id} className='category-product-card' key={item._id}>
                <img src={getFoodImageUrl(item.image, item, url)} alt={item.name} />
                <div className='category-product-info'>
                  <span>{item.category}</span><h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>{currency}{item.price}</strong>
                  <em>View dish details →</em>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='category-empty'>
            <h3>We are preparing this collection</h3>
            <p>There are no dishes available in this category right now. Please check back soon or explore another collection.</p>
            <Link to='/'>Explore all food</Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default Category
