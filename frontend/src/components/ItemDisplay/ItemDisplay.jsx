import React, { useContext, useMemo } from 'react'
import './ItemDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/ContextStore'
import { food_list as assetFoodList } from '../../assets/assets'

const normalizeCategory = (value) => {
  if (value === undefined || value === null) {
    return ''
  }

  return value.toString().normalize('NFKC').trim().toLowerCase()
}

const ItemDisplay = ({ category }) => {

  const { food_list: apiFoodList } = useContext(StoreContext)

  const combinedFoodList = useMemo(() => {
    const itemsByKey = new Map()

    assetFoodList.forEach((item) => {
      const key = item._id || item.name
      if (!itemsByKey.has(key)) {
        itemsByKey.set(key, { ...item })
      }
    })

    apiFoodList.forEach((item) => {
      const key = item._id || item.name
      itemsByKey.set(key, item)
    })

    return Array.from(itemsByKey.values())
  }, [apiFoodList])

  const filteredItems = useMemo(() => {
    const normalizedSelectedCategory = normalizeCategory(category)

    return combinedFoodList.filter((item) => {
      if (normalizedSelectedCategory === '' || normalizedSelectedCategory === 'all') {
        return true
      }

      return normalizeCategory(item.category) === normalizedSelectedCategory
    })
  }, [category, combinedFoodList])
  
  return (
    <div className='food-display' id='food-display'>
      <h2>Top clothes near you</h2>
      <div className="food-display-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const resolvedId = item._id || item.name

            return (
              <FoodItem
                key={resolvedId}
                id={resolvedId}
                name={item.name}
                price={item.price}
                image={item.image}
                description={item.description}
              />
            )
          })
        ) : (
          <p className='no-items'>No items available in this category yet.</p>
        )}
      </div>
    </div>
  )
}

export default ItemDisplay
