import { createContext, useState } from "react";
import run from "../config/gemini";

export const context = createContext();

const ContextProvider = (props) => {

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  let response; 
  const delayPara =(index,nextWord) => {
    setTimeout(() => {
        setResultData(prev=>prev+nextWord)
    }, 75*index);
  }
  const newChat =() => {
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    if (prompt !==undefined){
        response =await run(prompt);
        setRecentPrompt(prompt)
    }
    else{
        setPrevPrompts(prev=> [...prev,input])
        setRecentPrompt(input)
        response=await run(input)
    }
    setRecentPrompt(input);
    setPrevPrompts(prev=>[...prev,input])

    // Initialize newArray as an empty string
    let responseArray = response.split("**");
    let newArray = "";  
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newArray += responseArray[i];
      } else {
        newArray += "<b>" + responseArray[i] + "</b>";
      }
    }

    // Replace '*' with '<br/>'
    let newResponse2 = newArray.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for(let i=0; i<newResponseArray.length;i++){
        const nextWord = newResponseArray[i];
        delayPara(i,nextWord+" ")
    }

    // Set the final formatted response data
    setResultData(newResponse2);

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <context.Provider value={contextValue}>
      {props.children}
    </context.Provider>
  );
};

export default ContextProvider;
