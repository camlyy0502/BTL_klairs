import { useState, useEffect, useRef, use } from "react";
import "./chatbot.css";
import ChatBotApi from "../../../Api/ChatBot/ChatBotApi";

export default function ChatBot() {
    const [uuid, setUuid] = useState(() => {
        const savedUuid = localStorage.getItem('session_id');
        if (savedUuid) return savedUuid;
        const newUuid = crypto.randomUUID();
        localStorage.setItem('session_id', newUuid);
        return newUuid;
    });
    const [showNotification, setShowNotification] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Shop Klairs xin chào. Bạn đang tìm sản phẩm nào ạ?", sender: "system", replyTo: null },
        { id: 2, text: "leu leuuuuuuuuuuuuuuu", sender: "user", replyTo: null },
    ]);
    const [input, setInput] = useState("");
    const [replyMessage, setReplyMessage] = useState(null);
    const chatRef = useRef(null);

    // useEffect(() => {
    //     const listMessage = async () => {
    //         try {
    //             const response = await ChatBotApi.getChat({})
    //             setMessages(response.data);
    //         } catch (error) {
    //             console.error("Error fetching message:", error);
    //         }
    //     };
    //     listMessage();
    // }
    // )


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
                <i className="fas fa-message" style={{ color: '#fff' }}
                    onClick={() => setShowNotification(!showNotification)}></i>
                {showNotification && (
                    <div className="chat-boxu">
                        <div className="chat-headeru">
                            <img src="https://www.klairscosmetics.com/wp-content/uploads/2014/11/DearKlairs-BLACK.jpg" alt="avatar" className="chat-avataru" />
                            <div>
                                <strong>Chatbot</strong>
                                <p className="status-textu">Thường trả lời ngay</p>
                            </div>
                        </div>
                        <div className="chat-bodyu" ref={chatRef} style={{ overflowY: "auto", maxHeight: "400px" }}>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`messageu message ${msg.sender} ${msg.sender === "user" ? "theirs" : "mine"}`} >
                                {msg.replyTo && (
                                    <div className="reply-boxu">
                                        <span className="reply-textu">{msg.replyTo}</span>
                                    </div>
                                )}
                                {msg.text}
                                </div>
                            ))}
                        </div>
                        {replyMessage && (
                            <div className="replying-tou">
                                <span>Đang trả lời: {replyMessage.text}</span>
                            </div>
                        )}
                        <div className="chat-footeru">
                            {/* <i className="fas fa-list" style={{ marginRight: '8px' }}></i> */}
                            <input
                                type="text" 
                                className="chat-inputu"
                                placeholder="Aa"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && input.trim() !== "") {
                                        sendMessage();
                                    }
                                }}
                            />
                            <i className="fas fa-paper-plane icon send-btnu" onClick={sendMessage}></i>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
