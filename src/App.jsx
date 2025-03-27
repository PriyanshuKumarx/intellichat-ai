import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  FaPaperPlane,
  FaSmile,
  FaMoon,
  FaSun,
  FaTrash,
  FaRobot,
} from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import "./App.css";

const ChatInterface = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const chatHistoryRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const sendMessage = useCallback(async () => {
    if (!userMessage.trim()) return;

    const userMessageData = {
      sender: "user",
      message: userMessage,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessageData]);
    setIsBotTyping(true);
    setUserMessage("");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();

      const botMessageData = {
        sender: "bot",
        message: data.error ? `Error: ${data.error}` : data.response,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, botMessageData]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          message: "Failed to send message.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  }, [userMessage]);

  const handleEmojiClick = useCallback((emoji) => {
    setUserMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  }, []);

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(".emoji-btn")
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const backgroundElements = useMemo(
    () => ({
      binaryRain: [...Array(30)].map((_, i) => ({
        left: `${(i * 3.5) % 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${10 + Math.random() * 15}s`,
        bits: [...Array(15)].map(() => ({
          opacity: 0.2 + Math.random() * 0.5,
          animationDelay: `${Math.random() * 2}s`,
          value: Math.random() > 0.5 ? "1" : "0",
        })),
      })),
      nodes: [...Array(12)].map((_, i) => ({
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        animationDuration: `${15 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 5}s`,
      })),
      particles: [...Array(25)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${2 + Math.random() * 4}px`,
        height: `${2 + Math.random() * 4}px`,
      })),
    }),
    []
  );

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      {/* AI Background Elements */}
      <div className="ai-background">
        {/* Binary Rain */}
        <div className="binary-rain-container">
          {backgroundElements.binaryRain.map((column, i) => (
            <div
              key={`binary-${i}`}
              className="binary-column"
              style={{
                left: column.left,
                animationDelay: column.animationDelay,
                animationDuration: column.animationDuration,
              }}
            >
              {column.bits.map((bit, j) => (
                <span
                  key={`bit-${j}`}
                  className="binary-bit"
                  style={{
                    opacity: bit.opacity,
                    animationDelay: bit.animationDelay,
                  }}
                >
                  {bit.value}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Floating Nodes */}
        {backgroundElements.nodes.map((node, i) => (
          <div
            key={`node-${i}`}
            className="ai-node"
            style={{
              left: node.left,
              top: node.top,
              animationDuration: node.animationDuration,
              animationDelay: node.animationDelay,
            }}
          >
            <div className="node-core"></div>
            <div className="node-connection"></div>
          </div>
        ))}

        {/* Particle Network */}
        <div className="particle-network">
          {backgroundElements.particles.map((particle, i) => (
            <div
              key={`particle-${i}`}
              className="network-particle"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.width,
                height: particle.height,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="chat-box">
        <div className="chat-header glass">
          <div className="header-left">
            <div className="animated-icon">
              <FaRobot className="bot-icon" />
              <div className="pulse-effect"></div>
            </div>
            <h2>
              IntelliChat <span>AI</span>
            </h2>
          </div>
          <div className="header-controls">
            <button
              className="dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button
              className="clear-btn"
              onClick={clearChatHistory}
              title="Clear conversation"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className="chat-history" ref={chatHistoryRef}>
          {chatHistory.length === 0 && (
            <div className="welcome-message">
              <h3>Welcome to IntelliChat AI</h3>
              <p>Start a conversation or try these examples:</p>
              <div className="example-questions">
                <button
                  onClick={() =>
                    setUserMessage("Explain complex systems in simple terms")
                  }
                >
                  Complex Systems
                </button>
                <button
                  onClick={() =>
                    setUserMessage("How do modern AI technologies work?")
                  }
                >
                  AI Technologies
                </button>
                <button
                  onClick={() =>
                    setUserMessage("Discuss latest tech innovations")
                  }
                >
                  Tech Innovations
                </button>
              </div>
            </div>
          )}

          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.sender}`}>
              <div className="message-bubble">
                <div className="message-content">{chat.message}</div>
                <div className="message-footer">
                  <span className="timestamp">
                    {chat.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isBotTyping && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <span>IntelliChat is thinking...</span>
            </div>
          )}
        </div>

        <div className="chat-input-container glass">
          <div className="chat-input-wrapper">
            <button
              className="emoji-btn"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Emoji picker"
            >
              <FaSmile />
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-container" ref={emojiPickerRef}>
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiClick}
                  theme={darkMode ? "dark" : "light"}
                  previewPosition="none"
                />
              </div>
            )}
            <input
              type="text"
              placeholder="Message IntelliChat..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!userMessage.trim()}
              title="Send message"
            >
              <FaPaperPlane />
            </button>
          </div>
          <p className="disclaimer">
            IntelliChat may occasionally generate inaccurate information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatInterface);
