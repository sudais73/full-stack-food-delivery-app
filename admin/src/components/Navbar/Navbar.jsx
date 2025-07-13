import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
const Navbar = () => {
  return (
    <div className='navbar'>
      <h1 className='logo'>MOM.</h1>
      <img className='profile-img' src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar
