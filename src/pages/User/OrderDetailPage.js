import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderApi from '../../Api/Card/CartApi';
import AccountApi from '../../Api/Account/AccountApi';
import DashboardApi from '../../Api/Product/DashboardApi';

function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [address, setAddress] = useState(null);
    const [productNames, setProductNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrder() {
            setLoading(true);
            setError(null);
            try {
                const res = await OrderApi.getOrderDetail(id);
                setOrder(res);
                // Lấy thông tin địa chỉ giao hàng từ id
                if (res && res.address_id) {
                    const addresses = await AccountApi.getAddresses();
                    const found = addresses.find(a => a.id === res.address_id);
                    setAddress(found);
                }
                // Lấy tên sản phẩm từ product_id
                if (res && res.order_items) {
                    const names = {};
                    await Promise.all(res.order_items.map(async (item) => {
                        try {
                            const prod = await DashboardApi.getDetailProduct(item.product_id);
                            names[item.product_id] = prod.product.name;
                        } catch {
                            names[item.product_id] = item.product_id;
                        }
                    }));
                    setProductNames(names);
                }
            } catch (e) {
                setError('Không thể tải chi tiết đơn hàng');
            }
            setLoading(false);
        }
        fetchOrder();
    }, [id]);

    if (loading) return <div className="container mt-4">Đang tải...</div>;
    if (error) return <div className="container mt-4" style={{ color: 'red' }}>{error}</div>;
    if (!order) return null;

    return (
        <div className="container mt-4">
            <h2>Chi tiết đơn hàng #{order.id}</h2>
            <div style={{ marginBottom: 16 }}>
                <b>Trạng thái:</b> {order.status}
            </div>
            <div style={{ marginBottom: 16 }}>
                <b>Ngày đặt:</b> {order.order_date ? new Date(order.order_date).toLocaleString() : ''}
            </div>
            <div style={{ marginBottom: 16 }}>
                <b>Tên người nhận:</b> {address.recipient_name}
            </div>
            <div style={{ marginBottom: 16 }}>
                <b>Số điện thoại:</b> {address.phone_number}
            </div>
            <div style={{ marginBottom: 16 }}>
                <b>Địa chỉ giao hàng:</b> {address ? `${address.address_line}` : order.address_id}
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Tạm tính</th>
                    </tr>
                </thead>
                <tbody>
                    {order.order_items && order.order_items.map(item => (
                        <tr key={item.id}>
                            <td>{productNames[item.product_id] || item.product_id}</td>
                            <td>{item.quantity}</td>
                            <td>{Number(item.price).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</td>
                            <td>{(Number(item.price) * Number(item.quantity)).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h4 style={{ textAlign: 'right' }}>Tổng tiền: {Number(order.total_price).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</h4>
        </div>
    );
}

export default OrderDetailPage;
