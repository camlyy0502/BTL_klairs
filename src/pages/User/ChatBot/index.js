import { useState, useEffect, useRef } from "react";
import "./chatbot.css";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import AccountApi from "../../../Api/Account/AccountApi";

export default function ChatBot() {
    const [userData, setUserData] = useState({});
    
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await AccountApi.info();
                setUserData(res);
                setUsername(res.username);
            } catch (error) {
                console.error("Failed to get user info:", error);
                // If unauthorized or cookie is invalid, clear it
                if (error.response?.status === 401) {
                    setUserData(null);
                }
            }
        };
        getUser();
    }, []);

    const [showNotification, setShowNotification] = useState(false);
    const [messages, setMessages] = useState([
        // { id: 1, text: "Shop Klairs xin chào. Bạn đang tìm sản phẩm nào ạ?", sender: "system", replyTo: null },
    ]);

    const [input, setInput] = useState("");
    const [replyMessage, setReplyMessage] = useState(null);
    const chatRef = useRef(null);

    useEffect(() => {
        const getChatHisoty = async () => {
            try {
                const res = await AccountApi.chatHistoty();
                setMessages(res);
            } catch (error) {
                console.error("Failed to get user info:", error);
                // If unauthorized or cookie is invalid, clear it
                if (error.response?.status === 401) {
                    setUserData(null);
                }
            }
        };
        getChatHisoty();
        const interval = setInterval(getChatHisoty, 1000); // fetch every 5 seconds
        return () => clearInterval(interval);
    }, []);
    const [username, setUsername] = useState('');
    const [connected, setConnected] = useState(false);

    const stompClientRef = useRef(null);

    const connect = () => {
        const socket = new SockJS(process.env.REACT_APP_API + '/ws');
        const stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            console.log('Connected to WebSocket');
            stompClient.subscribe(`/user/${username}/queue/messages`, (msg) => {
                const payload = JSON.parse(msg.body);
                console.log('Payload:', payload);
                setMessages((prev) => [...prev, { id: prev.length + 1, message: payload.message, sender: payload.sender }]);
                setInput('');
            });
            
            setConnected(true);
        },
        debug: (str) => console.log(str, connected),
        });

        stompClientRef.current = stompClient;
        stompClient.activate();
    };
    const sendMessageWS = () => {
        const stompClient = stompClientRef.current;
        if (!stompClient || !connected) {
            console.warn('STOMP client is not connected yet');
            return;
        }

        const payload = {
            sender: username,
            recipient: 'admin@gmail.com',
            message: input,
        };

        stompClient.publish({
            destination: '/app/chat',
            body: JSON.stringify(payload),
        });

        setInput('');
    };



    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div>
            <div className="zalo-bt">
                <i 
                    className="fas fa-message" 
                    style={{ color: '#fff' }}
                    onClick={() => {
                        setShowNotification(!showNotification);
                        if (!connected) {
                            connect();
                        }
                    }}
                ></i>
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
                            {messages.length === 0 ? (
                                <div className="messageu message system mine">
                                    Shop Klairs xin chào. Bạn đang tìm sản phẩm nào ạ?
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`messageu message ${msg.sender} ${msg.sender === userData.username ? "theirs" : "mine"}`} >
                                        {msg.replyTo && (
                                            <div className="reply-boxu">
                                                <span className="reply-textu">{msg.replyTo}</span>
                                            </div>
                                        )}
                                        {msg.message}
                                    </div>
                                ))
                            )}
                        </div>
                        {replyMessage && (
                            <div className="replying-tou">
                                <span>Đang trả lời: {replyMessage.text}</span>
                            </div>
                        )}
                        <div className="chat-footeru">
                            <input
                                type="text" 
                                className="chat-inputu"
                                placeholder="Aa"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && input.trim() !== "") {
                                        sendMessageWS();
                                    }
                                }}
                            />
                            <i className="fas fa-paper-plane icon send-btnu" disabled={!input} onClick={sendMessageWS}></i>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
