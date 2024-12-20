import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/employee/EChat.module.css";
import Header from "../../components/E_Header";
import imgC from "../../assets/Image_C/avt.png";
import { socket, userId, role } from "../../services/socket"; // Import the WebSocket connection and userId
import { markMessagesAsRead } from "../../services/messageServices"; // Import API  services
import URL from "../../url";
const CI_E_Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatData, setChatData] = useState([]); // Define chatData
  const fetchUserName = async (userId) => {
    try {
      const response = await axios.get(`${URL}/UM/get-customer/${userId}`);
      const name = `${response.data.first_name} ${response.data.last_name}`;
      return name; // Adjust based on your API response structure
    } catch (error) {
      console.error(`Failed to fetch user name for userId ${userId}`, error);
      return `User ${userId}`;
    }
  };
  const getChatRooms = async () => {
    try {
      const response = await axios.get(`${URL}/CI/rooms`);
      const chatRooms = await Promise.all(
        response.data.map(async (room) => {
          const name = await fetchUserName(room.room_id);
          return {
            id: room.room_id,
            name: name, // Use fetched user name
            messages: [],
          };
        })
      );
      setChatData(chatRooms);
    } catch (error) {
      console.error("Failed to load chat rooms", error);
    }
  };

  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);  

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    } else if (role !== "employee") {
      navigate("/home");
    } else {
      getChatRooms();
    }
  }, []);

  const fetchMessages = async (roomId) => {
    try {
      const response = await axios.get(`${URL}/CI/${roomId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      // Join the selected room
      socket.emit("join_room", { id: userId, room: selectedChat });
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      console.log("Got da gud shit dawgs:", message);
      console.log("selected chat is:", selectedChat);
      if (
        message.receiver_id === selectedChat ||
        message.sender_id === 2 ||
        message.receiver_id === message.sender_id
      ) {
        setMessages((prev) => [...prev, message]);
        console.log("this message is setted");
      }
      updateChatData(message);
      getChatRooms();
    };

    socket.on("receive_message", handleReceiveMessage);
    // Clean up listener on component unmount
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  const updateChatData = (message) => {
    setChatData((prevChatData) => {
      const updatedChatData = prevChatData.map((chat) => {
        if (chat.id === message.receiver_id || chat.id === message.sender_id) {
          return {
            ...chat,
            messages: [...chat.messages, message],
          };
        }
        return chat;
      });

      // Sort chat rooms by the timestamp of the newest message
      updatedChatData.sort((a, b) => {
        const aLastMessage = a.messages[a.messages.length - 1];
        const bLastMessage = b.messages[b.messages.length - 1];
        return (
          new Date(bLastMessage?.timestamp) - new Date(aLastMessage?.timestamp)
        );
      });

      return updatedChatData;
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        token: localStorage.getItem("authToken"),
        room: selectedChat,
        message: newMessage,
        sender_id: userId,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      socket.emit("send_message", messageData);
      //setMessages((prev) => [...prev, { ...messageData, content: newMessage }]); // Update the state directly with the correct content
      setNewMessage(""); // Clear input field
      getChatRooms();
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await markMessagesAsRead(selectedChat, selectedChat);
      console.log("Messages marked as read");
    } catch (error) {
      console.error("Failed to mark messages as read");
    }
  };

  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
    socket.emit("join_room", { room: chatId });
    handleMarkAsRead();
  };

  const filteredChats = chatData.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className={styles.chatContainer}>
        {/* Sidebar */}
        <div className={styles.chatSidebar}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className={styles.chatList}>
            {filteredChats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`${styles.chatItem} ${
                  selectedChat === chat.id ? styles.active : ""
                } ${chat.seen ? styles.seen : ""}`}
              >
                <img src={imgC} alt="avatar" className={styles.avatar} />
                <div className={styles.chatInfo}>
                  <div className={styles.infoCus}>
                    <p className={styles.chatName}>{chat.name}</p>
                  </div>
                  <p className={styles.chatPreview}>
                    {chat.messages[chat.messages.length - 1]?.content}
                  </p>
                </div>
              </li>
            ))}
            {filteredChats.length === 0 && (
              <p className={styles.noResult}>No users found</p>
            )}
          </ul>
        </div>

        {/* Chat Content */}
        <div className={styles.chatContent}>
          {selectedChat ? (
            <>
              <div className={styles.infoCustomer}>
                <img src={imgC} alt="avatar" className={styles.avatar} />
                <p className={styles.nameCustomer}>
                  {chatData.find((chat) => chat.id === selectedChat).name}
                </p>
              </div>
              <hr className={styles.divider} />
              <div className={styles.chatMessages}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${
                      message.sender_id === userId
                        ? styles.sent
                        : styles.received
                    }`}
                  >
                    <p className={styles.messageText}>{message.content}</p>
                    <span className={styles.messageTime}>
                      {message.timestamp}
                    </span>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>              
              <form
                onSubmit={handleSendMessage}
                className={styles.messageInputContainer}
              >
                <input
                  name="message"
                  placeholder="Type a message..."
                  className={styles.messageInput}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className={styles.sendButton}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <p className={styles.noChatSelected}>
              Please select a chat to view messages.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CI_E_Chat;
