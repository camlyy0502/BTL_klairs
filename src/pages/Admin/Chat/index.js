import React, { useState, useEffect, useRef } from "react";
function Chat() {
    const users = [
        { id: 1, name: "HAHAHA", avatar: 'https://smilemedia.vn/wp-content/uploads/2023/07/tao-dang-chup-anh-hoang-hon-7.jpeg' },
        { id: 2, name: "Cẩm Ly", avatar: 'https://smilemedia.vn/wp-content/uploads/2023/07/tao-dang-chup-anh-hoang-hon-11.jpeg' },
        { id: 3, name: "MoriMori", avatar: 'https://smilemedia.vn/wp-content/uploads/2023/07/tao-dang-chup-anh-hoang-hon-11.jpeg' }
    ];
    const messagesData = {
        1: [{ text: "Xin chào! 😊", sender: "user" }, { text: "Chào bạn!", sender: "bot" }],
        2: [{ text: "Xin chào, cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi đã nhận được tin nhắn của bạn và sẽ sớm trả lờilời?", sender: "user" }],
        3: [{ text: "Bạn cần tư vấn gì", sender: "bot" }]
    };
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const selectUser = (userId) => {
        setSelectedUser(userId);
        setMessages(messagesData[userId] || []);
    };

    const sendMessage = () => {
        if (input.trim() !== "" && selectedUser) {
            setMessages([...messages, { text: input, sender: "user" }]);
            setInput("");

            setTimeout(() => {
                setMessages((prevMessages) => [...prevMessages, { text: "OK bạn nhé!", sender: "other" }]);
            }, 1000);
        }
    };
    return (
        <div className="container chat-container">
            <div className="row chat-box w-100">
                {/* Danh sách bạn bè */}
                <div className="col-3 user-list">
                    <div style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                        <div className='search' style={{ marginLeft: '12px' }}>
                            <input type="text" placeholder="Search" style={{ outline: 'none', border: 'none', position: 'relative', background: '#c4daf3' }}></input>
                            <span style={{ color: '#62677399', position: 'absolute', left: '520px' }}><i class="fas fa-search"></i></span>
                        </div>
                    </div>
                    <ul className="list-group mt-4 ">
                        {users.map((user) => (
                            <li key={user.id} className={`list-group-item ${selectedUser === user.id ? "active" : ""}`} onClick={() => selectUser(user.id)}>
                                <img src={user.avatar} alt="avatar" className="avatar" />
                                <span className="user-name">{user.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Khung chat */}
                <div className="col-9 chat-section">
                    <div className="chat-header">
                        <img src={selectedUser ? users.find((u) => u.id === selectedUser)?.avatar : "Chọn người để chat"} alt="avatar" className="avatar" />
                        {selectedUser ? users.find((u) => u.id === selectedUser)?.name : "Chọn người để chat"}
                    </div>
                    <div className="chat-body" ref={chatRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    {selectedUser && (
                        <div className="chat-footer">
                            <input type="text" className="form-control" placeholder="Nhập tin nhắn..." value={input} onChange={(e) => setInput(e.target.value)} />
                            <button className="btn btn-primary" onClick={sendMessage}>Gửi</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Chat