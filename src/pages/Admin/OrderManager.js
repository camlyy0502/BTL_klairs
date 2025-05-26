import React, { useEffect, useState } from 'react';
import OrderApi from '../../Api/Admin/OrderApi';
import AdminApi from '../../Api/Admin/AdminApi';
import ProductApi from '../../Api/Admin/ProductApi';
import { toast } from 'react-toastify';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { DeleteOutlined, PlusOutlined, EllipsisOutlined } from '@ant-design/icons';

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
    const [filterStatus, setFilterStatus] = useState('all'); // Thêm state cho bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceOrder, setInvoiceOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
        fetchUsers();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedOrder && selectedOrder.user_id) {
            AdminApi.getAccountById(selectedOrder.user_id)
                .then(user => setUserEmail(user?.username))
                .catch(() => setUserEmail('Ẩn'));
        } else if (selectedOrder) {
            setUserEmail(selectedOrder.customer_name);
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
                    price: product.price,
                    quantity: product.quantity,
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
                const productIds = Array.from(new Set(res.order_items.map(item => item.product_id)));                const productDetails = await Promise.all(productIds.map(async (id) => {
                    try {
                        const prod = await ProductApi.getDetailProduct(id);
                        return { id, name: prod?.product.name };
                    } catch {
                        return { id, name: id };
                    }
                }));
                const productNameMap = {};
                productDetails.forEach(p => { productNameMap[p.id] = p.name; });
                
                // Nhóm các sản phẩm có cùng ID và tính tổng số lượng
                const groupedItems = res.order_items.reduce((acc, item) => {
                    const existingItem = acc.find(p => p.product_id === item.product_id);
                    if (existingItem) {
                        existingItem.quantity += item.quantity;
                        existingItem.price = item.price;
                    } else {
                        acc.push({
                            ...item,
                            name: productNameMap[item.product_id] || item.product_id
                        });
                    }
                    return acc;
                }, []);
                
                setSelectedOrder({ ...res, order_items: groupedItems });
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
    };
    const handleProductChange = (index, field, value) => {
        setCreateFormData(prev => {
            let newValue = value;
            
            if (field === 'product_id') {
                // Khi chọn sản phẩm mới, đặt số lượng mặc định là 1
                // và kiểm tra xem có đủ trong kho không
                const product = products.find(p => p.id === value);
                if (product) {
                    if ((product.quantity || 0) < 1) {
                        toast.error(`Sản phẩm ${product.name} đã hết hàng`);
                        return prev; // Không cho chọn sản phẩm đã hết hàng
                    }
                }
                const newProducts = prev.products.map((item, i) => 
                    i === index ? { ...item, [field]: value, quantity: 1 } : item
                );
                return {
                    ...prev,
                    products: newProducts,
                };
            }
            
            // Nếu đang thay đổi số lượng, kiểm tra số lượng trong kho
            if (field === 'quantity') {
                const product = products.find(p => p.id === prev.products[index].product_id);
                if (product && value > (product.quantity || 0)) {
                    toast.error(`Số lượng trong kho chỉ còn ${product.quantity || 0} sản phẩm`);
                    newValue = product.quantity || 0;
                }
            }

            const newProducts = prev.products.map((item, i) => 
                i === index ? { ...item, [field]: newValue } : item
            );
            return {
                ...prev,
                products: newProducts,
            };
        });
    };// Tính giá tiền của từng sản phẩm và tổng tiền
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
                await OrderApi.updateOrder(editingOrder.id, createFormData);
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

    // Hàm chuyển đổi từ trạng thái API sang trạng thái hiển thị
    const getDisplayStatus = (apiStatus) => {
        return Object.entries(STATUS_MAP).find(([display, api]) => api === apiStatus)?.[0] || 'Chờ xử lý';
    };

    // Hàm lọc đơn hàng theo trạng thái và từ khóa tìm kiếm
    const filteredOrders = orders.filter(order => {
        const matchStatus = filterStatus === 'all' ? true : order.status === STATUS_MAP[filterStatus];
        const searchLower = searchTerm.toLowerCase();
        const matchSearch = searchTerm === '' ? true : (
            order.id?.toString().includes(searchTerm) ||
            order.customer_name?.toLowerCase().includes(searchLower) ||
            order.customer_phone?.includes(searchTerm) ||
            userMap[order.user_id]?.username?.toLowerCase().includes(searchLower)
        );
        return matchStatus && matchSearch;
    });

    // Tính toán dữ liệu cho trang hiện tại với danh sách đã lọc
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    // Hàm chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Render nút phân trang
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        
        let pages = [];
        // Hiển thị tối đa 5 trang và thêm dấu ...
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Điều chỉnh startPage nếu endPage đã đạt giới hạn
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Thêm nút về trang đầu
        if (startPage > 1) {
            pages.push(
                <button key="first" onClick={() => handlePageChange(1)} className="btn btn-sm btn-light mx-1">
                    «
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1" className="mx-1">...</span>);
            }
        }

        // Thêm các nút trang
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`btn btn-sm mx-1 ${currentPage === i ? 'btn-primary' : 'btn-light'}`}
                >
                    {i}
                </button>
            );
        }

        // Thêm nút đến trang cuối
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="dots2" className="mx-1">...</span>);
            }
            pages.push(
                <button key="last" onClick={() => handlePageChange(totalPages)} className="btn btn-sm btn-light mx-1">
                    »
                </button>
            );
        }

        return (
            <div className="d-flex justify-content-center align-items-center mt-4">
                <div className="pagination-info me-3">
                    {`Hiển thị ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredOrders.length)} trong tổng số ${filteredOrders.length} đơn hàng`}
                </div>
                <div>{pages}</div>
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
    };    const handleEditOrder = async (order) => {
        try {
            const detail = await OrderApi.getOrderDetail(order.id);
            setEditingOrder(detail);
            setShowCreateForm(true);

            // Nhóm các sản phẩm có cùng ID và tính tổng số lượng
            const groupedProducts = detail.order_items.reduce((acc, item) => {
                const existingProduct = acc.find(p => p.product_id === item.product_id);
                if (existingProduct) {
                    existingProduct.quantity += item.quantity;
                } else {
                    acc.push({
                        product_id: item.product_id,
                        quantity: item.quantity
                    });
                }
                return acc;
            }, []);

            setCreateFormData({
                customer_name: order.customer_name,
                customer_phone: order.customer_phone,
                shipping_address: order.shipping_address,
                products: groupedProducts,
                status: detail.status || 'Chờ xử lý'
            });
            setSelectedUserId(detail.user_id || null);
        } catch (error) {
            toast.error('Không thể lấy chi tiết đơn hàng để sửa');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown !== null) {
                // Kiểm tra xem click có phải là bên ngoài dropdown menu không
                const dropdownElement = document.querySelector(`[data-dropdown-id="${activeDropdown}"]`);
                const buttonElement = document.querySelector(`[data-button-id="${activeDropdown}"]`);
                
                if (dropdownElement && !dropdownElement.contains(event.target) && 
                    buttonElement && !buttonElement.contains(event.target)) {
                    setActiveDropdown(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    // Hàm mở modal hóa đơn
    const handleShowInvoice = async (order) => {
        try {
            const res = await OrderApi.getOrderDetail(order.id);
            setInvoiceOrder({ ...res, ...order });
            setShowInvoiceModal(true);
            setActiveDropdown(null);
        } catch (e) {
            toast.error('Không thể lấy thông tin hóa đơn');
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
                                <select
                                    className="form-select float-end me-2"
                                    style={{ width: 'auto' }}
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    {Object.keys(STATUS_MAP).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="form-control float-end me-2"
                                    placeholder="Tìm kiếm theo mã đơn, tên, SĐT..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                                    }}
                                    style={{ width: '250px' }}
                                />
                            </h4>
                        </div>
                        <div className="card-body">
                            {loading ? <p>Đang tải...</p> : (
                                <>
                                    {/* <div className="mb-3">
                                        <Input
                                            placeholder="Tìm kiếm theo mã đơn, tên khách hàng, số điện thoại..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            allowClear
                                        />
                                    </div> */}
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
                                                    <td>{getDisplayStatus(order.status)}</td>
                                                    <td>{order.total_price ? Number(order.total_price).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) : ''}đ</td>
                                                    <td style={{ position: 'relative' }}>
                                                        <button
                                                            className="btn"
                                                            data-button-id={order.id}
                                                            onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                                                        >
                                                            <i className="fas fa-ellipsis-h"></i>
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
                                                                data-dropdown-id={order.id}
                                                            >
                                                                <button className="dropdown-item" onClick={() => { setActiveDropdown(null); handleViewDetail(order); }}>
                                                                    <i className="fas fa-info-circle me-2"></i>Xem chi tiết
                                                                </button>
                                                                {order.status === 'COMPLETED' && (
                                                                    <button className="dropdown-item" onClick={() => handleShowInvoice(order)}>
                                                                        <i className="fas fa-print me-2"></i>In hóa đơn
                                                                    </button>
                                                                )}
                                                                {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                                                                    <>
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
                                                                    </>
                                                                )}
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
                                            {Object.keys(STATUS_MAP).map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                className="btn btn-success"
                                                onClick={async () => {
                                                    setSavingStatusId(statusOrderId);
                                                    try {
                                                        await OrderApi.updateOrderStatus(statusOrderId, STATUS_MAP[newStatus]);
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
                                                            >                                                                {Array.isArray(products) && products
                                                                    .filter(p =>
                                                                        // Chỉ hiển thị sản phẩm chưa được chọn ở dòng khác hoặc là chính dòng này
                                                                        !createFormData.products.some((item, idx2) => item.product_id === p.id && idx2 !== index)
                                                                    )
                                                                    .map(p => (
                                                                        <Select.Option key={p.id} value={p.id}>
                                                                            {p.name} - {Number(p.price).toLocaleString('vi-VN')}đ - Còn {p.quantity || 0} sản phẩm
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
                            {showInvoiceModal && invoiceOrder && (
                                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>                                    <div id="invoice-print-area" style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 400, maxWidth: '95vw', width: 'fit-content', position: 'relative', wordBreak: 'break-word', overflowWrap: 'break-word', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                                            <div style={{ flex: '0 0 auto' }}>
                                                <img src="/logo.svg" alt="Logo" style={{ height: 25 }} />
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <h3 style={{ margin: 0, fontSize: 40 }}>HÓA ĐƠN BÁN HÀNG</h3>
                                            </div>
                                            <div style={{ flex: '0 0 auto', width: 60 }}></div>
                                        </div>
                                        <div style={{ marginBottom: 8 }}><b>Mã đơn hàng:</b> {invoiceOrder.id}</div>
                                        <div style={{ marginBottom: 8 }}><b>Khách hàng:</b> {invoiceOrder.customer_name}</div>
                                        <div style={{ marginBottom: 8 }}><b>Số điện thoại:</b> {invoiceOrder.customer_phone}</div>
                                        <div style={{ marginBottom: 8 }}><b>Địa chỉ giao hàng:</b> {invoiceOrder.shipping_address}</div>
                                        <div style={{ marginBottom: 8 }}><b>Ngày đặt:</b> {invoiceOrder.order_date ? new Date(invoiceOrder.order_date).toLocaleString() : ''}</div>
                                        <div style={{ marginBottom: 8 }}><b>Trạng thái:</b> Hoàn thành</div>
                                        <div style={{ margin: '16px 0 8px 0' }}><b>Danh sách sản phẩm:</b></div>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
                                            <thead>
                                                <tr style={{ background: '#f5f5f5' }}>
                                                    <th style={{ border: '1px solid #ddd', padding: 6 }}>Tên sản phẩm</th>
                                                    <th style={{ border: '1px solid #ddd', padding: 6 }}>Số lượng</th>
                                                    <th style={{ border: '1px solid #ddd', padding: 6 }}>Đơn giá</th>
                                                    <th style={{ border: '1px solid #ddd', padding: 6 }}>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoiceOrder.order_items && invoiceOrder.order_items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td style={{ border: '1px solid #ddd', padding: 6 }}>{item.name || (productMap[item.product_id]?.name || item.product_id)}</td>
                                                        <td style={{ border: '1px solid #ddd', padding: 6, textAlign: 'center' }}>{item.quantity}</td>
                                                        <td style={{ border: '1px solid #ddd', padding: 6, textAlign: 'right' }}>{Number(item.price).toLocaleString('vi-VN')}đ</td>
                                                        <td style={{ border: '1px solid #ddd', padding: 6, textAlign: 'right' }}>{Number(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div style={{ textAlign: 'right', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                                            Tổng tiền: {invoiceOrder.total_price ? Number(invoiceOrder.total_price).toLocaleString('vi-VN') : ''}đ
                                        </div>
                                        <div style={{ textAlign: 'right', marginBottom: 16 }}>
                                            <span style={{ fontStyle: 'italic', color: '#888' }}>Thanh toán khi nhận hàng</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }} className="no-print">
                                            <button className="btn btn-primary" onClick={() => {  
                                                const printContents = document.getElementById('invoice-print-area').innerHTML;
                                                const printWindow = window.open('', '_blank', 'height=700,width=900');
                                                printWindow.document.write('<html><head><title></title>');
                                                printWindow.document.write(`<style>
                                                    @media print { 
                                                        .no-print { display: none !important; }
                                                        @page { margin: 0.5cm; }
                                                        body { font-family: Arial, sans-serif; }
                                                    }
                                                </style>`);                                                
                                                printWindow.document.write('</head><body>');
                                                const dateStr = invoiceOrder.order_date ? new Date(invoiceOrder.order_date).toLocaleDateString('vi-VN') : '';
                                                printWindow.document.write(printContents.replace(/\d{1,2}\/\d{1,2}\/\d{4},\s\d{1,2}:\d{2}:\d{2}\s[AP]M/g, dateStr));
                                                printWindow.document.write('</body></html>');
                                                printWindow.document.close();
                                                printWindow.focus();
                                                setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
                                            }}>
                                                <i className="fas fa-print me-2"></i>In hóa đơn
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => setShowInvoiceModal(false)}>Đóng</button>
                                        </div>
                                        <span onClick={() => setShowInvoiceModal(false)} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng" className="no-print">&times;</span>
                                    </div>
                                </div>
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
                            {Object.keys(STATUS_MAP).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                className="btn btn-success"
                                onClick={async () => {
                                    setSavingStatusId(statusOrderId);
                                    try {
                                        await OrderApi.updateOrderStatus(statusOrderId, STATUS_MAP[newStatus]);
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
                                    .catch(() => setEmail(''));
                            });
                        } else {
                            setEmail(order.customer_name);
                        }
                    }
                })
                .catch(() => { if (mounted) setEmail(''); });
        });
        return () => { mounted = false; };
    }, [orderId]);
    return email || '';
}

export default OrderManager;