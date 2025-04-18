import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from "react";
import Login from '../../../../pages/User/Login';
import ChatBot from '../../../../pages/User/ChatBot';

function Header() {

    const [showLogin, setShowLogin] = useState(false);
    const handleLogin = () => {
        setShowLogin(true);

    };

    const handleClose = () => {
        setShowLogin(false);
    };
    const [isHidden, setIsHidden] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

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
                                    <img src='https://klairsvietnam.vn/wp-content/uploads/2020/07/logo-klairs.png' />
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
                                    <Link to='/Product'><li>SẢN PHẨM</li></Link>
                                    <Link to='/Introduce'><li>GIỚI THIỆU</li></Link>
                                    <Link to='/Contact'><li>LIÊN HỆ</li></Link>
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
                                    <p className='m-0 ' style={{ fontSize: '18px' }}>
                                        <span>Xin chào</span>
                                        <span style={{ marginLeft: '4px' }}>Ly</span>
                                    </p>
                                    <p onClick={handleLogin}>Đăng nhập</p>
                                    <p>Đăng xuất</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header