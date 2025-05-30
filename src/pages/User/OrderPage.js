import React, { useEffect, useState } from 'react';
import CartApi from '../../Api/Card/CartApi';
import { Link } from 'react-router-dom';

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            setError(null);
            try {
                const res = await CartApi.getOrders();
                setOrders(res);
            } catch (e) {
                setError('Không thể tải đơn hàng');
            }
            setLoading(false);
        }
        fetchOrders();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Đơn hàng của tôi</h2>
            {loading && <p>Đang tải...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table className="table">
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Trạng thái</th>
                        <th>Tổng tiền</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.order_date ? new Date(order.order_date).toLocaleString() : ''}</td>
                            <td>{order.status}</td>
                            <td>{Number(order.total_price).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</td>
                            <td><Link to={`/orders/${order.id}`}>Xem chi tiết</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderPage;
