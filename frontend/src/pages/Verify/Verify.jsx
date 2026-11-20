import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext';
import './Verify.css'

const Verify = () => {
  const { url, token } = useContext(StoreContext)
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState('Verifying your payment…')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('orderId')
        const sessionId = searchParams.get('session_id')
        const cancelled = searchParams.get('cancelled') === 'true'
        if (!token || !orderId) throw new Error('Please sign in to view your order.')
        const response = await axios.post(`${url}/api/order/verify`, { orderId, sessionId, cancelled: String(cancelled) }, { headers: { token } })
        if (!active) return
        if (response.data.success) { setMessage('Payment successful! Redirecting to your orders…'); setTimeout(() => navigate('/myorders'), 1200) }
        else { setMessage(response.data.message || 'Payment was not completed.'); setTimeout(() => navigate('/myorders'), 2200) }
      } catch (error) {
        if (!active) return
        setMessage(error.response?.data?.message || error.message || 'Unable to verify payment.')
        setTimeout(() => navigate('/myorders'), 2500)
      }
    }
    verifyPayment()
    return () => { active = false }
  }, [url, token, searchParams, navigate])

  return <div className='verify'><div className="spinner"></div><p>{message}</p></div>
}
export default Verify
