import axios from "axios";
import { createContext, useState, useEffect, useMemo } from "react";
import { food_list as assetFoodList } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("")
    const [apiFoodList, setApiFoodList] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    const addToCart = async(itemId) =>{
        if(!cartItems[itemId]){
            setCartItems((prev) => ({...prev,[itemId] : 1 }))
        }
        else{
            setCartItems((prev) => ({...prev,[itemId] : prev[itemId] + 1 }))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});
        }
    }

    const removeFromCart = async(itemId) => {
        setCartItems((prev) => ({...prev,[itemId] : prev[itemId] - 1 }))
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
        }
    }
    
    const combinedFoodList = useMemo(() => {
        const itemsByKey = new Map();

        assetFoodList.forEach((item) => {
            const key = item._id || item.name;
            if (!itemsByKey.has(key)) {
                itemsByKey.set(key, { ...item });
            }
        });

        apiFoodList.forEach((item) => {
            const key = item._id || item.name;
            itemsByKey.set(key, item);
        });

        return Array.from(itemsByKey.values());
    }, [apiFoodList]);

    const getTotalCartAmount = () =>{
        let totalAmount = 0;
        for(const item in cartItems){   
            if(cartItems[item] > 0){
                let itemInfo = combinedFoodList.find((product)=> product._id===item || product.name === item);

                if(!itemInfo){
                    continue;
                }

                totalAmount += Number(itemInfo.price || 0)*cartItems[item];
            }
        }
        return totalAmount;
    }

    // fetching the food list from the databse and not from the assets folder.
    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setApiFoodList(response.data.data);
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        async function loadData() {
            fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const ContextValue = {
        food_list: combinedFoodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        searchQuery,
        setSearchQuery
    }

    return(
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider