import React from "react";

import { download } from "../assets";
import { downloadImage } from "../utils";
import { FaTrash } from "react-icons/fa";
import { dateConversion } from "../utils/dateConversion";

const Card = ({ id, creator, prompt, photoUrl, createdDate, username }) => {
  const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

  const confirmDeletion = () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmation) {
      deletePost();
    }
  };

  const deletePost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 204) {
        window.location.reload();
      } else {
        const responseData = await response.json();
        alert(responseData.error);
      }
    } catch (error) {
      alert("Something went wrong and post was not deleted");
    }
  };

  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
      <img
        className="w-full h-auto object-cover rounded-xl"
        src={photoUrl}
        alt={prompt}
      />
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        <p className="text-white text-sm overflow-y-auto prompt">{prompt}</p>
        <div className="mt-5 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold">
              {/* {creator[0].toUpperCase()} */}
            </div>
            <p className="text-white text-sm">{creator}</p>
          </div>
          <div
            className="outline-none bg-transparent border-none flex 
            flex-row justify-center items-center space-x-3"
          >
            <button type="button" onClick={() => downloadImage(id, photoUrl)}>
              <img
                src={download}
                alt="download"
                className="w-6 h-6 object-contain invert"
              />
            </button>
            {username === creator && (
              <FaTrash
                onClick={confirmDeletion}
                className="w-6 h-6 text-white bg-transparent hover:text-red-500 hover:cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="">
          <p className="text-white text-sm mt-2 ml-1">
            {dateConversion(createdDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
