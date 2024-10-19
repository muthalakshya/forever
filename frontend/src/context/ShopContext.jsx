import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props)=>{

    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate()

    // const addToCart = async (itemId, size)=>
    // {
    //     let cartData = structuredClone(cartItems);
    //     console.log(cartData[itemId][size])
    //     if (cartData[itemId]) {
    //         if (cartData[itemId][size]) {
    //             cartData[itemId][size] += 1;
    //         }
    //         else{
    //             cartData[itemId][size] = 1;
    //         }
    //     }
    //     else{
    //         cartData[itemId] = {};
    //         cartData[itemId][size] = 1;
    //     }
    //     setCartItems(cartItems)
    // }

    const addToCart = async (itemId, size) => {
        let cartData = structuredClone(cartItems);  // Clone the cartItems
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;  // Increment quantity if size already exists
            } else {
                cartData[itemId][size] = 1;  // Add new size with quantity 1
            }
        } else {
            cartData[itemId] = {};  // Create a new item entry
            cartData[itemId][size] = 1;  // Set quantity for the selected size
        }
        setCartItems(cartData);  // Update state with new cartData
    };

    const getCartCount = ()=> {
        let totalCount = 0;
        for(const items in cartItems) {
            for(const item in cartItems [items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems [items][item];
                    }
                } catch (error) {
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId][size]= quantity;
        setCartItems(cartData)
    }

    const getCartAmount = ()=>{
        let totalAmount = 0
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {}
            }
        }
        return totalAmount;
    }

    const value = {
        products ,currency, delivery_fee,
        search,setSearch,setShowSearch,showSearch,
        cartItems, addToCart, getCartCount,
        updateQuantity,
        getCartAmount, navigate
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;