import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";
import { toastErrorNotify } from "../helpers/ToastNotify";

const SOCKET_URL = process.env.REACT_SOCKET_URL || "http://localhost:5000";

const Messages = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Session check
  useEffect(() => {
    if (!token) navigate("/login");
    else setAuthToken(token);
  }, [token]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    const socketIo = io(SOCKET_URL, {
      auth: { token },
    });

    socketIo.on("connect", () => console.log("Connected to chat socket"));

    socketIo.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(socketIo);

    // Load initial messages
    fetchMessages();

    return () => {
      socketIo.disconnect();
    };
  }, [token]);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/messages");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      toastErrorNotify("Failed to load messages");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const msgData = {
        text: newMessage,
        sender: user.firstName || user.email,
      };
      await api.post("/messages", msgData);

      // Emit via socket for real-time
      socket.emit("send_message", msgData);

      setMessages((prev) => [...prev, msgData]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      toastErrorNotify("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex flex-col">
      <div className="max-w-3xl mx-auto flex-1 flex flex-col bg-white dark:bg-gray-800 rounded shadow p-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Team Chat
        </h2>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${
                msg.sender === (user.firstName || user.email)
                  ? "bg-red-100 dark:bg-red-700 self-end"
                  : "bg-gray-100 dark:bg-gray-700 self-start"
              }`}
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {msg.sender}:{" "}
              </span>
              <span className="text-gray-700 dark:text-gray-100">{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
