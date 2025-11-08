import React from 'react'
import './Footer.css'
import {assets} from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Thrift Threads is your go-to online destination for stylish, affordable, and sustainable fashion. We curate a unique collection of pre-loved clothing, giving quality pieces a second life while helping you express your individuality. Whether you’re hunting for vintage gems, trendy finds, or timeless wardrobe staples, our easy-to-use e-commerce platform makes it simple to shop sustainably and look great doing it. Shop smart, save money, and join the movement toward eco-friendly fashion!</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-9915445698</li>
                <li>Contact@threadrevive.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 &copy; Threadrevive.com - All Rights Reserved</p>
    </div>
  )
}

export default Footer
