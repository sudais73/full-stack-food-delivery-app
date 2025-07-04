import React, { useState } from 'react'
import './AddFood.css'
import { assets} from '../../assets/assets'
import  axios  from 'axios';
import { toast } from 'react-toastify';
const AddFood = ({url}) => {

  const[image, setImage] = useState(false);

  const[data, setData] = useState({
       name:"",
      description:"",
      price:"",
      category:"Salad",

  });

  const onChangeHandler = (e)=>{

const name = e.target.name;
const value= e.target.value;
setData(data=>({...data,[name]:value}))
  }

  const onSubmitHandler = async(e)=>{
    e.preventDefault();
const formData = new FormData();
formData.append("name",data.name)
formData.append("description",data.description)
formData.append("price",Number(data.price))
formData.append("category",data.category)
formData.append("image",image)

const response = await axios.post(`${url}/api/food/add`, formData)
if(response.data.success){
setData({
       name:"",
      description:"",
      price:"",
      category:"Salad",
})
setImage(false)
toast.success(response.data.msg)
}else{
toast.error("error adding food")
}

  }

  return (
    <div className='add-food'>
    <form onSubmit={onSubmitHandler} className='flex-col' >
      <div className="add-img-upload flex-col">
        <p>Upload Image</p>
        <label htmlFor="image">
          <img src={ image?URL.createObjectURL(image): assets.upload_area} alt="" />
        </label>
        <input onChange={(e)=>setImage(e.target.files[0])}  type="file" id='image' hidden required />
      </div>

      <div className="add-product-name flex-col">
       <p>Product Name</p>
       <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='type here' />
      </div>
      <div className="product-desc flex-col">
          <p>Product Description</p>
        <textarea onChange={onChangeHandler} value={data.description} name='description' rows='6' placeholder='description here'></textarea>
      </div>
        <div className="category-price">
          <div className="category">
            <p>Product Category</p>
        <select onChange={onChangeHandler} value={data.category} name="category" id="">
          <option value="Salad">Salad</option>
          <option value="Rolls">Rolls</option>
          <option value="Deserts">Deserts</option>
          <option value="Sandwich">Sandwich</option>
          <option value="Cake">Cake</option>
          <option value="pure Veg">pure Veg</option>
          <option value="Pasta">Pasta</option>
          <option value="Noodles">Noodles</option>
        </select>
          </div>

          <div className="price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='$50' />
          </div>
        </div>
        <button className='add-btn' type='submit'>Add</button>
    </form>
    </div>
  )
}

export default AddFood
