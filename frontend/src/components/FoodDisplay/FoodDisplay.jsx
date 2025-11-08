import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/ContextStore'

const normalizeCategory = (value) => {
  if (value === undefined || value === null) {
    return ''
  }

  return value.toString().normalize('NFKC').trim().toLowerCase()
}

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext)
  const selectedCategory = normalizeCategory(category)

  return (
    <div className='food-display' id='food-display'>
      <h2>Top clothes near you</h2>
      <div className='food-display-list'>
        {food_list.map((item, index) => {
          const itemCategory = normalizeCategory(item.category)

          if (!selectedCategory || selectedCategory === 'all' || itemCategory === selectedCategory) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
                description={item.description}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
