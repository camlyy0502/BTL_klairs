import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressManager from '../Account/AddressManager';
import OrderApi from '../../../Api/Card/CartApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from '../Login';
import AccountApi from '../../../Api/Account/AccountApi';

function Pay() {
    const navigate = useNavigate();
    const [cart, setCart] = useState({ address_id: '', orders: [] });
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(false);

    useEffect(() => {
        const cartKey = 'klairs_cart';
        const stored = localStorage.getItem(cartKey);
        if (stored) {
            setCart(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        // Fetch addresses for selection
        async function fetchAddresses() {
            try {
                const res = await import('../../../Api/Account/AccountApi');
                const api = res.default;
                const addrs = await api.getAddresses();
                setAddresses(addrs);
                const def = addrs.find(a => a.is_default);
                setDefaultAddress(def);
                // Nếu chưa chọn địa chỉ, tự động chọn địa chỉ mặc định (chỉ khi lần đầu hoặc khi danh sách thay đổi)
                setSelectedAddressId(prev => prev || (def ? def.id : null));
            } catch (e) {}
        }
        fetchAddresses();
    }, []);

    useEffect(() => {
        async function checkLogin() {
            try {
                const info = await AccountApi.info();
                console.log('User info:', info);
                setUser(true);
            } catch {
                setUser(false);
            }
        }
        checkLogin();
        const onLogin = () => checkLogin();
        window.addEventListener('login-success', onLogin);
        return () => window.removeEventListener('login-success', onLogin);
    }, []);

    const handleToPayDetails = async () => {
        if (!user) {
            toast.warning('Vui lòng đăng nhập để đặt hàng');
            setShowLogin(true);
            return;
        }
        if (!cart.orders || cart.orders.length === 0) {
            toast.warning('Giỏ hàng của bạn đang trống!');
            return;
        }
        if (!selectedAddressId) {
            toast.warning('Vui lòng chọn địa chỉ giao hàng!');
            return;
        }
        setLoading(true);
        try {
            // Lấy thông tin địa chỉ đầy đủ
            const orderBody = {
                address_id: selectedAddressId,
                orders: cart.orders.map(({ product_id, quantity }) => ({ product_id, quantity })),
            };
            await OrderApi.createOrder(orderBody);
            // Clear cart after order
            localStorage.setItem('klairs_cart', JSON.stringify({ address_id: '', orders: [] }));
            window.dispatchEvent(new Event('cart-updated'));
            toast.warning('Đặt hàng thành công!');
            navigate('/orders');
        } catch (e) {
            toast.warning('Đặt hàng thất bại!');
        }
        setLoading(false);
    };

    // Calculate total
    const total = cart.orders.reduce((sum, item) => {
        const price = item.sale > 0 ? item.product_price_sale : item.product_price;
        return sum + price * item.quantity;
    }, 0);

    return (
        <>
            <Login isVisible={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={() => {
    setShowLogin(false);
    setUser(true);
    // Gửi sự kiện để các component khác cũng biết đã đăng nhập
    window.dispatchEvent(new Event('login-success'));
}} />
            <div className='container cart mb-5 ' style={{ minHeight: '300px' }}>
                <div className='custom-container' style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                    <div className='row'>
                        <div className='col-md-7' style={{ borderTop: '2px solid #ddd', paddingTop: '20px' }}>
                            <h5>THÔNG TIN THANH TOÁN</h5>
                            <div style={{ marginBottom: 24 }}>
                                { user ? (
                                    <AddressManager selectedAddressId={selectedAddressId} onSelect={setSelectedAddressId} />
                                ) : (
                                    <div style={{ color: '#888', fontStyle: 'italic', padding: '16px 0' }}>Vui lòng đăng nhập để chọn địa chỉ giao hàng</div>
                                )}
                            </div>
                        </div>
                        <div className='col-md-5' style={{ paddingLeft: '20px' }}>
                            <div style={{ border: '2px solid #000', padding: '20px' }}>
                                <h5>ĐƠN HÀNG CỦA BẠN</h5>
                                <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }}>
                                    <h6>SẢN PHẨM</h6>
                                    <h6>TẠM TÍNH</h6>
                                </div>
                                {cart.orders.map(item => {
                                    const price = item.sale > 0 ? item.product_price_sale : item.product_price;
                                    const total = price * item.quantity;
                                    return (
                                        <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }} key={item.product_id}>
                                            <p style={{ fontSize: '14px', width: '250px' }}>{item.product_name} × {item.quantity}</p>
                                            <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                                <span>{Number(total).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
                                                <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                                    đ
                                                </span>
                                            </span>
                                        </div>
                                    );
                                })}
                                <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }}>
                                    <p style={{ fontWeight: '500' }}>Tạm tính</p>
                                    <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                        <span>{Number(total).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
                                        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                            đ
                                        </span>
                                    </span>
                                </div>
                                <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd', color: '#ddd' }}>
                                    <p >Giao hàng</p>
                                    <p>Miễn phí giao hàng</p>
                                </div>
                                <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }}>
                                    <p style={{ fontWeight: '500' }}>Tổng</p>
                                    <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                        <span>{Number(total).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
                                        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                            đ
                                        </span>
                                    </span>
                                </div>
                                <h6 className='mt-3'>Trả tiền mặt khi nhận hàng</h6>
                                <button onClick={handleToPayDetails} style={{ backgroundColor: '#d26e4b', color: '#fff', width: '150px', height: '40px', border: 'none', marginTop: '16px' }} disabled={loading}>
                                    {loading ? 'Đang đặt...' : 'ĐẶT HÀNG'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Pay