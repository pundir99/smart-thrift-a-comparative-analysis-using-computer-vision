import React, { useContext, useEffect, useState, useMemo } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import ItemDisplay from '../../components/ItemDisplay/ItemDisplay'
import GenderSection from '../../components/GenderSection/GenderSection'
import AppDownload from '../../components/AppDownload/AppDownload'
import Recommendations from '../../components/Recommendations/Recommendations'
import { StoreContext } from '../../context/ContextStore'

const Home = () => {
    const [category, setCategory] = useState("All")
    const { searchQuery, item_list } = useContext(StoreContext)
    const [recommendationItemId, setRecommendationItemId] = useState(null)

    const normalizeValue = (value) => {
      if (value === undefined || value === null) {
        return ''
      }
      return value.toString().normalize('NFKC').trim().toLowerCase()
    }

    const normalizedSearch = useMemo(() => normalizeValue(searchQuery), [searchQuery])

    useEffect(() => {
      if (searchQuery) {
        setCategory("All")
      }
    }, [searchQuery])

    // Update the recommendation source item based on the current search
    useEffect(() => {
      // If there is no active search, do not show any recommendations
      if (!normalizedSearch) {
        setRecommendationItemId(null)
        return
      }

      if (!item_list || item_list.length === 0) {
        setRecommendationItemId(null)
        return
      }

      const matchedItem = item_list.find((item) => {
        const name = normalizeValue(item.name)
        const category = normalizeValue(item.category)
        return name.includes(normalizedSearch) || category.includes(normalizedSearch)
      })

      if (matchedItem) {
        setRecommendationItemId(matchedItem._id)
      } else {
        setRecommendationItemId(null)
      }
    }, [normalizedSearch, item_list])

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <ItemDisplay category={category} />
      {recommendationItemId && (
        <Recommendations
          itemId={recommendationItemId}
          title={`Top 5 searches of ML model - Fashion Recommendation`}
        />
      )}
      <GenderSection />
      <AppDownload />
    </div>
  )
}

export default Home
