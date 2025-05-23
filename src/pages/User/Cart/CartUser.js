import React from 'react'
import { useNavigate } from 'react-router-dom';
import DashboardApi from '../../../Api/Product/DashboardApi';
import { toast } from 'react-toastify';
import { useCart } from '../../../contexts/CartContext';

function Cart() {
    const navigate = useNavigate();
    const { cart, updateCart } = useCart();

    const handleToPay = () => {
        if (!cart.orders || cart.orders.length === 0) {
            toast.warning('Giỏ hàng của bạn đang trống!');
            return;
        }
        navigate('/Pay'); // Chuyển đến trang Pay
    };
    const handleToProduct = () => {
        navigate('/products'); // Chuyển đến trang Product
    };

    // Calculate total
    const total = cart.orders.reduce((sum, item) => {
        const price = item.sale > 0 ? item.product_price_sale : item.product_price;
        return sum + price * item.quantity;
    }, 0);

    const handleChangeQuantity = async (productId, newQuantity) => {
        try {
            const product = await DashboardApi.getDetailProduct(productId);
            const productQuantity = product.product.quantity ?? (product.product && product.product.quantity);
            if (!product || typeof productQuantity !== 'number') {
                toast.error('Không thể kiểm tra số lượng sản phẩm.');
                return;
            }
            if (newQuantity > productQuantity) {
                toast.error('Số lượng sản phẩm trong kho không đủ!');
                return;
            }
            const newOrders = cart.orders.map(o => o.product_id === productId ? { ...o, quantity: newQuantity } : o);
            const newCart = { ...cart, orders: newOrders };
            updateCart(newCart);
        } catch (error) {
            toast.error('Có lỗi khi cập nhật số lượng!');
        }
    };

    return (
        <div className='container cart mb-5 ' style={{ minHeight: '300px' }}>
            <div className='custom-container' style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <div className='row mt-4'>
                    <div className='col-md-7'>
                        <div>
                            <div className='row' style={{ borderBottom: '2px solid #ddd', padding: '0 0 8px 0' }}>
                                <div className='col-md-2 p-0'>
                                    <h6 >SẢN PHẨM</h6>
                                </div>
                                <div className='col-md-4'>

                                </div>
                                <div className='col-md-2'>
                                    <h6>GIÁ</h6>
                                </div>
                                <div className='col-md-2'>
                                    <h6>SỐ LƯỢNG</h6>
                                </div>
                                <div className='col-md-2 p-0'>
                                    <h6 style={{ textAlign: 'right' }}>TẠM TÍNH</h6>
                                </div>
                            </div>
                            {cart.orders.length === 0 ? (
                                <div className='row mt-3 align-items-center' style={{ borderBottom: '1px solid #ddd', padding: '0 0 8px 0' }}>
                                    <div className='col-12 text-center'>Chưa có sản phẩm trong giỏ hàng!</div>
                                </div>
                            ) : (
                                cart.orders.map((item, idx) => {
                                    const price = item.sale > 0 ? item.product_price_sale : item.product_price;
                                    const total = price * item.quantity;
                                    return (
                                        <div className='row mt-3 align-items-center' style={{ borderBottom: '1px solid #ddd', padding: '0 0 8px 0' }} key={item.product_id}>
                                            <div className='col-md-2 p-0 d-flex align-items-center'>
                                                <button style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    onClick={() => {
                                                        const newOrders = cart.orders.filter(o => o.product_id !== item.product_id);
                                                        const newCart = { ...cart, orders: newOrders };
                                                        updateCart(newCart);
                                                    }}
                                                >X</button>
                                                <img style={{ width: '75px', height: '75px', marginLeft: 8 }} src={item.product_img} alt={item.product_name} />
                                            </div>
                                            <div className='col-md-4'>
                                                {item.product_name}
                                            </div>
                                            <div className='col-md-2'>
                                                <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                                    <span>{Number(price).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
                                                    <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                                        đ
                                                    </span>
                                                </span>
                                            </div>
                                            <div className='col-md-2'>
                                                <div className='d-flex align-items-center'>
                                                    <button style={{ border: "1px solid #ddd", width: '20px', height: '33px' }}
                                                        onClick={() => {
                                                            if (item.quantity > 1) handleChangeQuantity(item.product_id, item.quantity - 1);
                                                        }}
                                                    >-</button>
                                                    <input style={{ border: "1px solid #ddd", width: '40px', height: '33px', textAlign: 'center' }} type='number' min='1' value={item.quantity} readOnly />
                                                    <button style={{ border: "1px solid #ddd", width: '20px', height: '33px' }}
                                                        onClick={() => handleChangeQuantity(item.product_id, item.quantity + 1)}
                                                    >+</button>
                                                </div>
                                            </div>
                                            <div className='col-md-2 p-0' style={{ textAlign: 'right' }}>
                                                <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                                    <span>{Number(total).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
                                                    <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                                        đ
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                        <button className='cart-bt_continue' onClick={handleToProduct}>  TIẾP TỤC XEM SẢN PHẨM</button>

                    </div>
                    <div className='col-md-5' style={{ paddingLeft: '30px' }}>
                        <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '20px', paddingBottom: '16px' }}>
                            <div className='' style={{ borderBottom: '2px solid #ddd', padding: '0 0 8px 0' }}>
                                <h6>CỘNG GIỎ HÀNG</h6>
                            </div>
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
                            <button onClick={handleToPay} style={{ backgroundColor: '#d26e4b', color: '#fff', width: '100%', height: '40px', border: 'none' }}>TIẾN HÀNH THANH TOÁN</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart