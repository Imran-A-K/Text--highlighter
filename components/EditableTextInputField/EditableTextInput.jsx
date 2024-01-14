"use client";
import React, { useState, useRef, useEffect } from "react";

const EditableDiv = () => {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({
    top: 0,
    left: 0,
  });

  const [lastWord, setLastWord] = useState("");
  const divRef = useRef(null);
  const suggestionBoxRef = useRef(null);
  const suggestions = ["tomato", "tom cruise", "tetul", "technology"];

  useEffect(() => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(divRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, [message]);

  const handleContentChange = (e) => {
    const newMessage = e.currentTarget.textContent.replace(/\n/g, "");
    setMessage(newMessage);
    const words = newMessage.trim().split(/\s+/);
    const lastWord = words[words.length - 1];
    if (newMessage.endsWith(" ")) {
      setLastWord("");
      setShowSuggestions(false);
    } else {
      setLastWord(lastWord);
    }

    for (let index in suggestions) {
      if (suggestions[index].startsWith(lastWord)) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSuggestionPosition({
            top: 40,
            left: rect.left + window.scrollX - 90,
          });
        }

        lastWord === suggestions[index]
          ? setShowSuggestions(false)
          : setShowSuggestions(true);

        break;
      } else {
        setShowSuggestions(false);
      }
    }

    const isTomatoPresent = newMessage.includes("tomato");
    if (isTomatoPresent) {
      const formattedMessage = newMessage.replace(
        /(tomato)/g,
        '<span style="color: red;">$1</span>'
      );
      divRef.current.innerHTML = formattedMessage;
    }
    if (newMessage.endsWith(" ")) {
      setLastWord("");
      setShowSuggestions(false);
    } else {
      setLastWord(lastWord);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSendMessage = () => {
    console.log("Sending message:", message);

    setMessage("");

    divRef.current.innerHTML = "";
    setShowSuggestions(false);
  };

  const handleClearMessage = () => {
    divRef.current.innerHTML = "";
    setMessage("");

    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    const newMessage = message + suggestion.substring(lastWord.length);
    let previousSentenceStorageArray = message.split(" ");
    const isTomatoPresent = newMessage.includes("tomato");
    if (isTomatoPresent) {
      const formattedMessage = newMessage.replace(
        /(tomato)/g,
        '<span style="color: red;">$1</span>'
      );
      divRef.current.innerHTML = formattedMessage;
    }
    divRef.current.focus();

    setMessage(newMessage);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col p-4 w-full bg-gray-400 rounded-lg relative">
      <div
        ref={divRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        tabIndex="0"
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring focus:ring-blue-600"
      />

      {showSuggestions && (
        <div
          ref={suggestionBoxRef}
          style={{ top: suggestionPosition.top, left: suggestionPosition.left }}
          className="absolute bg-white border border-gray-300 rounded-md mt-2 p-2"
        >
          {suggestions.map((suggestion) => {
            let prefix = "";
            let rest = "";
            if (suggestion.startsWith(lastWord)) {
              prefix = lastWord;
              rest = suggestion.substring(lastWord.length);
              return (
                <div
                  key={suggestion}
                  className="cursor-pointer hover:bg-gray-100 p-1"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="text-blue-500">{prefix}</span>
                  {rest}
                </div>
              );
            }
          })}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-gray-500">{message.length} characters</span>
        <div>
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mr-2"
          >
            Send
          </button>
          <button
            onClick={handleClearMessage}
            className="px-4 py-2 text-gray-500 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-blue-300"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableDiv;
