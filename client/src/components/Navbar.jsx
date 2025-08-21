import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
const Navbar = () => {
  const navigate = useNavigate();
  const { backendUrl, userData, setUserData, isLoggedIn, setIsLoggedIn } =
    useContext(AppContext);

  const sendVerificationEmail = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/auth/send-verify-otp`);

      if (data.success) {
        navigate("/email-verify");

        toast.success("Verification email sent successfully", data.message);
      } else {
        toast.error("Failed to send verification email", data.message);
      }
    } catch (error) {
      toast.error("Failed to send verification email", error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/auth/logout`);

      data.success && setIsLoggedIn(false);
      data.success && setUserData(null);

      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between  items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center round-full bg-black text-white relative group hover:">
          {userData.name[0].toUpperCase()}

          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-300 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationEmail}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-800 rounded-full px-6 py-2  border border-gray-500 hover:bg-gray-300 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
