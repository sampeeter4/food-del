import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {
  const [payment, setPayment] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState({ firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '' })
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext)
  const navigate = useNavigate()

  const onChangeHandler = (event) => setData((current) => ({ ...current, [event.target.name]: event.target.value }))

  const placeOrder = async (event) => {
    event.preventDefault()
    if (submitting) return
    const orderItems = food_list.filter((item) => (cartItems[item._id] || 0) > 0).map((item) => ({ ...item, quantity: cartItems[item._id] }))
    if (!orderItems.length) { toast.error('Your cart is empty'); navigate('/cart'); return }
    if (orderItems.some(item => String(item._id).startsWith('demo-'))) { toast.error('This is the sample catalog. Connect MongoDB and run npm run seed:catalog in the backend before placing real orders.'); navigate('/cart'); return }
    setSubmitting(true)
    try {
      const orderData = { address: data, items: orderItems }
      const endpoint = payment === 'stripe' ? '/api/order/place' : '/api/order/placecod'
      const response = await axios.post(`${url}${endpoint}`, orderData, { headers: { token } })
      if (!response.data.success) throw new Error(response.data.message || 'Unable to place your order')
      if (payment === 'stripe') {
        if (!response.data.session_url) throw new Error('Payment session was not created')
        window.location.assign(response.data.session_url)
      } else {
        setCartItems({})
        toast.success(response.data.message || 'Order placed successfully')
        navigate('/myorders')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to place your order')
    } finally { setSubmitting(false) }
  }

  useEffect(() => {
    if (!token) { toast.error('Please sign in before placing an order'); navigate('/cart') }
    else if (getTotalCartAmount() === 0) navigate('/cart')
  }, [token, getTotalCartAmount, navigate])

  return <form onSubmit={placeOrder} className='place-order'>
    <div className='place-order-left'>
      <p className='title'>Delivery Information</p>
      <div className='multi-field'><input type='text' name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' autoComplete='given-name' required/><input type='text' name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' autoComplete='family-name' required/></div>
      <input type='email' name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' autoComplete='email' required/>
      <input type='text' name='street' onChange={onChangeHandler} value={data.street} placeholder='Street address' autoComplete='street-address' required/>
      <div className='multi-field'><input type='text' name='city' onChange={onChangeHandler} value={data.city} placeholder='City' autoComplete='address-level2' required/><input type='text' name='state' onChange={onChangeHandler} value={data.state} placeholder='State' autoComplete='address-level1' required/></div>
      <div className='multi-field'><input type='text' name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Postal code' autoComplete='postal-code' required/><input type='text' name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' autoComplete='country-name' required/></div>
      <input type='tel' name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone number' autoComplete='tel' required/>
    </div>
    <div className='place-order-right'>
      <div className='cart-total'><h2>Cart Totals</h2><div><div className='cart-total-details'><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div><hr/><div className='cart-total-details'><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div><hr/><div className='cart-total-details'><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div></div></div>
      <div className='payment'><h2>Payment Method</h2><div role='button' tabIndex={0} onClick={() => setPayment('cod')} onKeyDown={(e) => e.key === 'Enter' && setPayment('cod')} className='payment-option'><img src={payment === 'cod' ? assets.checked : assets.un_checked} alt=''/><p>Cash on delivery</p></div><div role='button' tabIndex={0} onClick={() => setPayment('stripe')} onKeyDown={(e) => e.key === 'Enter' && setPayment('stripe')} className='payment-option'><img src={payment === 'stripe' ? assets.checked : assets.un_checked} alt=''/><p>Card payment (Stripe)</p></div></div>
      <button className='place-order-submit' type='submit' disabled={submitting}>{submitting ? 'Processing…' : payment === 'cod' ? 'Place Order' : 'Proceed to Payment'}</button>
    </div>
  </form>
}
export default PlaceOrder
