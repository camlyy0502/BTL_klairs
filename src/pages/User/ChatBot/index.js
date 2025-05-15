import { useState, useEffect, useRef } from "react";
import "./chatbot.css";
import ChatBotApi from "../../../Api/ChatBot/ChatBotApi";
import { v4 as uuid4 } from 'uuid';
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
                setUuid(res.userId)
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

    const [uuid, setUuid] = useState(() => {
        const savedUuid = localStorage.getItem('session_id');
        if (savedUuid) return savedUuid;
        const newUuid = uuid4();
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

    const [username, setUsername] = useState('');
    const [chat, setChat] = useState([]);
    const [connected, setConnected] = useState(false);

    const stompClientRef = useRef(null);

    const connect = () => {
        const socket = new SockJS(process.env.REACT_APP_API + '/ws');
        const stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            stompClient.subscribe('/user/queue/messages', (msg) => {
                console.log('Received message:', msg);
            const payload = JSON.parse(msg.body);
            console.log('Payload:', payload);
            setChat((prev) => [...prev, { from: payload.sender, text: payload.content }]);
            });

            setConnected(true);
        },
        debug: (str) => console.log(str, connected),
        });

        stompClient.activate();
        stompClientRef.current = stompClient;
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

        setChat((prev) => [...prev, { from: 'You', text: input }]);
        setInput('');
    };

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
