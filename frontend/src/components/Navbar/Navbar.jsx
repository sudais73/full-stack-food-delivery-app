import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import {Link, useNavigate} from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
const Navbar = ({setShowLogin}) => {

  const{getTotalCartAmount,token,setToken} = useContext(StoreContext)
    const[menu, setMenu] = useState("home")
const navigate = useNavigate()
    const logout = ()=>{
      localStorage.removeItem("token")
      setToken("")
      navigate("/")
    }
  return (
    <div className='navbar'>
     <Link to={'/'}> <h1 className='logo'>MOM.</h1>
     </Link> 
      <ul className="navbar-menu">
        <Link to={'/'} onClick={()=>setMenu("home")} className={menu === "home"? "active":""}>
        <span onClick={()=>scrollTo(0,0)}>Home</span>
        </Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu === "menu"? 'active':''}>Menu</a>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu === "mobile-app"? 'active':''}>Mobile-app</a>
        <a href='#footer' onClick={()=>setMenu("contact")} className={menu === "contact"? "active":''}>Contact us</a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
           <Link onClick={()=>scrollTo(0,0)} to={'/cart'}>  <img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token?
        <div onClick={()=>scrollTo(0,0)}><button onClick={()=>setShowLogin(true)}>Sign In</button></div> :
        <div className='navar-profile'>
          <img src={assets.profile_icon} alt="" />
          <ul className='profile-dropdown'>
            <li onClick={()=>navigate("/myorders")}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
            <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li>
          </ul>
        </div>
        }
        
      </div>
    </div>
  )
}

export default Navbar
