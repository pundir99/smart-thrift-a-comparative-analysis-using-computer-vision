import React, { useState, useEffect, useContext } from 'react'
import './Recommendations.css'
import ItemItem from '../ItemItem/ItemItem'
import { StoreContext } from '../../context/ContextStore'

const Recommendations = ({ itemId, title = "Similar Items" }) => {
  const { getRecommendations, item_list } = useContext(StoreContext)
  const [recommendedItems, setRecommendedItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!itemId) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const recommendations = await getRecommendations(itemId)
        setRecommendedItems(recommendations)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        setRecommendedItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [itemId, getRecommendations])

  if (loading) {
    return (
      <div className='recommendations'>
        <h2>{title}</h2>
        <div className='recommendations-loading'>
          <p>Finding similar items...</p>
        </div>
      </div>
    )
  }

  if (recommendedItems.length === 0) {
    return null
  }

  return (
    <div className='recommendations'>
      <h2>{title}</h2>
      <div className='recommendations-list'>
        {recommendedItems.map((item, index) => (
          <ItemItem
            key={item._id || index}
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
}

export default Recommendations

