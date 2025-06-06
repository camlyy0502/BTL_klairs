import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import AccountApi
from '../../../../Api/Account/AccountApi';

function Sidebar() {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await AccountApi.info();
                setCurrentUser(response);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }
    , []);
    const location = useLocation();
    const navItems = [
        { to: '/admin', icon: 'fas fa-home me-2', label: 'Dashboard' },
        { to: '/admin/account', icon: 'fas fa-user me-2', label: 'Quản lý tài khoản' },
        { to: '/admin/chat', icon: 'fa-brands fa-facebook-messenger me-2', label: 'Quản lý tin nhắn' },
        { to: '/admin/bot', icon: 'fas fa-robot me-2', label: 'Quản lý bot' },
        { to: '/admin/products', icon: 'fas fa-box me-2', label: 'Quản lý sản phẩm' }, // Thêm mục quản lý sản phẩm
        { to: '/admin/orders', icon: 'fas fa-shopping-cart me-2', label: 'Quản lý đơn hàng' }, // Thêm mục quản lý đơn hàng
        { to: '/admin/category', icon: 'fas fa-tags me-2', label: 'Quản lý danh mục' },
        { to: '/', icon: 'fa-solid fa-repeat me-2', label: 'Chuyển tới dashboard' },
    ];

    return (
        <div className="col-md-2 slider" style={{ backgroundColor: '#fff', minHeight: '100vh', width: 230 }}>
            <div className="pt-3">
                <img className='' style={{ width: 50, borderRadius: '50%', }} src='https://e7.pngegg.com/pngimages/754/474/png-clipart-computer-icons-system-administrator-avatar-computer-network-heroes-thumbnail.png' alt=""/>
                <span style={{ fontSize: 16, marginLeft: 8, color: '#62677399' }}>{currentUser?.username || 'User'}</span>
            </div>
            <h6 className="mt-4" style={{ color: '#62677399' }}>NAVIGATION</h6>
            <ul className='navigation m-0 p-0'>
                {navItems.map((item, idx) => (
                    <li
                        key={item.to}
                        className={`slide${location.pathname === item.to ? ' active' : ''}`}
                        style={{ padding: '8px 20px' }}
                    >
                        <Link to={item.to} style={{ display: 'block', width: '100%', color: 'inherit', textDecoration: 'none' }}>
                            <i className={item.icon}></i> {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div>

            </div>
        </div>

    )
}

export default Sidebar