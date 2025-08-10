import React from 'react';
import './sell.css';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import { useUser } from "./contextprovider";

function SellPage() {
  const Email = useUser();
  // to create products and add the feilds in it 
  const [newProducts, setNewProducts] = useState({productName:"",Institution:"",condition:"",price:""});
  // keeping track of listed products through a state 
  const [products, setProducts] = useState([]);
//state to keep track of the images 
const[productImage,setProductImage] = useState(null);


// upload url function 
// const uploadImage = async (file) => {
//   const filePath = `$({file.name})`;
//   const { error } = await supabase.storage
//   .from("product-images")
//   .upload(filePath,file);
//   if(error){
//     console.log("error uploading the image",error.message);
//     return;
//   }
//   else{
//    const{data} = await supabase.storage.from("product-images").getPublicUrl(filePath);
//    return data.publicUrl;
//   }
// }

// const , setTaskImage] = useState(null); // no type needed

const uploadImage = async (file) => {
  const filePath = `${Date.now()}-${file.name}`;// removed Date.now()

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true, // overwrite if needed
    });

  if (error) {
    console.error("Error uploading image:", error.message);
    return null;
  }

  // const { data } = await supabase.storage
  //   .from("product-images")
  //   .getPublicUrl(filePath);

  // return data?.publicUrl || null;
  const {
    data: { publicUrl },
  } = await supabase.storage.from("product-images").getPublicUrl(filePath);

  return publicUrl || null;
};


// to insert the data into the Supabase database
  const handleSubmit = async (e) => {
      e.preventDefault();
//image urls part 
    let imageUrl = null;
    if(productImage){
      imageUrl = await uploadImage(productImage);
    }
      const {error} = await supabase.from("products").insert({...newProducts, image_url: imageUrl,email: Email}).single();
      if(error){
        alert(error.message);
      }
      else{
        alert("Product Listed Successfully");
        // setNewProducts({productName:"",Institution:"",condition:"",price:""});
        setNewProducts({productName:"",Institution:"",condition:"",price:""});
      }
  }
// to fetch the data from the supabase database
 const fetchProducts = async () => {
  const { error,data } = await supabase
  .from("products")
  .select("*")
  .order("id",{ascending:true});

  if(error){
    console.log("Error reading tasks",error.message);
    return;
  }
  else{
    setProducts(data);
  }
 };

// simply using the useEffect to fetch the data when ever the page id refreshed  
useEffect(()=>{
  fetchProducts();
},[]);
console.log(products);

// images part adding them in the storage bucket
const handleFileChange = (e) => {
  if(e.target.files && e.target.files.length > 0){
    setProductImage(e.target.files[0]);
  }
};


//to navigate to other pages 
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/'); // Navigate to the About page
  };

  return (
    <div className="sell-container">
      <h1>Sell Your Product on Re-Book Hub</h1>
      <button className="aboutus-btn" onClick={handleButtonClick}>Go to Shop</button>
      <form onSubmit={handleSubmit} className="sell-form">
        <label htmlFor="productName">Product Name:</label>
        <input type="text" id="productName" name="productName" placeholder="Enter product name" required 
        onChange={(e)=>{
          // setNewProducts({...newProducts,productName:e.target.value}) // might has to be changed not acc to video
          setNewProducts((prev) => ({...prev,productName:e.target.value}))
        }}
        />

        <label htmlFor="institution">Institution:</label>
        <input type="text" id="institution" name="institution" placeholder="Enter your institution name" required
        onChange={(e)=>{
          // setNewProducts({...newProducts,institution:e.target.value}) // might has to be changed not acc to video 
          setNewProducts((prev) => ({...prev,Institution:e.target.value}))
        }}
        />

        <label htmlFor="condition">Product Condition:</label>
        <input type="text" id="condition" name="condition" placeholder="Discribe Product Condition" required 
          onChange={(e)=>{
            // setNewProducts({...newProducts,condition:e.target.value}) // might has to be changed not acc to video
            setNewProducts((prev) => ({...prev,condition:e.target.value}))
          }}
        />

        <label htmlFor="price">Price (in INR):</label>
        <input type="number" id="price" name="price" placeholder="Enter price" required 
          onChange={(e)=>{
            // setNewProducts({...newProducts,price:e.target.value}) // might has to be changed not acc to video
            setNewProducts((prev) => ({...prev,price:e.target.value}))
          }}
          />


        <label htmlFor="productImage">Product Image:</label>
        <input type="file" id="productImage" name="productImage" accept="image/*" required
        // onChange={(e)=>{
        //   handleFileChange(e);
        // }}
        onChange={handleFileChange}
        />

        <button type="submit">Submit Listing</button>
      </form>

{/* <p>{products}</p> */}

    </div>

  );
}

export default SellPage;