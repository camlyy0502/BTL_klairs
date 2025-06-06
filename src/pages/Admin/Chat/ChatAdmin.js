import React, { useState, useEffect, useRef } from "react";
import "./chatbotadmin.css";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import AccountApi from "../../../Api/Account/AccountApi";
import AdminApi from "../../../Api/Admin/AdminApi";


function Chat() {
    const [userData, setUserData] = useState({});
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await AccountApi.info();
                setUserData(res);
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

    const [users, setUserHaveChat] = useState([]);
    const [userList, setUserList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter userList based on search term
    const filteredUserList = userList.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- INTERVAL lấy lại danh sách tài khoản đã từng chat ---
    useEffect(() => {
        const getUserHaveChat = async () => {
            try {
                const res = await AdminApi.listUserHaveChat();
                setUserHaveChat(res);
                setUserList(res);
            } catch (error) {
                console.error("Failed to get user info:", error);
            }
        };
        getUserHaveChat();
        const interval = setInterval(getUserHaveChat, 10000); // 10s
        return () => clearInterval(interval);
    }, []);

    const [messagesMap, setMessagesMap] = useState({}); // { [userEmail]: [messages] }
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const [username, setUsername] = useState('');
    const stompClientAdminRef = useRef(null);
    const [isWSConnected, setIsWSConnected] = useState(false);
    const sendMessageWS = () => {
        const stompClientAdmin = stompClientAdminRef.current;
        if (!stompClientAdmin) {
            console.warn('STOMP client is not connected yet');
            return;
        }

        // Kiểm tra input có nội dung không
        if (!input.trim()) {
            return;
        }

        const payload = {
            sender: userData.username,
            recipient: username,
            message: input,
        };

        stompClientAdmin.publish({
            destination: '/app/chat-admin',
            body: JSON.stringify(payload),
        });

        // Chỉ cập nhật messagesMap, KHÔNG gọi setMessages ở đây
        setMessagesMap(prev => {
            const prevMsgs = prev[username] || [];
            const newMsgs = [...prevMsgs, {
                id: prevMsgs.length + 1,
                message: input,
                sender: userData.username,
                sent_at: new Date().toISOString()
            }];
            return {
                ...prev,
                [username]: newMsgs
            };
        });
        // Đưa user lên đầu danh sách sau khi gửi tin nhắn
        setUserList(prevList => {
            const idx = prevList.findIndex(u => u.email === username);
            if (idx > 0) {
                const updated = [...prevList];
                const [moved] = updated.splice(idx, 1);
                updated.unshift(moved);
                return updated;
            }
            return prevList;
        });
        setInput('');
    };


    const getChatHisoty = async (email) => {
        try {
            const res = await AdminApi.chatHistoty(email);
            setMessagesMap(prev => ({
                ...prev,
                [email]: res
            }));
            setMessages(res);
        } catch (error) {
            console.error("Failed to get user info:", error);
        }
    };


    const [unreadCounts, setUnreadCounts] = useState({});
    const subscribedUsersRef = useRef({});

    // --- WebSocket: chỉ mở 1 kết nối, mỗi user chỉ subscribe 1 lần ---
    useEffect(() => {
        if (!userData.username) return;
        const socketAdmin = new SockJS(process.env.REACT_APP_API + '/ws');
        const stompClientAdmin = new Client({
            webSocketFactory: () => socketAdmin,
            onConnect: () => setIsWSConnected(true),
            onDisconnect: () => setIsWSConnected(false),
            debug: (str) => {},
        });
        stompClientAdminRef.current = stompClientAdmin;
        stompClientAdmin.activate();
        return () => {
            stompClientAdmin.deactivate();
            subscribedUsersRef.current = {};
            setIsWSConnected(false);
        };
    }, [userData.username]);

    useEffect(() => {
        if (!isWSConnected || !stompClientAdminRef.current) return;
        const stompClientAdmin = stompClientAdminRef.current;
        userList.forEach(user => {
            if (!subscribedUsersRef.current[user.email]) {
                const sub = stompClientAdmin.subscribe(`/user/${user.email}/queue/messages`, async (msg) => {
                    const payload = JSON.parse(msg.body);
                    // Nếu tin nhắn gửi đi là của admin, không cần cập nhật
                    if (payload.sender === "admin@gmail.com") {
                        return;
                    }
                    setMessagesMap(prev => {
                        const prevMsgs = prev[user.email] || [];
                        return {
                            ...prev,
                            [user.email]: [...prevMsgs, {
                                id: prevMsgs.length + 1,
                                message: payload.message,
                                sender: payload.sender,
                                sent_at: new Date().toISOString()
                            }]
                        };
                    });
                    // Đếm tin nhắn chưa đọc
                    if (user.email !== username) {
                        setUnreadCounts(prev => ({
                            ...prev,
                            [user.email]: (prev[user.email] || 0) + 1
                        }));
                    } else {
                        setUnreadCounts(prev => ({ ...prev, [user.email]: 0 }));
                    }
                    // Đưa user lên đầu danh sách nếu có tin nhắn mới
                    setUserList(prevList => {
                        console.log("prevList", prevList);
                        const idx = prevList.findIndex(u => u.email === user.email);
                        if (idx > 0) {
                            const updated = [...prevList];
                            const [moved] = updated.splice(idx, 1);
                            updated.unshift(moved);
                            return updated;
                        }
                        return prevList;
                    });
                });
                subscribedUsersRef.current[user.email] = sub;
            }
        });
        // Unsubscribe các user không còn trong userList
        Object.keys(subscribedUsersRef.current).forEach(email => {
            if (!userList.some(u => u.email === email)) {
                subscribedUsersRef.current[email].unsubscribe();
                delete subscribedUsersRef.current[email];
            }
        });
    }, [userList, isWSConnected, username]);

    // When selecting a user, show their messages
    const selectUser = (userId) => {
        const user = userList.find(u => u.id === userId);
        setSelectedUser(userId);
        setUsername(user.email);
        setMessages(messagesMap[user.email] || []);
        setUnreadCounts(prev => ({ ...prev, [user.email]: 0 }));
    };

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);

    // Polling: fetch selected user's chat history every 1 seconds
    useEffect(() => {
        if (!selectedUser) return;
        const user = userList.find(u => u.id === selectedUser);
        if (!user) return;
        const interval = setInterval(() => {
            getChatHisoty(user.email);
        }, 10000); // 10s
        return () => clearInterval(interval);
    }, [selectedUser, userList]);
    
    // When a new message arrives for the selected user, update messages
    useEffect(() => {
        if (selectedUser) {
            const user = userList.find(u => u.id === selectedUser);
            if (user) {
                setMessages(messagesMap[user.email] || []);
            }
        }
    }, [messagesMap, selectedUser, userList]);

    return (
        <div className="container chat-container">
            <div className="row chat-box w-100">
                <div className="col-3 user-list">
                    <div style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                        <div className='search position-relative'>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Tìm kiếm người dùng..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ 
                                    paddingRight: '30px',
                                    paddingLeft: '12px',
                                    background: '#c4daf3',
                                    border: 'none',
                                    borderRadius: '20px',
                                    height: '36px'
                                }}
                            />
                            <i 
                                className="fas fa-search" 
                                style={{ 
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#62677399'
                                }}
                            ></i>
                        </div>
                    </div>
                    <ul className="list-group mt-4">
                        {filteredUserList.map((user) => (
                            <li key={user.id} 
                                className={`list-group-item ${selectedUser === user.id ? "active" : ""}`} 
                                onClick={() => {
                                    selectUser(user.id);
                                    getChatHisoty(user.email);
                                    setSelectedUserEmail(user.email);
                                }}>
                                <img src={user.avatar ? user.avatar : "https://smilemedia.vn/wp-content/uploads/2023/07/tao-dang-chup-anh-hoang-hon-7.jpeg"} alt="avatar" className="avatar" />
                                <span className="user-name">{user.email}</span>
                                {unreadCounts[user.email] > 0 && (
                                    <span className="badge bg-danger ms-2">{unreadCounts[user.email]}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-9 chat-section">
                    <div className="chat-header">
                        {selectedUser && (
                            <img src={(users.find((u) => u.id === selectedUser)?.avatar) || "https://smilemedia.vn/wp-content/uploads/2023/07/tao-dang-chup-anh-hoang-hon-7.jpeg"} alt="avatar" className="avatar" />
                        )}
                        {selectedUser ? users.find((u) => u.id === selectedUser)?.email : "Chọn người để chat"}
                    </div>                    <div className="chat-body" ref={chatRef}>
                        {messages.map((msg, index) => {
                            // Xử lý thời gian tin nhắn
                            let displayTime = '';
                            if (msg.sent_at) {
                                const messageDate = new Date(msg.sent_at);
                                const today = new Date();
                                const yesterday = new Date(today);
                                yesterday.setDate(yesterday.getDate() - 1);
                                
                                const timeString = messageDate.toLocaleTimeString('vi-VN', { 
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                });
                                
                                if (messageDate.toDateString() === today.toDateString()) {
                                    displayTime = timeString; // Hôm nay chỉ hiển thị giờ
                                } else if (messageDate.toDateString() === yesterday.toDateString()) {
                                    displayTime = `Hôm qua ${timeString}`; // Hôm qua
                                } else {
                                    const dateString = messageDate.toLocaleDateString('vi-VN');
                                    displayTime = `${dateString} ${timeString}`; // Ngày khác
                                }
                            } else {
                                displayTime = 'Vừa xong'; // Tin nhắn mới không có thời gian
                            }

                            return (
                                <div key={index} className={`messageuadmin messageadmin ${msg.sender} ${msg.sender === selectedUserEmail ? "mineadmin" : "theirsadmin"}`}>
                                    <div className="message-content">{msg.message}</div>
                                    <div className="message-time" style={{fontSize: '0.75em', color: '#888', marginTop: '4px'}}>
                                        {displayTime}
                                    </div>
                                </div>
                            );
                        })}
                    </div>                    {selectedUser && (
                        <div className="chat-footer">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Nhập tin nhắn..." 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && input.trim()) {
                                        sendMessageWS();
                                    }
                                }}
                            />
                            <button 
                                className="btn btn-primary" 
                                onClick={sendMessageWS}
                                disabled={!input.trim()}
                            >
                                Gửi
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Chat