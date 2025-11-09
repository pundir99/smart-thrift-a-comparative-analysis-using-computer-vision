import React, { useContext, useMemo, useState, useRef } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import {Link, useNavigate} from 'react-router-dom'
import { StoreContext } from '../../context/ContextStore'

const Navbar = ({setShowLogin}) => {

    const navigate = useNavigate();
    const [menu, setMenu] = useState("Home");
    const {getTotalCartAmount, token, setToken, searchQuery, setSearchQuery, food_list} = useContext(StoreContext)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const blurTimeoutRef = useRef(null)

    const normalizeValue = (value) => {
      if (value === undefined || value === null) {
        return ''
      }
      return value.toString().normalize('NFKC').trim().toLowerCase()
    }

    const normalizedSearch = normalizeValue(searchQuery)

    const suggestions = useMemo(() => {
      if (!normalizedSearch) {
        return []
      }

      const seen = new Set()

      return food_list.reduce((acc, item) => {
        const key = item._id || item.name
        if (seen.has(key)) {
          return acc
        }

        const normalizedName = normalizeValue(item.name)
        const normalizedCategory = normalizeValue(item.category)

        if (
          normalizedName.includes(normalizedSearch) ||
          normalizedCategory.includes(normalizedSearch)
        ) {
          seen.add(key)
          acc.push({
            key,
            name: item.name,
            category: item.category
          })
        }

        return acc
      }, []).slice(0, 6)
    }, [food_list, normalizedSearch])

    const Logout = () => {
      localStorage.removeItem("token");
      setToken("");
      navigate("/");
    }

    const handlechange = (e) => {
      const { value } = e.target;
      setSearchQuery(value);
    }

    const handleSuggestionSelect = (suggestion) => {
      setSearchQuery(suggestion.name || '')
      setIsSearchFocused(false)
      const displayElement = document.getElementById('food-display')
      if (displayElement) {
        displayElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    const handleInputFocus = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current)
      }
      setIsSearchFocused(true)
    }

    const handleInputBlur = () => {
      blurTimeoutRef.current = setTimeout(() => {
        setIsSearchFocused(false)
      }, 150)
    }

    const showSuggestions = isSearchFocused && normalizedSearch && suggestions.length > 0

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
        <div className='navbar-search'>
          <input
            className='input-search-icon'
            type="text"
            value={searchQuery}
            onChange={handlechange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Search clothes"
            aria-label="Search clothes"
          />
          <img className='search-icon' src={assets.search_icon} alt="" />
          {showSuggestions && (
            <ul className='navbar-search-suggestions'>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.key}
                  className='navbar-search-suggestion'
                  onMouseDown={(event) => {
                    event.preventDefault()
                    handleSuggestionSelect(suggestion)
                  }}
                >
                  <span className='navbar-search-suggestion-name'>{suggestion.name}</span>
                  {suggestion.category && (
                    <span className='navbar-search-suggestion-category'>{suggestion.category}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
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
