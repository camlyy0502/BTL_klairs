import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import Login from '../../../../pages/User/Login/LoginUser';
import ChatBot from '../../../../pages/User/ChatBot/ChatUser';
import AccountApi from '../../../../Api/Account/AccountApi';
import { v4 as uuid4 } from 'uuid';
import { useCart } from '../../../../contexts/CartContext';
import DashboardApi from '../../../../Api/Product/DashboardApi';

function Header() {
    const { cart, updateCart, calculateTotal } = useCart();
    const [showLogin, setShowLogin] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const handleLogin = () => {
        setShowLogin(true);
        setIsRegister(false);
    };
    const handleRegister = () => {
        setShowLogin(true);
        setIsRegister(true);
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
    const [showCatDropdown, setShowCatDropdown] = useState(false);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const res = await DashboardApi.listCategories();
            setCategories(res.map(cat => ({ id: cat.id, name: cat.name })));
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
        };
        fetchCategories();
    }, []);
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await AccountApi.info();
                setUserData(res);
                setUuid(res.userId)
            } catch (error) {
                console.error("Failed to get user info:", error);
                if (error.response?.status === 401) {
                    setUserData(null);
                }
            }
        };
        getUser();
    }, []);
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 90) {
                if (currentScrollY > lastScrollY) {
                    setIsHidden(true);
                    setTimeout(() => {
                        setIsFixed(true);
                        setIsHidden(false);
                    }, 300);
                }
            } else {
                setIsFixed(false);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);
    // Tính tổng số lượng và tổng tiền từ context
    const totalQuantity = cart.orders.reduce((sum, item) => sum + item.quantity, 0);
    const total = calculateTotal();
    const location = useLocation();

    return (
        <>
            <ChatBot />
            <Login isVisible={showLogin} onClose={handleClose} isRegister={isRegister} />
            <div className={`container-fluid p-0 header ${isHidden ? "hidden" : ""} ${isFixed ? "fixed" : ""}`}>
                <div className='container h-100'>
                    <div className='custom-container h-100'>
                        <div className='row h-100 align-items-center'>
                            <div className='col-md-3'>
                                <Link to='/'>
                                    <img src='https://klairsvietnam.vn/wp-content/uploads/2020/07/logo-klairs.png' alt=""/>
                                </Link>
                            </div>
                            <div className='col-md-6 header-nav' style={{ maxWidth: "fit-content"}}>
                                <ul className='d-flex m-0' style={{ color: '#000' }}>
                                    <li className={`search-item position-relative${location.pathname === '/search' ? ' active' : ''}`} style={{ color: location.pathname === '/search' ? '#000' : undefined }}> 
                                        <i className="fas fa-search"></i>
                                        <div className='search-container position-absolute d-flex align-items-center justify-content-center'>
                                            <input type='text' placeholder='Tìm kiếm...' />
                                            <button><i className="fas fa-search text-white"></i></button>
                                        </div>
                                    </li>
                                    <Link to='/'>
                                        <li className={location.pathname === '/' ? 'active' : ''} style={{ color: location.pathname === '/' ? '#000' : undefined }}>TRANG CHỦ</li>
                                    </Link>
                                    {/* <Link to='/products'>
                                        <li className={location.pathname.startsWith('/products') ? 'active' : ''} style={{ color: location.pathname.startsWith('/products') ? '#000' : undefined }}>SẢN PHẨM</li>
                                    </Link> */}
                                    <Link to='/products' style={{ textDecoration: 'none' }}>
                                        <li
                                            className={`position-relative${location.pathname.startsWith('/products') ? ' active' : ''}`}
                                            style={{ color: location.pathname.startsWith('/products') ? '#000' : undefined, cursor: 'pointer' }}
                                            onMouseEnter={() => setShowCatDropdown(true)}
                                            onMouseLeave={() => setShowCatDropdown(false)}
                                        >
                                            SẢN PHẨM
                                            {showCatDropdown && (
                                                <ul style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    background: '#fff',
                                                    border: '1px solid #ddd',
                                                    borderRadius: 4,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                    minWidth: 180,
                                                    padding: 0,
                                                    margin: 0,
                                                    listStyle: 'none',
                                                    zIndex: 1000
                                                }}>
                                                    {categories.map(cat => (
                                                        <Link key={cat.id} to={`/products?category=${encodeURIComponent(cat.id)}`} style={{ textDecoration: 'none' }}>
                                                            <li style={{ padding: '2px 16px', cursor: 'pointer', color: '#222', fontWeight: 500, lineHeight: 1 }}>{cat.name}</li>
                                                        </Link>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    </Link>
                                    <Link to='/introduce'>
                                        <li className={location.pathname.startsWith('/introduce') ? 'active' : ''} style={{ color: location.pathname.startsWith('/introduce') ? '#000' : undefined }}>GIỚI THIỆU</li>
                                    </Link>
                                    <Link to='/contact'>
                                        <li className={location.pathname.startsWith('/contact') ? 'active' : ''} style={{ color: location.pathname.startsWith('/contact') ? '#000' : undefined }}>LIÊN HỆ</li>
                                    </Link>
                                </ul>
                            </div>
                            <div className='col-md-2 cart-item' style={{ position: 'relative', display: 'inline-block', width: "auto" }}>
                                <Link to='/cart'>
                                    <span className={`cart-title ${location.pathname.startsWith('/cart') ? ' active' : ''}`} style={{ color: location.pathname.startsWith('/cart') ? '#000' : undefined }}>
                                        GIỎ HÀNG /
                                    </span>
                                    <span className='cart-price' style={{ marginLeft: '4px', position: 'relative' }}>
                                        <span>{Number(total).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
                                        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                            đ
                                        </span>
                                    </span>
                                    <span className='cart-icon'>
                                        {totalQuantity}
                                        <span className='cart-icon_strong'></span>
                                    </span>
                                    <div className='cart-container' style={{ minWidth: 340, maxWidth: 800, whiteSpace: 'normal', wordBreak: 'break-word', padding: 12 }}>
                                        {cart.orders.length === 0 ? (
                                            <>Chưa có sản phẩm trong giỏ hàng!</>
                                        ) : (
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {cart.orders.map((item, idx) => {
                                                    const price = item.sale > 0 ? item.product_price_sale : item.product_price;
                                                    const total = price * item.quantity;
                                                    return (
                                                        <li key={item.product_id} style={{ fontSize: '14px', color: '#333', display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
                                                            <img src={item.product_img} alt={item.product_name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, marginRight: 8 }} />
                                                            <span style={{ fontWeight: 500 }}>{item.product_name}</span>
                                                            <span style={{ marginLeft: 8, color: item.sale > 0 ? '#888' : '#222', textDecoration: item.sale > 0 ? 'line-through' : 'none' }}>
                                                                {Number(item.product_price).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ
                                                            </span>
                                                            {item.sale > 0 && (
                                                                <span style={{ marginLeft: 8, color: '#e53935', fontWeight: 600 }}>
                                                                    {item.product_price_sale.toLocaleString()}đ
                                                                </span>
                                                            )}
                                                            <span style={{ marginLeft: 'auto' }}>x {item.quantity}</span>
                                                            <span style={{ marginLeft: 12, fontWeight: 600, color: '#1976d2' }}>
                                                                = {Number(total).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ
                                                            </span>
                                                            <i
                                                                className="fas fa-times-circle"
                                                                style={{ color: '#e53935', cursor: 'pointer', marginLeft: 10, fontSize: 18 }}
                                                                title="Xóa sản phẩm"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    const newOrders = cart.orders.filter(o => o.product_id !== item.product_id);
                                                                    const newCart = { ...cart, orders: newOrders };
                                                                    updateCart(newCart);
                                                                }}
                                                            />
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                </Link>
                            </div>
                            <div className='col-md-1 user-container'>
                                <i className="fas fa-user" style={{ fontSize: '20px', color: '#666666D9' }}></i>
                                <div className='user-form text-center' style={{ position: 'absolute', top: '100%', width: "300px", height: "150px", right: 0, backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', zIndex: 100 }}>
                                    {
                                        userData && userData.username ? (
                                            <div className='m-0' style={{ fontSize: '18px' }}>
                                                <span>Xin chào {userData.username}</span>
                                                <div style={{marginTop: 8}}>
                                                    <a href='/orders' style={{ color: location.pathname.startsWith('/orders') ? '#000' : '#888', cursor: 'pointer' }}
                                                        onMouseEnter={e => e.target.style.color = '#000'}
                                                        onMouseLeave={e => e.target.style.color = location.pathname.startsWith('/orders') ? '#000' : '#888'}>
                                                        Đơn hàng
                                                    </a>
                                                </div>
                                                <div style={{marginTop: 8}}>
                                                    <a href='/account/addresses' style={{ color: location.pathname.startsWith('/account/addresses') ? '#000' : '#888', cursor: 'pointer' }}
                                                        onMouseEnter={e => e.target.style.color = '#000'}
                                                        onMouseLeave={e => e.target.style.color = location.pathname.startsWith('/account/addresses') ? '#000' : '#888'}>
                                                        Quản lý địa chỉ giao hàng
                                                    </a>
                                                </div>
                                                <div style={{marginTop: 8, cursor: 'pointer', color: '#e53935'}} onClick={handleLogout}>Đăng xuất</div>
                                            </div>
                                        ) : (
                                            <div className='m-0' style={{ fontSize: '18px' }}>
                                                <span onClick={handleLogin} style={{cursor: 'pointer'}}>Đăng nhập</span>
                                                <div style={{marginTop: 8}}>
                                                    <span onClick={handleRegister} style={{cursor: 'pointer'}}>Đăng ký</span>
                                                </div>
                                            </div>
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