import { useState, useEffect, useRef } from "react";
import "./chatbot.css";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import AccountApi from "../../../Api/Account/AccountApi";

export default function ChatBot() {
    const [userData, setUserData] = useState({});
    const [username, setUsername] = useState('');
    
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
    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");
    const [replyMessage, setReplyMessage] = useState(null);
    const chatRef = useRef(null);

    useEffect(() => {
        if (!username) return;
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
    const [connected, setConnected] = useState(false);

    const stompClientRef = useRef(null);

    const connect = () => {
        if (!username) return; // Không connect nếu chưa có username
        if (connected) return; // Nếu đã kết nối thì không kết nối lại
        const socket = new SockJS(process.env.REACT_APP_API + '/ws');
        const stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            try {
                stompClient.subscribe(`/user/${username}/queue/messages`, (msg) => {
                    try {
                        const payload = JSON.parse(msg.body);
                        setMessages((prev) => {
                            const newMsgs = [...prev, { id: prev.length + 1, message: payload.message, sender: payload.sender }];
                            // Tự động cuộn khi có tin nhắn mới
                            setTimeout(() => {
                                if (chatRef.current) {
                                    chatRef.current.scrollTop = chatRef.current.scrollHeight;
                                }
                            }, 0);
                            return newMsgs;
                        });
                        setInput('');
                    } catch (e) {
                        // ignore parse error
                    }
                });
                setConnected(true);
                // Tự động cuộn khi vừa kết nối xong (hiện toàn bộ lịch sử)
                setTimeout(() => {
                    if (chatRef.current) {
                        chatRef.current.scrollTop = chatRef.current.scrollHeight;
                    }
                }, 0);
            } catch (e) {
                setConnected(false);
            }
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            setConnected(false);
        },
        onWebSocketClose: () => {
            setConnected(false);
            setTimeout(() => {
                if (!connected) connect();
            }, 2000);
        },
        // debug: (str) => console.log(str, connected),
        });
        stompClientRef.current = stompClient;
        try {
            stompClient.activate();
        } catch (e) {
            // ignore activate error
        }
    };
    const sendMessageWS = () => {
        const stompClient = stompClientRef.current;
        if (!stompClient || !connected) {
            console.warn('STOMP client is not connected yet');
            return;
        }
        if (!input) return;
        const payload = {
            sender: username,
            recipient: 'admin@gmail.com',
            message: input,
        };
        try {
            stompClient.publish({
                destination: '/app/chat',
                body: JSON.stringify(payload),
            });
        } catch (e) {
            // ignore publish error
        }
        setInput('');
    };

    const handleAddToCart = async (productId) => {
        // Update localStorage with the specified format
        const cartKey = 'klairs_cart';
        let cart = { address_id: '', orders: [] };
        try {
            const stored = localStorage.getItem(cartKey);
            if (stored) {
                cart = JSON.parse(stored);
            }
            // Check if product already exists in cart
            const existing = cart.orders.find(item => item.product_id === productId);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.orders.push({ product_id: productId, quantity: 1 });
            }
            localStorage.setItem(cartKey, JSON.stringify(cart));
            setMessages((prev) => [
                ...prev,
                { id: prev.length + 1, message: `Đã thêm sản phẩm ${productId} vào giỏ hàng của bạn.`, sender: 'system' }
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { id: prev.length + 1, message: `Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.`, sender: 'system' }
            ]);
        }
    };

    const handleUserInput = async (inputText) => {
        const addToCartMatch = inputText.match(/^add (\d+) to cart$/i);
        if (addToCartMatch) {
            const productId = addToCartMatch[1];
            await handleAddToCart(productId);
            setInput("");
            return;
        }
        sendMessageWS();
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
                                onKeyPress={async (e) => {
                                    if (e.key === 'Enter' && input.trim() !== "") {
                                        await handleUserInput(input);
                                    }
                                }}
                            />
                            <i className="fas fa-paper-plane icon send-btnu" disabled={!input} onClick={async () => { if(input) await handleUserInput(input); }}></i>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
