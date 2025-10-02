import React from 'react'
import './Footer.css'
import {assets} from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam, sapiente. Id, nobis est. A tempore ab corrupti est aut alias aliquid reiciendis inventore corporis nobis, cupiditate et perspiciatis repudiandae at animi temporibus totam velit labore laborum fugiat pariatur! Aut sed inventore corporis quo cupiditate consequatur sunt non ipsa? Veritatis, nemo.</p>
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
