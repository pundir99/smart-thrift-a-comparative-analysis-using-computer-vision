import React, { useContext, useEffect, useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import {Link, useNavigate} from 'react-router-dom'
import { StoreContext } from '../../context/ContextStore'

const Navbar = ({setShowLogin}) => {

    const navigate = useNavigate();

    const [menu, setMenu] = useState("Home");
    const [data, setData] = useState("")
    const {getTotalCartAmount, token, setToken} = useContext(StoreContext)

    const Logout = () => {
      localStorage.removeItem("token");
      setToken("");
      navigate("/");
    }

    const handlechange = (e) => {
      let name = e.target.name;
      let value = e.target.value;
      setData(data =>({...data,[name]: value}));
    }

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} className='logo' alt="" /></Link>
      <ul className="menu">
        <Link to="/" onClick={()=> {setMenu("Home")}} className={menu === "Home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={()=> {setMenu("Menu")}} className={menu === "Menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={()=> {setMenu("Mobile-app")}} className={menu === "Mobile-app" ? "active" : ""}>Mobile-app</a>
        <a href='#footer' onClick={()=> {setMenu("Contact Us")}} className={menu === "Contact Us" ? "active" : ""}>Contact Us</a>
      </ul>
      <div className="navbar-right">
        <input className='input-search-icon' type="text" onChange={handlechange} />
        <img className='search-icon' src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
        <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token?<button onClick={()=> setShowLogin(true)}>Sign In</button>
        : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />    
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={Logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>}
      </div>
    </div>
  )
}

export default Navbar
