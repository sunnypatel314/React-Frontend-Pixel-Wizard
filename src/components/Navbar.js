import React, { useState, useContext } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { logo } from "../assets";
import { UserContext } from "../App";

export default function Navbar({ logOut, page }) {
  const { user, setUser } = useContext(UserContext);
  return (
    <header
      className="w-full flex justify-between items-center bg-[#20B2AA] sm:px-8
    px-1 py-1 border-b border-b-[#20B2AA]"
    >
      <Link to={"/"}>
        <img src={logo} alt="logo" className="w-20 object-contain rounded-xl" />
      </Link>

      {user ? (
        <div className="flex flex-row justify-between space-x-3">
          {page === "Home" ? <CreateButton /> : <HomeButton />}
          <LogOutButton logOut={logOut} />
        </div>
      ) : (
        <div className="flex flex-row justify-between space-x-3">
          <SignUpButton />
          <LogInButton />
        </div>
      )}
    </header>
  );
}

const CreateButton = () => {
  return (
    <Link
      to={"/create-post"}
      className="font-inter flex items-center font-semibold bg-green-500 text-white py-2 
    px-2 rounded-md hover:cursor-pointer hover:bg-green-700"
    >
      <span className="mr-1">Create</span>
      <FaPlus />
    </Link>
  );
};

const LogOutButton = ({ logOut }) => {
  return (
    <button
      onClick={logOut}
      className="font-inter flex items-center font-semibold bg-red-500 text-white py-2 
       px-2 rounded-md hover:cursor-pointer hover:bg-red-700"
    >
      <span className="mr-1">Log Out</span>
    </button>
  );
};

const SignUpButton = () => {
  return (
    <Link
      to={"/sign-up"}
      className="font-inter font-semibold bg-green-500 text-white py-2 
      px-4 rounded-md hover:cursor-pointer hover:bg-green-700"
    >
      Sign Up
    </Link>
  );
};
const LogInButton = () => {
  return (
    <Link
      to={"/log-in"}
      className="font-inter font-semibold bg-blue-500 text-white py-2 
      px-4 rounded-md hover:cursor-pointer hover:bg-blue-700"
    >
      Log In
    </Link>
  );
};

const HomeButton = () => {
  return (
    <Link
      to={"/"}
      className="font-inter flex items-center font-semibold bg-blue-500 text-white py-2 
      px-2 rounded-md hover:cursor-pointer hover:bg-blue-700"
    >
      <span className="mr-1">Home</span> <FaHome />
    </Link>
  );
};
