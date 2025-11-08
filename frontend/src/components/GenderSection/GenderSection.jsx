import React, { useContext, useMemo, useState } from 'react'
import './GenderSection.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/ContextStore'
import { food_list as assetFoodList } from '../../assets/assets'

const normalizeCategory = (value) => {
  if (value === undefined || value === null) {
    return ''
  }

  return value.toString().normalize('NFKC').trim().toLowerCase()
}

const genders = ['MEN', 'WOMEN', 'KIDS']

const genderCategories = {
  MEN: [
    { name: 'Blazer', aliases: ['blazer'] },
    { name: 'Kemeja', aliases: ['kemeja', 'kemaja', 'shirt', 'men shirt'] },
    { name: 'Polo', aliases: ['polo'] },
    { name: 'Celana Pendek', aliases: ['celana pendek', 'shorts'] },
    { name: 'Jeans', aliases: ['jeans', 'denim'] },
    { name: 'Kaos', aliases: ['kaos', 't-shirt', 'tee'] },
    { name: 'Hoodie', aliases: ['hoodie', 'hoodies'] },
    { name: 'Jacket', aliases: ['jacket', 'mantel', 'coat'] },
    { name: 'Jacket Denim', aliases: ['jacket denim', 'denim jacket'] },
    { name: 'Jacket Olahraga', aliases: ['jacket olahraga', 'sports jacket'] },
    { name: 'Sweater', aliases: ['sweater', 'cardigan'] }
  ],
  WOMEN: [
    { name: 'Gaun', aliases: ['gaun', 'dress'] },
    { name: 'Blazer', aliases: ['blazer'] },
    { name: 'Celana Panjang', aliases: ['celana panjang', 'trousers', 'pants'] },
    { name: 'Celana Pendek', aliases: ['celana pendek', 'shorts'] },
    { name: 'Jeans', aliases: ['jeans', 'denim'] },
    { name: 'Kaos', aliases: ['kaos', 't-shirt', 'tee'] },
    { name: 'Hoodie', aliases: ['hoodie', 'hoodies'] },
    { name: 'Jacket', aliases: ['jacket', 'mantel', 'coat'] },
    { name: 'Jacket Denim', aliases: ['jacket denim', 'denim jacket'] },
    { name: 'Jacket Olahraga', aliases: ['jacket olahraga', 'sports jacket'] },
    { name: 'Sweater', aliases: ['sweater', 'cardigan'] },
    { name: 'Rok', aliases: ['rok', 'skirt'] }
  ],
  KIDS: [
    { name: 'Kaos', aliases: ['kaos', 't-shirt', 'tee'] },
    { name: 'Celana Pendek', aliases: ['celana pendek', 'shorts'] },
    { name: 'Jeans', aliases: ['jeans', 'denim'] },
    { name: 'Hoodie', aliases: ['hoodie', 'hoodies'] },
    { name: 'Jacket', aliases: ['jacket', 'coat'] },
    { name: 'Sweater', aliases: ['sweater', 'cardigan'] }
  ]
}

const GenderSection = () => {
  const { food_list: apiFoodList } = useContext(StoreContext)
  const [activeGender, setActiveGender] = useState(genders[0])
  const categories = genderCategories[activeGender] || []

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

  const itemsByCategory = useMemo(() => {
    const groupedItems = categories.reduce((acc, category) => {
      acc[category.name] = []
      return acc
    }, {})

    combinedFoodList.forEach((item) => {
      const normalizedItemCategory = normalizeCategory(item.category)

      categories.forEach((category) => {
        if (category.aliases.includes(normalizedItemCategory)) {
          groupedItems[category.name].push(item)
        }
      })
    })

    return groupedItems
  }, [categories, combinedFoodList])

  const hasItems = Object.values(itemsByCategory).some((items) => items.length > 0)

  return (
    <div className='gender-section'>
      <div className='gender-toggle'>
        {genders.map((gender) => (
          <button
            key={gender}
            type='button'
            className={`gender-toggle-button ${activeGender === gender ? 'active' : ''}`}
            onClick={() => setActiveGender(gender)}
          >
            {gender} Collection
          </button>
        ))}
      </div>
      <h2>{activeGender} Collection</h2>
      {hasItems ? (
        categories.map((category) => {
          const items = itemsByCategory[category.name]

          if (!items || items.length === 0) {
            return null
          }

          return (
            <div key={category.name} className='gender-category'>
              <h3 className='gender-category-title'>{category.name}</h3>
              <div className='gender-category-list'>
                {items.map((item) => (
                  <FoodItem
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    description={item.description}
                  />
                ))}
              </div>
            </div>
          )
        })
      ) : (
        <p className='no-items'>No items available in this collection yet.</p>
      )}
    </div>
  )
}

export default GenderSection
