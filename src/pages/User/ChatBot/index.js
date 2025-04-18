import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function ChatBot() {
    const [showNotification, setShowNotification] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Bạn đang tìm sản phẩm nào hôm nay?", sender: "other", replyTo: null },
        { id: 2, text: "Bạn cần hỗ trợ gì ạ ", sender: "other", replyTo: null },
    ]);
    const [input, setInput] = useState("");
    const [replyMessage, setReplyMessage] = useState(null);
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() !== "") {
            const newMessage = {
                id: messages.length + 1,
                text: input,
                sender: "user",
                replyTo: replyMessage,
            };
            setMessages([...messages, newMessage]);
            setInput("");
            setReplyMessage(null);
        }
    };

    return (
        <div>
            <div className="zalo-bt">
                <i class="fas fa-message" style={{ color: '#fff' }}
                    onClick={() => setShowNotification(!showNotification)}></i>
                {showNotification && (
                    <div className="chat-boxu">
                        {/* Header */}
                        <div className="chat-headeru">
                            <img src="https://www.klairscosmetics.com/wp-content/uploads/2014/11/DearKlairs-BLACK.jpg" alt="avatar" className="chat-avataru" />
                            <div>
                                <strong>Chatbot</strong>
                                <p className="status-textu">Thường trả lời ngay</p>
                            </div>
                            {/* <div className="chat-icons">
                                <FaPhone className="icon" />
                                <FaVideo className="icon" />
                                <FaTimes className="icon" />
                            </div> */}
                        </div>

                        {/* Body */}
                        <div className="chat-bodyu" ref={chatRef} style={{ overflowY: "auto", maxHeight: "400px" }}>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`messageu ${msg.sender}`}>
                                    {msg.replyTo && (
                                        <div className="reply-boxu">
                                            <span className="reply-textu">{msg.replyTo.text}</span>
                                        </div>
                                    )}
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* Reply Box */}
                        {replyMessage && (
                            <div className="replying-tou">
                                <span>Đang trả lời: {replyMessage.text}</span>
                                {/* <FaTimes className="close-reply" onClick={() => setReplyMessage(null)} /> */}
                            </div>
                        )}

                        {/* Footer */}
                        <div className="chat-footeru">
                            <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
                            <input
                                type="text"
                                className="chat-inputu"
                                placeholder="Aa"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <i className="fas fa-paper-plane icon send-btnu" onClick={sendMessage}></i>
                        </div>
                    </div>
                )}
            </div>



        </div>
    );
}
