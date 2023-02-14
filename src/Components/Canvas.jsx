import React from "react";
import { useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
// import { BiBot, BiUserCircle } from "react-icons/bi";
import "../Assets/Css/Chathead.css";

export const Canvas = () => {
  const data = useRef();
  let form = null;
  let chatContainer = null;
  let loadInterval = null;
  const baseURL = "https://chataibackendservice.onrender.com/";

  const getformData = () => {
    form = document.querySelector("form");
    chatContainer = document.querySelector("#chat_container");
  };
  const loader = (res) => {
    res.textContent = "";
    loadInterval = setInterval(() => {
      res.textContent += ".";
      if (res.textContent === "....") {
        res.textContent = "";
      }
    }, 300);
  };

  const typingHandler = (element, text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        if (text.charAt(index) === "\n") element.innerHTML += "<br/>";
        else { element.innerHTML += text.charAt(index); }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);
  };


  const generateID = () => {
    const timestamp = Date.now();
    const random = Math.random();
    const hexa = random.toString(16);
    return `${timestamp}-${hexa}`;
  };

  const chatDecor = (isAI, value, id) => {
    return `<div class="chathead-container">
          <div class="profile">
          <img class="profile_img" src="${
            isAI
              ? "https://img.icons8.com/fluency/40/null/chatbot.png"
              : "https://img.icons8.com/offices/40/null/user.png"
          }" 
          alt="${isAI ? "ai" : "user"}"/>
          </div>
          <div class="wrapper ${isAI ? "ai" : "user"}">
          <div class="chat">
          <div calss="chathead" id="${id}"> ${value}
          </div>
          </div>
          </div>
          </div>
       `;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    getformData();
    chatContainer.innerHTML += chatDecor(false, data.current.value);
    let id = generateID();
    chatContainer.innerHTML += chatDecor(true, " ", id);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const msgDiv = document.getElementById(id);
    loader(msgDiv);
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.current.value,
      }),
      mode: "cors",
    });
    clearInterval(loadInterval);
    form.reset();
    msgDiv.innerHTML = "";
    if (response.ok ) {
      let returnedData = await response.json();
      const parsedData = returnedData.bot.trim();
      typingHandler(msgDiv, parsedData);
    } else {
      let err = await response.text();
      console.error(err)
      typingHandler(msgDiv,"Hey Ai Is Down right now");
    }
  };

  
  return (
    <div className=" flex canvas bg-gray-700 max-w-full h-screen">
        <div
          className="w-fit ml-5 mt-5 md:m-10 absolute text-white md:p-2"
          id="chat_container"
        ></div>
    
      <div className="flex items-center justify-center min-w-full mt-auto">
        <form
          className=" z-50 text-white bg-gray-600 rounded-lg mb-3 p-2 flex bottom-48 justify-center w-full m-5 lg:ml-60 lg:mr-60"
          method="post"
          onSubmit={handleSubmit}
        >
          <textarea
            ref={data}
            type="text"
            name="prompt"
            className="bg-transparent w-full h-auto p-2 outline-none"
            rows="1"
            placeholder="Ask me anything !!"
          />
          <button className="hover:scale-105 duration-200">
            <AiOutlineSend size={30} color="#fff" />
          </button>
        </form>
      </div>
    </div>
  );
};
