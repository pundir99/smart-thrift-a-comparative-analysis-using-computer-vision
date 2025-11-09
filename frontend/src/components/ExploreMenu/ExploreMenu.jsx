import React, { useContext } from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
import { StoreContext } from '../../context/ContextStore'

const ExploreMenu = ({category, setCategory}) => {
  const { setSearchQuery } = useContext(StoreContext)

  const handleCategoryClick = (menuName) => {
    setCategory((prev) => {
      const nextCategory = prev === menuName ? "All" : menuName
      return nextCategory
    })
    setSearchQuery("")
  }

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">Our thrift clothing store offers a diverse range of stylish options to suit every taste and preference. From classic denim and cozy sweaters to chic dresses and unique vintage finds, we cater to all styles.</p>
      <div className="explore-menu-list">
        {menu_list.map((item,index)=>{
            return(
                <div onClick={()=> handleCategoryClick(item.menu_name)} key={index} className="explore-menu-list-item">
                    <img className={category === item.menu_name? "active" : ""} src={item.menu_image} alt="" />
                    <p>{item.menu_name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
