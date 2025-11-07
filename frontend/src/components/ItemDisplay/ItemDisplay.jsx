import React, { useContext } from 'react'
import './ItemDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/ContextStore'

const ItemDisplay = ({ category }) => {

  const { food_list } = useContext(StoreContext)
  
  return (
    <div className='food-display' id='food-display'>
      <h2>Top clothes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return <FoodItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} description={item.description} />
          }
        })}
      </div>
    </div>
  )
}

export default ItemDisplay
