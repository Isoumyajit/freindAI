import React from 'react'
// import { useNavigate } from 'react-router-dom';

export const ServiceExpired = () => {
    // const navigate = useNavigate();  
    const goToGitHub = () => { 
     window.open("https://github.com/Isoumyajit/freindAI", '_blank').focus();
    }
  return (
    <div className="m-10 md:m-0 flex justify-center items-center place-content-center">
      <div className="canvas flex bg-gray-200 border-2 rounded-md w-fit p-10 md:p-40 h-auto">
        <div className="flex flex-col contents-div  items-center justify-center gap-4">
          <p className=" text-emerald-600 font-bold text-lg">
            Free Services are expired for OpenAI
          </p>
          <p className=" text-xs text-gray-500 font-semibold">
            {" "}
            Sorry !! for the inconvenience
          </p>
          <button
            className="btn cursor-pointer text-white flex rounded-md p-2 items-center justify-center bg-gray-400 hover:bg-gray-600 scale-105 duration-200"
            onClick={goToGitHub}
          >
            View Code
          </button>
        </div>
      </div>
    </div>
  );
}
