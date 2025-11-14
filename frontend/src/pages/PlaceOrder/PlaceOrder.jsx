import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import {useNavigate} from "react-router-dom"
import { StoreContext } from '../../context/ContextStore'
import axios from 'axios';

const PlaceOrder = () => {
  
  const navigate = useNavigate();
  const {getTotalCartAmount, token, cartItems, item_list, url} = useContext(StoreContext)

  const [data, setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:"",
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]:value}));
  }

  const placeOrder = async(event) => {
    event.preventDefault();
    let orderItems = [];
    item_list.map((item) => {
      if(cartItems[item._id]>0){
        let itemInfo = item;      // item ek object h.
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    // console.log(orderItems);
    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount()+2,
    }

    let response = await axios.post(url+"/api/order/place", orderData, {headers:{token}});
    // console.log(response);
    if(response.data.success){
      const {session_url} = response.data;
      window.location.replace(session_url);
    }
    else{
      alert("Error");
    }
  }

  useEffect(() => {
    if(!token){
      navigate("/cart");
    }
    else if(getTotalCartAmount() === 0){
      navigate("/cart");
    }
  },[token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-inputs">
          <input required onChange={onChangeHandler} name='firstName' value={data.firstName} type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={data.lastName} type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={data.street} type="text" placeholder='street' />
        <div className="multi-inputs">
          <input required onChange={onChangeHandler} name='city' value={data.city} type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-inputs">
          <input required onChange={onChangeHandler} name='zipcode' value={data.zipcode} type="text" placeholder='Zip code' />
          <input required onChange={onChangeHandler} name='country' value={data.country} type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
      <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
