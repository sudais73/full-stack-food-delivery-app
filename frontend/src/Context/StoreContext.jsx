import { createContext, useEffect, useState } from "react";
import axios from 'axios'

// eslint-disable-next-line react-refresh/only-export-components
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const url = "https://food-de-backend-2.onrender.com";
  const[food_list, setFood_list] = useState([])

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  
    }

        if(token){
    await axios.post(`${url}/api/cart/add`,{itemId},{headers:{token}})
}


  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }

    return totalAmount;
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
          if(token){
    await axios.post(`${url}/api/cart/remove`,{itemId},{headers:{token}})
}
  };



const fetchFoodList = async()=>{
  const response = await axios.get(`${url}/api/food/food-list`)
  setFood_list(response.data.data)
}

// const loadCartData = async (token)=>{
//   const response = await axios.post(`${url}/api/cart/get`,{}, {headers:{token}})
//      setCartItems(response.data.cartData);
// }


  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token, setToken
  };

  



  useEffect(()=>{
  async function loadData() {
  await fetchFoodList();

  if(localStorage.getItem("token")){
    setToken(localStorage.getItem("token"));
  //  await loadCartData(localStorage.getItem("token"));
}

}
loadData();
  },[]);


  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
