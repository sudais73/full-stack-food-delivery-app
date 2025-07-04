import React, { useState } from "react";
import "./LoginPopUp.css";
import { assets } from "./../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import axios from 'axios'
const LoginPopUp = ({ setShowLogin }) => {
  const [state, setState] = useState("Sign Up");
  const { url ,token, setToken} = useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    let newUrl = url;
    if(state === "Login"){
   newUrl += "/api/user/login"
    }else{
      newUrl += "/api/user/signup"
    }
const response = await axios.post(newUrl,data)
if(response.data.success){
  setToken(response.data.token)
  localStorage.setItem("token",response.data.token)
  setShowLogin(false)
}else{
  alert(response.data.msg)
}

  };
  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{state}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        <div className="login-input">
          {state === "Sign Up" ? (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          ) : (
            <></>
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your Email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-condition">
          <input type="checkbox" />
          <p>By continuing, i agree to the terms of use & privacy</p>
        </div>
        {state === "Sign Up" ? (
          <p>
            Already have an new account?{" "}
            <span onClick={() => setState("Login")}>Login Here</span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span onClick={() => setState("Sign Up")}>Click Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
