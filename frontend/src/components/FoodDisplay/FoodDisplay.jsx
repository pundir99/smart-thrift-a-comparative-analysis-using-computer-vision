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
  const { food_list, searchQuery } = useContext(StoreContext)
  const selectedCategory = normalizeCategory(category)
  const normalizedSearch = normalizeCategory(searchQuery)

  const filteredItems = food_list.filter((item) => {
    const itemCategory = normalizeCategory(item.category)
    const itemName = normalizeCategory(item.name)

    if (normalizedSearch) {
      return itemCategory.includes(normalizedSearch) || itemName.includes(normalizedSearch)
    }

    if (!selectedCategory || selectedCategory === 'all') {
      return true
    }

    return itemCategory === selectedCategory
  })

  return (
    <div className='food-display' id='food-display'>
      <h2>Top clothes near you</h2>
      <div className='food-display-list'>
        {filteredItems.map((item, index) => {
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
        })}
        {filteredItems.length === 0 && (
          <div className='food-display-empty'>
            <p>No clothes found for your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodDisplay
