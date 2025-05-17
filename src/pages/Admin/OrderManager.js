import React, { useEffect, useState } from 'react';
import OrderApi from '../../Api/Admin/OrderApi';
import AccountApi from '../../Api/Account/AccountApi';
import AdminApi from '../../Api/Admin/AdminApi';
import ProductApi from '../../Api/Admin/ProductApi';
import { toast } from 'react-toastify';

function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [userMap, setUserMap] = useState({});
    const [productMap, setProductMap] = useState({});
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        fetchOrders();
        fetchUsers();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedOrder && selectedOrder.user_id) {
            AdminApi.getAccountById(selectedOrder.user_id)
                .then(user => setUserEmail(user?.username || 'Ẩn'))
                .catch(() => setUserEmail('Ẩn'));
        } else {
            setUserEmail('');
        }
    }, [selectedOrder]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await OrderApi.getAllOrder();
            setOrders(res);
            
        } catch (e) {
            toast.error('Không thể tải danh sách đơn hàng');
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        try {
            const users = await AccountApi.getAllUsers();
            const map = {};
            users.forEach(u => { map[u.id] = u; });
            setUserMap(map);
        } catch {}
    };

    const fetchProducts = async () => {
        try {
            const products = await ProductApi.getAllProduct();
            const map = {};
            products.forEach(p => { map[p.id] = p; });
            setProductMap(map);
        } catch {}
    };

    const handleViewDetail = async (order) => {
        try {
            const res = await OrderApi.getOrderDetail(order.id);
            // Lấy danh sách sản phẩm cho các item trong đơn hàng
            if (res && res.order_items) {
                // Lấy tất cả product_id duy nhất trong đơn hàng
                const productIds = Array.from(new Set(res.order_items.map(item => item.product_id)));
                // Gọi API lấy chi tiết từng sản phẩm
                const productDetails = await Promise.all(productIds.map(async (id) => {
                    try {
                        const prod = await ProductApi.getDetailProduct(id);
                        return { id, name: prod?.product.name };
                    } catch {
                        return { id, name: id };
                    }
                }));
                // Map product_id -> product_name
                const productNameMap = {};
                productDetails.forEach(p => { productNameMap[p.id] = p.name; });
                // Gán tên sản phẩm vào từng item
                const itemsWithName = res.order_items.map(item => ({ ...item, name: productNameMap[item.product_id] || item.product_id }));
                setSelectedOrder({ ...res, order_items: itemsWithName });
            } else {
                setSelectedOrder(res);
            }
        } catch (e) {
            toast.error('Không thể tải danh sách đơn hàng');
        }
    };

    const handleCloseDetail = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="container mt-4">
        <h3>Quản lý đơn hàng</h3>
        {loading ? <p>Đang tải...</p> : (
            <table className="table table-bordered">
            <thead>
                <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
                <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.id ? <OrderUserEmailByOrderId orderId={order.id} /> : 'Ẩn'}</td>
                    <td>{order.order_date ? new Date(order.order_date).toLocaleString() : ''}</td>
                    <td>{order.status || 'Chờ xử lý'}</td>
                    <td>{order.total_price?.toLocaleString() || ''}đ</td>
                    <td>
                    <button className="btn btn-sm btn-info" onClick={() => handleViewDetail(order)}>Xem chi tiết</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        {selectedOrder && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 340, maxWidth: '90vw', width: 'fit-content', position: 'relative', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <h5>Chi tiết đơn hàng #{selectedOrder.id}</h5>
                <p><b>Khách hàng:</b> {userEmail}</p>
                <p><b>Ngày đặt:</b> {selectedOrder.order_date ? new Date(selectedOrder.order_date).toLocaleString() : ''}</p>
                <p><b>Trạng thái:</b> {selectedOrder.status || 'Chờ xử lý'}</p>
                <p><b>Tổng tiền:</b> {selectedOrder.total_price?.toLocaleString() || ''}đ</p>
                <h6>Sản phẩm:</h6>
                <ul style={{ paddingLeft: 0, margin: 0 }}>
                {(selectedOrder.order_items).map((item, idx) => (
                    <li key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', listStyle: 'none', padding: '2px 0' }}>
                      - {item.name} x {item.quantity} ({item.price?.toLocaleString()}đ)
                    </li>
                ))}
                </ul>
                <button className="btn btn-secondary mt-2" onClick={handleCloseDetail}>Đóng</button>
                <span onClick={handleCloseDetail} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng">&times;</span>
            </div>
            </div>
        )}
        </div>
    );
}

function OrderUserEmailByOrderId({ orderId }) {
  const [email, setEmail] = React.useState('');
  React.useEffect(() => {
    let mounted = true;
    import('../../Api/Admin/OrderApi').then(({ default: OrderApi }) => {
      OrderApi.getOrderDetail(orderId)
        .then(order => {
          if (mounted) {
            if (order && order.user_id) {
              import('../../Api/Admin/AdminApi').then(({ default: AdminApi }) => {
                AdminApi.getAccountById(order.user_id)
                  .then(user => setEmail(user?.username || 'Ẩn'))
                  .catch(() => setEmail('Ẩn'));
              });
            } else {
              setEmail('Ẩn');
            }
          }
        })
        .catch(() => { if (mounted) setEmail('Ẩn'); });
    });
    return () => { mounted = false; };
  }, [orderId]);
  return email || 'Ẩn';
}

export default OrderManager;
