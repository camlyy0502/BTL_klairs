import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import Login from '../../../../pages/User/Login';
import ChatBot from '../../../../pages/User/ChatBot';
import AccountApi from '../../../../Api/Account/AccountApi';
import { v4 as uuid4 } from 'uuid';

function Header() {

    const [showLogin, setShowLogin] = useState(false);
    const handleLogin = () => {
        setShowLogin(true);
    };
    const [uuid, setUuid] = useState(() => {
        const savedUuid = localStorage.getItem('session_id');
        if (savedUuid) return savedUuid;
        const newUuid = uuid4();
        localStorage.setItem('session_id', newUuid);
        return newUuid;
    });

    const handleLogout = async () => {
        try {
            const res = await AccountApi.logout();
            window.location.reload();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleClose = () => {
        setShowLogin(false);
    };
    const [isHidden, setIsHidden] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const [userData, setUserData] = useState({});
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await AccountApi.info();
                console.log(res);
                setUserData(res);
                setUuid(res.userId)
            } catch (error) {
                console.error("Failed to get user info:", error);
                // If unauthorized or cookie is invalid, clear it
                if (error.response?.status === 401) {
                    // localStorage.removeItem('cookie');
                    setUserData(null);
                }
            }
        };
        
        // Only try to get user info if we have a cookie
        
        getUser();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 90) {
                if (currentScrollY > lastScrollY) {
                    // Cuộn xuống → Header biến mất rồi trượt xuống lại
                    setIsHidden(true);
                    setTimeout(() => {
                        setIsFixed(true);
                        setIsHidden(false);
                    }, 300);
                }
            } else {
                // Cuộn lên đầu trang → Header trở về trạng thái ban đầu
                setIsFixed(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return (
        <>
            <ChatBot />
            <Login isVisible={showLogin} onClose={handleClose} />
            <div className={`container-fluid p-0 header ${isHidden ? "hidden" : ""} ${isFixed ? "fixed" : ""}`}>
                <div className='container h-100'>
                    <div className='custom-container h-100'>
                        <div className='row h-100 align-items-center'>
                            <div className='col-md-3'>
                                <Link to='/'>
                                    <img src='https://klairsvietnam.vn/wp-content/uploads/2020/07/logo-klairs.png' alt=""/>
                                </Link>
                            </div>
                            <div className='col-md-6 header-nav'>
                                <ul className='d-flex m-0'>
                                    <li className='search-item position-relative'>
                                        <i class="fas fa-search"></i>
                                        <div className='search-container position-absolute d-flex align-items-center justify-content-center'>
                                            <input type='text' placeholder='Tìm kiếm...' />
                                            <button><i class="fas fa-search text-white"></i></button>
                                        </div>
                                    </li>
                                    <Link to='/'><li>TRANG CHỦ</li></Link>
                                    <Link to='/products'><li>SẢN PHẨM</li></Link>
                                    <Link to='/introduce'><li>GIỚI THIỆU</li></Link>
                                    <Link to='/contact'><li>LIÊN HỆ</li></Link>
                                </ul>
                            </div>
                            <div className='col-md-2 cart-item' style={{ position: 'relative', display: 'inline-block' }}>
                                <Link to='/Cart'>
                                    <span className='cart-title'>
                                        GIỎ HÀNG /
                                    </span>
                                    <span className='cart-price' style={{ marginLeft: '4px', position: 'relative' }}>
                                        <span>0</span>
                                        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                            đ
                                        </span>
                                    </span>
                                    <span className='cart-icon'>
                                        0
                                        <span className='cart-icon_strong'></span>
                                    </span>
                                    <div className='cart-container'>
                                        Chưa có sản phẩm trong giỏ hàng!
                                    </div>
                                </Link>

                            </div>
                            <div className='col-md-1 user-container'>
                                <i class="fas fa-user" style={{ fontSize: '20px', color: '#666666D9' }}></i>
                                <div className='user-form text-center'>
                                    {
                                        userData && userData.username ? (
                                            <p className='m-0 ' style={{ fontSize: '18px' }}>
                                                <span>Xin chào</span>
                                                <span style={{ marginLeft: '4px' }}>{userData.username}</span>
                                                <p onClick={handleLogout}>Đăng xuất</p>
                                            </p>
                                        ) : (
                                            <p className='m-0 ' style={{ fontSize: '18px' }}>
                                                <span onClick={handleLogin}>Đăng nhập</span>
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;