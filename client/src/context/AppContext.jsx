import { createContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true; //to send the cookies for authentication//is-auth api call(so onrefreshing page,name  of user is displayed  )
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  //call this function whenever page is loaded..useEffect
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/auth/is-auth`);
      if (!data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        return;
      }

      setIsLoggedIn(true);
      getUserData();
    } catch (error) {
      toast.error("Failed to fetch auth state", error.message);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/userData`, {
        withCredentials: true,
      });
      console.log(data);
      if (data.success) {
        setUserData({
          name: data.userData.name,
          email: data.userData.email,
          isAccountVerified: data.userData.isAccountVerified,
          //data.userData(contains hashedPassword)
        });
      } else {
        toast.error(data.message);
      }

      console.log(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data", error.message);
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);
  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  //in value object,we can pass any state variables or functions (that we want to make available to our components) and we can access it in any component

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
