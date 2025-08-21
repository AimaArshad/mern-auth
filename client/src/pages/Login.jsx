import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";

import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault(); //when we click on submit button, it prevents the browser from reloading the web page

      //sends cookies alongwith  the request
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message); //error from backend
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/auth/login`, {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          console.log(data);
          navigate("/");
        } else {
          console.log(data);
          toast.error(data.message); //error from backend
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0  bg-gradient-to-br from-blue-200 to-purple-400">
      {/* <h1>Login</h1> */}

      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-small ">
        <h2 className="text-3xl font-semibold text-center text-white mb-3">
          {state === "Sign Up" ? "Create  Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {" "}
          {state === "Sign Up"
            ? "Create your Account"
            : "Login to your Account"}
        </p>

        <form onSubmit={handleSubmit}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="bg-transparent outline-none text-indigo-300"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="bg-transparent outline-none text-indigo-300"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="bg-transparent outline-none text-indigo-300"
              placeholder="Password"
              required
              type="password"
            />
          </div>

          <p
            onClick={() => {
              navigate("/reset-password");
            }}
            className=" text-sm mb-6 text-indigo-300 cursor-pointer"
          >
            Forgot password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-center text-xs mt-4 text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("Login");
              }}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>{" "}
          </p>
        ) : (
          <p className="text-center text-xs mt-4 text-gray-400">
            Don't have an account?{" "}
            <span
              onClick={() => {
                setState("Sign Up");
              }}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign Up here
            </span>{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
