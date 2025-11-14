import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import ItemDisplay from '../../components/ItemDisplay/ItemDisplay'
import GenderSection from '../../components/GenderSection/GenderSection'
import AppDownload from '../../components/AppDownload/AppDownload'
import { StoreContext } from '../../context/ContextStore'

const Home = () => {
    const [category, setCategory] = useState("All")
    const { searchQuery } = useContext(StoreContext)

    useEffect(() => {
      if (searchQuery) {
        setCategory("All")
      }
    }, [searchQuery])
  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <ItemDisplay category={category} />
      <GenderSection />
      <AppDownload />
    </div>
  )
}

export default Home
