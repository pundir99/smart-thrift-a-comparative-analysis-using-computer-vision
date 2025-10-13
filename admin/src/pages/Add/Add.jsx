import React, { useEffect, useState } from 'react'
import "./Add.css"
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({url}) => {

  const [image, setImage] = useState(false)
  const [data, setData] = useState({
    "name" : "",
    "description" : "",
    "price" : "",
    "category" : "salad",
  });

  const onChangehandle = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const onSubmithandle = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("image", image);

    const response = await axios.post(`${url}/api/food/add`, formData);
    if(response.data.success){
      setData({
        "name" : "",
        "description" : "",
        "price" : "",
        "category" : "salad",
      })
      setImage(false);
      toast.success(response.data.message);
    }else{
      toast.error(response.data.message);
    }
  }

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmithandle}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>{setImage(e.target.files[0])}} type="file" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangehandle} value={data.name} type="text" name="name" placeholder='Type name here' />
        </div>
        <div className="add-product-desc flex-col">
          <p>Product description</p>
          <textarea onChange={onChangehandle} value={data.description} name="description" rows={6} placeholder='write content here'></textarea>
        </div>
        <div className="category-price">
          <div className="add-product-category flex-col">
            <p>Product category</p>
            <select onChange={onChangehandle} name="category">
              <option value="Salad">T-shirt</option>
              <option value="Noodles">Jeans</option>
              <option value="Rolls">Shirt</option>
              <option value="Deserts">Cargo</option>
              <option value="Sandwich">Pants/Trousers</option>
              <option value="Cake">Jacket</option>
              <option value="Pure Veg">Over-sized T-shirt</option>
              <option value="Pasta">Hoodie</option>
            </select>
          </div>
          <div className="add-product-price flex-col">
            <p>Product price</p>
            <input onChange={onChangehandle} value={data.price} type="Number" name='price' placeholder='$20' />
          </div>
        </div>
        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  )
}

export default Add
