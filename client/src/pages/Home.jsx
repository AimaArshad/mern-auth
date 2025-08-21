import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')]">
      <Navbar />
      {/* <h1>Home</h1> */}
      <Header />
    </div>
  );
};

export default Home;
