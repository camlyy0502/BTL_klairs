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

    useEffect(() => {
        const getUserHaveChat = async () => {
            try {
                const res = await AdminApi.listUserHaveChat();
                setUserHaveChat(res);
                setUserList(res); // set userList from users fetched
            } catch (error) {
                console.error("Failed to get user info:", error);
            }
        };
        getUserHaveChat();
        const interval = setInterval(getUserHaveChat, 1000); // fetch every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Keep userList in sync with users if users change
    useEffect(() => {
        setUserList(users);
    }, [users]);

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
    const sendMessageWS = () => {
        const stompClientAdmin = stompClientAdminRef.current;
        if (!stompClientAdmin) {
            console.warn('STOMP client is not connected yet');
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

        // Immediately append the sent message to the chat
        setMessagesMap(prev => {
            const prevMsgs = prev[username] || [];
            const newMsgs = [...prevMsgs, { id: prevMsgs.length + 1, message: input, sender: userData.username }];
            setMessages(newMsgs);
            return {
                ...prev,
                [username]: newMsgs
            };
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

    // Global WebSocket connection for all users
    useEffect(() => {
        const socketAdmin = new SockJS(process.env.REACT_APP_API + '/ws');
        const stompClientAdmin = new Client({
            webSocketFactory: () => socketAdmin,
            onConnect: () => {
                // Subscribe to all users in userList, including new ones
                userList.forEach(user => {
                    if (!subscribedUsersRef.current[user.email]) {
                        stompClientAdmin.subscribe(`/user/${user.email}/queue/messages`, async (msg) => {
                            const payload = JSON.parse(msg.body);
                            // Ignore messages sent by the admin themselves to prevent duplicates
                            if (payload.sender === userData.username) return;
                            // If the sender is not in userList, reload userList from API
                            if (!userList.some(u => u.email === payload.sender)) {
                                try {
                                    const res = await AdminApi.listUserHaveChat();
                                    setUserHaveChat(res);
                                    setUserList(res);
                                } catch (error) {
                                    console.error("Failed to reload user list:", error);
                                }
                            }
                            // Update messagesMap for this user
                            setMessagesMap(prev => {
                                const prevMsgs = prev[user.email] || [];
                                return {
                                    ...prev,
                                    [user.email]: [...prevMsgs, { id: prevMsgs.length + 1, message: payload.message, sender: payload.sender }]
                                };
                            });
                            // If not currently selected user, increment unread count and move to top
                            if (user.email !== username) {
                                setUnreadCounts(prev => ({
                                    ...prev,
                                    [user.email]: (prev[user.email] || 0) + 1
                                }));
                            }
                            setUserList(prevList => {
                                const idx = prevList.findIndex(u => u.email === user.email);
                                if (idx > 0) {
                                    const updated = [...prevList];
                                    const [moved] = updated.splice(idx, 1);
                                    updated.unshift(moved);
                                    return updated;
                                }
                                return prevList;
                            });
                            // If currently selected user, reset unread (KHÔNG gọi setMessages ở đây)
                            if (user.email === username) {
                                setUnreadCounts(prev => ({ ...prev, [user.email]: 0 }));
                                setInput('');
                            }
                        });
                        subscribedUsersRef.current[user.email] = true;
                    }
                });
            },
            debug: (str) => console.log(str),
        });
        stompClientAdminRef.current = stompClientAdmin;
        stompClientAdmin.activate();
        return () => {
            stompClientAdmin.deactivate();
            subscribedUsersRef.current = {};
        };
    }, [userList, username, userData.username]);

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
        }, 1000); // 1 seconds
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
                        <div className='search' style={{ marginLeft: '12px' }}>
                            <input type="text" placeholder="Search" style={{ outline: 'none', border: 'none', position: 'relative', background: '#c4daf3' }}></input>
                            <span style={{ color: '#62677399', position: 'absolute', left: '520px' }}><i class="fas fa-search"></i></span>
                        </div>
                    </div>
                    <ul className="list-group mt-4 ">
                        {userList.map((user) => (
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
                    </div>
                    <div className="chat-body" ref={chatRef}>
                        {messages.map((msg, index) => (
                            <div key={index}  className={`messageuadmin messageadmin ${msg.sender} ${msg.sender === selectedUserEmail ? "mineadmin" : "theirsadmin"}`} >
                                {msg.message}
                            </div>
                        ))}
                    </div>
                    {selectedUser && (
                        <div className="chat-footer">
                            <input type="text" className="form-control" placeholder="Nhập tin nhắn..." value={input} onChange={(e) => setInput(e.target.value)} />
                            <button className="btn btn-primary" onClick={sendMessageWS}>Gửi</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Chat