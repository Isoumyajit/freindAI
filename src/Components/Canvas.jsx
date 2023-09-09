import React, { useEffect } from "react";
import { useRef , useState} from "react";
import { AiOutlineSend } from "react-icons/ai";
import axios from "axios";
import "../Assets/Css/Chathead.css";
import { ServiceExpired } from "./ServiceExpired";

export const Canvas = () => {
  const [message, setMessage] = useState(false);
  const data = useRef();
  let form = null;
  let chatContainer = null;
  let loadInterval = null;
  // const baseURL = "https://chataibackendservice.onrender.com/";
  const baseURL = "http://localhost:3001/";

  useEffect(() => { 
    setMessage(true);
  }, [])
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
        else {
          element.innerHTML += text.charAt(index);
        }
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
    const response = await axios.post(
      baseURL,
      [{ prompt: data.current.value }],
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      }
    );
    clearInterval(loadInterval);
    form.reset();
    msgDiv.innerHTML = "";
    if (response.status === 200) {
      console.log(response);
      let returnedData = await response.data;
      const parsedData = returnedData.bot.trim();
      typingHandler(msgDiv, parsedData);
    } else if (response.status !== 200) {
      let err = await response.text();
      console.error(err);
      typingHandler(msgDiv, "Hey Ai Is Down right now");
    }
  };

  return (
    <div className="flex canvas bg-gray-700 max-w-full h-screen justify-center">
      <div className="absolute mt-10 md:mt-52">{message && <ServiceExpired />}</div>
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
