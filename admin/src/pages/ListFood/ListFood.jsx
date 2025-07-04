import React, { useEffect, useState } from 'react'
import './ListFood.css'
import axios from 'axios';
import { toast } from 'react-toastify';
const ListFood = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/food-list`);
    if (response.data.success) {
      setList(response.data.data)
      console.log(response.data)
    } else {
      toast.error("error")
    }
  }


  const removeFood = async(foodId)=>{
const response = await axios.post(`${url}/api/food/remove`,{id:foodId});

 if(response.data.success) {
  toast.success(response.data.msg);
  try {
    await fetchList();
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    toast.error("Failed to refresh data");
  }
} else {
  toast.error(response.data.msg || "Error");
}

}

  useEffect(() => {
    fetchList()
  }, [])
  return (
    <div className='list-food flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>

        </div>

        {
          list.map((item,i)=>{
            return (
              <div key={i} className='list-table-format'>
                  <img src={`${url}/images/`+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>${item.price}</p>
                    <p onClick={()=>removeFood(item._id)} className='cross'>X</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default ListFood
