import React, { useEffect, useState } from 'react';
import OrderApi from '../../Api/Admin/OrderApi';
import AdminApi from '../../Api/Admin/AdminApi';
import ProductApi from '../../Api/Admin/ProductApi';
import { toast } from 'react-toastify';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { DeleteOutlined, PlusOutlined, EllipsisOutlined } from '@ant-design/icons';

const ORDER_STATUS = [
    'Chờ xử lý',
    'Đang giao',
    'Hoàn thành',
    'Đã hủy'
];

const STATUS_MAP = {
    'Chờ xử lý': 'PENDING',
    'Đang giao': 'SHIPPING',
    'Hoàn thành': 'COMPLETED',
    'Đã hủy': 'CANCELLED'
};

function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        customer_name: '',
        customer_phone: '',
        shipping_address: '',
        products: [{ product_id: '', quantity: 1 }],
        status: 'Chờ xử lý'
    });
    const [userMap, setUserMap] = useState({});
    const [productMap, setProductMap] = useState({});
    const [userEmail, setUserEmail] = useState('');
    const [showStatusPopup, setShowStatusPopup] = useState(false);
    const [statusOrderId, setStatusOrderId] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // Thêm state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Thêm state cho trạng thái đang chỉnh sửa
    const [editingStatus, setEditingStatus] = useState({});
    const [savingStatusId, setSavingStatusId] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [matchedUser, setMatchedUser] = useState(null);
    const [matchedUsers, setMatchedUsers] = useState([]);

    // State lưu user đã chọn từ dropdown
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);

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
        } else if (selectedOrder) {
            const orderDetail = OrderApi.getOrderDetail(selectedOrder.id);
            setUserEmail(orderDetail.customer_name);
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
            const response = await AdminApi.listAccount();
            console.log('Users:', response);
            if (Array.isArray(response)) {
                const mappedUsers = response.map(user => ({
                    id: user.id,
                    name: user.username || 'Không có tên',
                    email: user.email || 'Không có email',
                    phone: user.phone || 'Không có số điện thoại'
                }));
                setUsers(mappedUsers);

                // Tạo map user cho các chức năng khác
                const map = {};
                mappedUsers.forEach(u => { map[u.id] = u; });
                setUserMap(map);
            } else {
                console.error('Invalid users data format');
                toast.error('Không thể tải danh sách khách hàng');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Không thể tải danh sách khách hàng');
        }
    }; const fetchProducts = async () => {
        try {
            const response = await ProductApi.getAllProduct();

            if (Array.isArray(response.data)) {
                const mappedProducts = response.data.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price
                }));
                setProducts(mappedProducts);

                const map = {};
                mappedProducts.forEach(p => { map[p.id] = p; });
                setProductMap(map);
            } else {
                console.error('Invalid products data format');
                toast.error('Không thể tải danh sách sản phẩm');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        }
    };

    const handleViewDetail = async (order) => {
        try {
            const res = await OrderApi.getOrderDetail(order.id);
            if (res && res.order_items) {
                const productIds = Array.from(new Set(res.order_items.map(item => item.product_id)));
                const productDetails = await Promise.all(productIds.map(async (id) => {
                    try {
                        const prod = await ProductApi.getDetailProduct(id);
                        return { id, name: prod?.product.name };
                    } catch {
                        return { id, name: id };
                    }
                }));
                const productNameMap = {};
                productDetails.forEach(p => { productNameMap[p.id] = p.name; });
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

    // Xử lý thay đổi trạng thái trên select
    const handleStatusChange = (orderId, value) => {
        setEditingStatus(prev => ({ ...prev, [orderId]: value }));
    };

    // Lưu trạng thái mới
    const handleSaveStatus = async (order) => {
        setSavingStatusId(order.id);
        try {
            await OrderApi.updateOrderStatus(order.id, editingStatus[order.id]);
            toast.success('Cập nhật trạng thái thành công');
            setEditingStatus(prev => {
                const newObj = { ...prev };
                delete newObj[order.id];
                return newObj;
            });
            fetchOrders();
        } catch {
            toast.error('Cập nhật trạng thái thất bại');
        }
        setSavingStatusId(null);
    };

    const handleAddProduct = () => {
        setCreateFormData(prev => ({
            ...prev,
            products: [...prev.products, { product_id: '', quantity: 1 }]
        }));
    };

    const handleRemoveProduct = (index) => {
        setCreateFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }));
    }; const handleProductChange = (index, field, value) => {
        setCreateFormData(prev => {
            const newProducts = prev.products.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            );
            return {
                ...prev,
                products: newProducts,
            };
        });
    };    // Tính giá tiền của từng sản phẩm và tổng tiền
    const calculateProductPrice = (productId, quantity) => {
        const product = productMap[productId];
        if (product && quantity) {
            return product.price * quantity;
        }
        return 0;
    };

    const calculateTotal = () => {
        let total = 0;
        createFormData.products.forEach(item => {
            total += calculateProductPrice(item.product_id, item.quantity);
        });
        return total;
    }; const handleCreateOrUpdateOrder = async () => {
        try {
            if (!createFormData.customer_name || !createFormData.customer_phone || !createFormData.shipping_address) {
                toast.error('Vui lòng điền đầy đủ thông tin khách hàng');
                return;
            }
            if (!createFormData.products[0].product_id) {
                toast.error('Vui lòng chọn ít nhất một sản phẩm');
                return;
            }
            if (editingOrder) {
                // Update order
                await OrderApi.updateOrderDetail(editingOrder.id, createFormData);
                toast.success('Cập nhật đơn hàng thành công');
            } else {
                // Create order
                await OrderApi.createOrderDetail(createFormData);
                toast.success('Tạo đơn hàng thành công');
            }
            setShowCreateForm(false);
            setEditingOrder(null);
            setCreateFormData({
                customer_name: '',
                customer_phone: '',
                shipping_address: '',
                products: [{ product_id: '', quantity: 1 }],
                status: 'Chờ xử lý'
            });
            fetchOrders();
        } catch (error) {
            toast.error(editingOrder ? 'Cập nhật đơn hàng thất bại' : 'Tạo đơn hàng thất bại');
        }
    };

    // Tính toán dữ liệu cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    // Hàm chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Render nút phân trang
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`btn btn-sm ${currentPage === i ? 'btn-primary' : 'btn-light'}`}
                    style={{ margin: '0 2px' }}
                >
                    {i}
                </button>
            );
        }
        return (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
                {pages}
            </div>
        );
    };

    const resetForm = () => {
        setCreateFormData({
            customer_name: '',
            customer_phone: '',
            shipping_address: '',
            products: [{ product_id: '', quantity: 1 }],
            status: 'Chờ xử lý'
        });
        setMatchedUsers([]);
        setSelectedUserId(null);
        setEditingOrder(null);
        setShowCreateForm(false);
    };

    const handleEditOrder = async (order) => {
        try {
            const detail = await OrderApi.getOrderDetail(order.id);
            setEditingOrder(detail);
            setShowCreateForm(true);
            setCreateFormData({
                customer_name: order.customer_name,
                customer_phone: order.customer_phone,
                shipping_address: order.shipping_address,
                products: detail.order_items.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                })),
                status: detail.status || 'Chờ xử lý'
            });
            setSelectedUserId(detail.user_id || null);
        } catch (error) {
            toast.error('Không thể lấy chi tiết đơn hàng để sửa');
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4>Danh sách đơn hàng
                                <button
                                    className="btn btn-primary btn-sm float-end"
                                    onClick={() => setShowCreateForm(true)}
                                >
                                    Thêm đơn hàng
                                </button>
                            </h4>
                        </div>
                        <div className="card-body">
                            {loading ? <p>Đang tải...</p> : (
                                <>
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
                                            {currentOrders.map(order => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{order.id ? <OrderUserEmailByOrderId orderId={order.id} /> : 'Ẩn'}</td>
                                                    <td>{order.order_date ? new Date(order.order_date).toLocaleString() : ''}</td>
                                                    <td>{order.status || 'Chờ xử lý'}</td>
                                                    <td>{order.total_price ? Number(order.total_price).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) : ''}đ</td>
                                                    <td style={{ position: 'relative' }}>
                                                        <button
                                                            className="btn"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                setActiveDropdown(activeDropdown === order.id ? null : order.id);
                                                            }}
                                                        >
                                                            ...
                                                        </button>
                                                        {activeDropdown === order.id && (
                                                            <div
                                                                className="dropdown-menu show"
                                                                style={{
                                                                    position: 'absolute',
                                                                    right: 0,
                                                                    top: '100%',
                                                                    zIndex: 1000,
                                                                    display: 'block',
                                                                    minWidth: '10rem',
                                                                    padding: '.5rem 0',
                                                                    backgroundColor: '#fff',
                                                                    borderRadius: '.25rem',
                                                                    boxShadow: '0 2px 5px rgba(0,0,0,.2)'
                                                                }}
                                                            >
                                                                <button className="dropdown-item" onClick={() => { setActiveDropdown(null); handleViewDetail(order); }}>
                                                                    <i className="fas fa-info-circle me-2"></i>Xem chi tiết
                                                                </button>
                                                                <button className="dropdown-item" onClick={() => {
                                                                    setActiveDropdown(null);
                                                                    setStatusOrderId(order.id);
                                                                    setNewStatus(order.status || 'Chờ xử lý');
                                                                    setShowStatusPopup(true);
                                                                }}>
                                                                    <i className="fas fa-edit me-2"></i>Đổi trạng thái
                                                                </button>
                                                                <button className="dropdown-item" onClick={() => {
                                                                    setActiveDropdown(null);
                                                                    handleEditOrder(order);
                                                                }}>
                                                                    <i className="fas fa-edit me-2"></i>Sửa đơn hàng
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderPagination()}
                                </>
                            )}
                            {selectedOrder && (
                                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 340, maxWidth: '90vw', width: 'fit-content', position: 'relative', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        <h5>Chi tiết đơn hàng #{selectedOrder.id}</h5>
                                        <p><b>Khách hàng:</b> {userEmail}</p>
                                        <p><b>Ngày đặt:</b> {selectedOrder.order_date ? new Date(selectedOrder.order_date).toLocaleString() : ''}</p>
                                        <p><b>Trạng thái:</b> {selectedOrder.status || 'Chờ xử lý'}</p>
                                        <p><b>Tổng tiền:</b> {selectedOrder.total_price ? Number(selectedOrder.total_price).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) : ''}đ</p>
                                        <h6>Sản phẩm:</h6>
                                        <ul style={{ paddingLeft: 0, margin: 0 }}>
                                            {(selectedOrder.order_items).map((item, idx) => (
                                                <li key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', listStyle: 'none', padding: '2px 0' }}>
                                                    - {item.name} x {item.quantity} ({item.price ? Number(item.price).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) : ''}đ)
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="btn btn-secondary mt-2" onClick={handleCloseDetail}>Đóng</button>
                                        <span onClick={handleCloseDetail} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng">&times;</span>
                                    </div>
                                </div>
                            )}
                            {showStatusPopup && (
                                <div style={{
                                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                                    background: 'rgba(0,0,0,0.2)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{
                                        background: '#fff', padding: 24, borderRadius: 10, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', alignItems: 'center'
                                    }}>
                                        <h5>Đổi trạng thái đơn hàng</h5>
                                        <div style={{ marginBottom: 8 }}>
                                            <b>Mã đơn hàng:</b> {statusOrderId}
                                        </div>
                                        <select
                                            value={newStatus}
                                            onChange={e => setNewStatus(e.target.value)}
                                            style={{ minWidth: 180 }}
                                        >
                                            {ORDER_STATUS.map(st => (
                                                <option key={st} value={st}>{st}</option>
                                            ))}
                                        </select>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                className="btn btn-success"
                                                onClick={async () => {
                                                    setSavingStatusId(statusOrderId);
                                                    try {
                                                        // Chuyển trạng thái hiển thị sang trạng thái API
                                                        const apiStatus = STATUS_MAP[newStatus] || 'pending';
                                                        await OrderApi.updateOrderStatus(statusOrderId, apiStatus);
                                                        toast.success('Cập nhật trạng thái thành công');
                                                        setShowStatusPopup(false);
                                                        setStatusOrderId(null);
                                                        setNewStatus('');
                                                        fetchOrders();
                                                    } catch {
                                                        toast.error('Cập nhật trạng thái thất bại');
                                                    }
                                                    setSavingStatusId(null);
                                                }}
                                                disabled={savingStatusId === statusOrderId}
                                            >
                                                {savingStatusId === statusOrderId ? 'Đang lưu...' : 'Lưu'}
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => setShowStatusPopup(false)}>Hủy</button>
                                        </div>
                                        <span onClick={() => setShowStatusPopup(false)} style={{
                                            position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888'
                                        }} title="Đóng">&times;</span>
                                    </div>
                                </div>
                            )}
                            {showCreateForm && (
                                <Modal
                                    title={editingOrder ? "Cập nhật đơn hàng" : "Tạo đơn hàng mới"}
                                    open={showCreateForm}
                                    onOk={handleCreateOrUpdateOrder}
                                    onCancel={resetForm}
                                    width={800}
                                    destroyOnHidden={true}
                                    maskClosable={false}
                                >
                                    <Form layout="vertical">
                                        <Form.Item
                                            label="Tên khách hàng"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                                        >
                                            {matchedUsers.length > 0 ? (
                                                <Select
                                                    showSearch
                                                    style={{ width: '100%' }}
                                                    placeholder="Chọn tài khoản"
                                                    onChange={userId => {
                                                        const user = matchedUsers.find(u => u.id === userId);
                                                        setSelectedUserId(userId);
                                                        if (user) {
                                                            setCreateFormData(prev => ({
                                                                ...prev,
                                                                customer_name: user.name
                                                            }));
                                                        }
                                                    }}
                                                    value={selectedUserId || (matchedUsers.length === 1 ? matchedUsers[0].id : undefined)}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                >
                                                    {matchedUsers.map(u => (
                                                        <Select.Option key={u.id} value={u.id}>
                                                            {u.name} ({u.email})
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <Input
                                                    value={createFormData.customer_name}
                                                    onChange={e => setCreateFormData(prev => ({
                                                        ...prev,
                                                        customer_name: e.target.value
                                                    }))}
                                                    placeholder="Nhập tên khách hàng"
                                                />
                                            )}
                                        </Form.Item>

                                        <Form.Item
                                            label="Số điện thoại"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                                            ]}
                                        >
                                            <Input
                                                value={createFormData.customer_phone}
                                                onChange={e => {
                                                    const value = e.target.value;
                                                    setCreateFormData(prev => ({
                                                        ...prev,
                                                        customer_phone: value
                                                    }));
                                                    // Lọc tất cả user có số trùng
                                                    const foundUsers = users.filter(u => u.phone === value);
                                                    setMatchedUsers(foundUsers);
                                                    if (foundUsers.length === 1) {
                                                        setSelectedUserId(foundUsers[0].id);
                                                        setCreateFormData(prev => ({
                                                            ...prev,
                                                            customer_name: foundUsers[0].name
                                                        }));
                                                    } else {
                                                        setSelectedUserId(null);
                                                    }
                                                }}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Địa chỉ giao hàng"
                                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
                                        >
                                            <Input.TextArea
                                                value={createFormData.shipping_address}
                                                onChange={e => setCreateFormData(prev => ({
                                                    ...prev,
                                                    shipping_address: e.target.value
                                                }))}
                                                placeholder="Nhập địa chỉ giao hàng"
                                                rows={3}
                                            />
                                        </Form.Item>

                                        {createFormData.products.map((product, index) => (
                                            <div key={index} className="product-item" style={{ marginBottom: 16 }}>
                                                <Row gutter={16}>
                                                    <Col span={14}>
                                                        <Form.Item
                                                            label="Sản phẩm"
                                                            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
                                                        >
                                                            <Select
                                                                value={product.product_id}
                                                                onChange={value => handleProductChange(index, 'product_id', value)}
                                                                placeholder="Chọn sản phẩm"
                                                                showSearch
                                                                filterOption={(input, option) => {
                                                                    if (!option?.children) return false;
                                                                    return option.children.toLowerCase().includes(input.toLowerCase())
                                                                }}
                                                                optionFilterProp="children"
                                                                style={{ width: '100%' }}
                                                                notFoundContent="Không tìm thấy sản phẩm"
                                                            >
                                                                {Array.isArray(products) && products
                                                                    .filter(p =>
                                                                        // Chỉ hiển thị sản phẩm chưa được chọn ở dòng khác hoặc là chính dòng này
                                                                        !createFormData.products.some((item, idx2) => item.product_id === p.id && idx2 !== index)
                                                                    )
                                                                    .map(p => (
                                                                        <Select.Option key={p.id} value={p.id}>
                                                                            {p.name} - {Number(p.price).toLocaleString('vi-VN')}đ
                                                                        </Select.Option>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3}>
                                                        <Form.Item
                                                            label="Số lượng"
                                                            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                                                        >
                                                            <InputNumber
                                                                min={1}
                                                                value={product.quantity}
                                                                onChange={value => handleProductChange(index, 'quantity', value)}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item label="Thành tiền">
                                                            <div style={{
                                                                lineHeight: '32px',
                                                                color: '#1890ff',
                                                                fontSize: '16px',
                                                                fontWeight: 500
                                                            }}>
                                                                {product.product_id ? Number(calculateProductPrice(product.product_id, product.quantity)).toLocaleString('vi-VN') + 'đ' : '-'}
                                                            </div>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={1}>
                                                        <Button
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleRemoveProduct(index)}
                                                            style={{ marginTop: 29 }}
                                                        // disabled={createFormData.products.length === 1}
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}

                                        <Button
                                            type="dashed"
                                            onClick={handleAddProduct}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Thêm sản phẩm
                                        </Button>

                                        <div style={{ marginTop: 16, borderTop: '1px solid #ddd', paddingTop: 16 }}>
                                            <h4>Tổng tiền: {Number(calculateTotal()).toLocaleString('vi-VN')}đ</h4>
                                        </div>
                                    </Form>
                                </Modal>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 340, maxWidth: '90vw', width: 'fit-content', position: 'relative', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        <h5>Chi tiết đơn hàng #{selectedOrder.id}</h5>
                        <p><b>Khách hàng:</b> {userEmail}</p>
                        <p><b>Ngày đặt:</b> {selectedOrder.order_date ? new Date(selectedOrder.order_date).toLocaleString() : ''}</p>
                        <p><b>Trạng thái:</b> {selectedOrder.status || 'Chờ xử lý'}</p>
                        <p><b>Tổng tiền:</b> {selectedOrder.total_price ? Number(selectedOrder.total_price).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) : ''}đ</p>
                        <h6>Sản phẩm:</h6>
                        <ul style={{ paddingLeft: 0, margin: 0 }}>
                            {(selectedOrder.order_items).map((item, idx) => (
                                <li key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', listStyle: 'none', padding: '2px 0' }}>
                                    - {item.name} x {item.quantity} ({item.price ? Number(item.price).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) : ''}đ)
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-secondary mt-2" onClick={handleCloseDetail}>Đóng</button>
                        <span onClick={handleCloseDetail} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng">&times;</span>
                    </div>
                </div>
            )}
            {showStatusPopup && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.2)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#fff', padding: 24, borderRadius: 10, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', alignItems: 'center'
                    }}>
                        <h5>Đổi trạng thái đơn hàng</h5>
                        <div style={{ marginBottom: 8 }}>
                            <b>Mã đơn hàng:</b> {statusOrderId}
                        </div>
                        <select
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value)}
                            style={{ minWidth: 180 }}
                        >
                            {ORDER_STATUS.map(st => (
                                <option key={st} value={st}>{st}</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                className="btn btn-success"
                                onClick={async () => {
                                    setSavingStatusId(statusOrderId);
                                    try {
                                        // Chuyển trạng thái hiển thị sang trạng thái API
                                        const apiStatus = STATUS_MAP[newStatus] || 'pending';
                                        await OrderApi.updateOrderStatus(statusOrderId, apiStatus);
                                        toast.success('Cập nhật trạng thái thành công');
                                        setShowStatusPopup(false);
                                        setStatusOrderId(null);
                                        setNewStatus('');
                                        fetchOrders();
                                    } catch {
                                        toast.error('Cập nhật trạng thái thất bại');
                                    }
                                    setSavingStatusId(null);
                                }}
                                disabled={savingStatusId === statusOrderId}
                            >
                                {savingStatusId === statusOrderId ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button className="btn btn-secondary" onClick={() => setShowStatusPopup(false)}>Hủy</button>
                        </div>
                        <span onClick={() => setShowStatusPopup(false)} style={{
                            position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888'
                        }} title="Đóng">&times;</span>
                    </div>
                </div>)}
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
                                    .then(user => setEmail(user?.username || order.customer_name))
                                    .catch(() => setEmail('Ẩn'));
                            });
                        } else {
                            setEmail(order.customer_name);
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