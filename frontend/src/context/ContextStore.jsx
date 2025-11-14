import axios from "axios";
import { createContext, useState, useEffect, useMemo } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("")
    const [apiItemList, setApiItemList] = useState([])
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
    
    const combinedItemList = useMemo(() => {
        if (!Array.isArray(apiItemList)) {
            return [];
        }
        return apiItemList;
    }, [apiItemList]);

    const getTotalCartAmount = () =>{
        let totalAmount = 0;
        for(const item in cartItems){   
            if(cartItems[item] > 0){
                let itemInfo = combinedItemList.find((product)=> product._id===item || product.name === item);

                if(!itemInfo){
                    continue;
                }

                totalAmount += Number(itemInfo.price || 0)*cartItems[item];
            }
        }
        return totalAmount;
    }

    // fetching the item list from the databse and not from the assets folder.
    const fetchItemList = async () => {
        try {
            const response = await axios.get(url+"/api/item/list");
            const { data } = response.data || {};
            setApiItemList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch items list", error);
            setApiItemList([]);
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        async function loadData() {
            fetchItemList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const ContextValue = {
        item_list: combinedItemList,
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