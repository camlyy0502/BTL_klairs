import React, { useState, useEffect } from 'react';
import AccountForm from './AccountForm';
import AdminApi from '../../../Api/Admin/AdminApi';
import AccountApi from '../../../Api/Account/AccountApi';
import { toast } from 'react-toastify';

function Account() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const fetchUsers = async () => {
        try {
            const response = await AdminApi.listAccount();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Lấy danh sách tài khoản
    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await AdminApi.listRoles();
                setRoles(response);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchRoles();
    }, []);

    // Lấy user hiện tại
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await AccountApi.info();
                setCurrentUser(user);
            } catch {
                setCurrentUser(null);
            }
        };
        fetchCurrentUser();
    }, []);

    // Lọc danh sách user theo quyền
    useEffect(() => {
        // Chỉ admin mới thấy được các tài khoản admin khác
        if (!currentUser) {
            setFilteredUsers([]);
            return;
        }
        let currentRoleNames = Array.isArray(currentUser.roles)
            ? currentUser.roles.map(r => typeof r === 'string' ? r : r.name)
            : [typeof currentUser.roles === 'string' ? currentUser.roles : currentUser.roles?.name];
        if (currentRoleNames.includes('ADMIN')) {
            setFilteredUsers(users);
        } else {
            // Ẩn user có role ADMIN khỏi danh sách
            setFilteredUsers(users.filter(user => {
                const userRoleNames = Array.isArray(user.roles)
                    ? user.roles.map(roleId => {
                        const found = roles.find(r => r.id === roleId);
                        return found ? found.name : roleId;
                    })
                    : [(() => {
                        const found = roles.find(r => r.id === user.roles);
                        return found ? found.name : user.roles;
                    })()];
                return !userRoleNames.includes('ADMIN');
            }));
        }
    }, [users, currentUser, roles]);

    // Tìm kiếm và phân trang
    const searchResults = filteredUsers.filter(user =>
        Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Lấy users cho trang hiện tại
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = searchResults.slice(indexOfFirstUser, indexOfLastUser);

    // Đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Reset về trang 1 khi tìm kiếm
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const openForm = (user) => {
        setSelectedUser(user);
        setIsFormVisible(true);
    };

    const closeForm = () => {
        setSelectedUser(null);
        setIsFormVisible(false);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Quản lý tài khoản</h5>
                            <div className="d-flex gap-2">
                                <div className="search-box">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm kiếm tài khoản..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setIsFormVisible(true);
                                    }}
                                >
                                    Thêm tài khoản mới
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên người dùng</th>
                                            <th>Email</th>
                                            <th>Số điện thoại</th>
                                            <th>Vai trò</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.map((user, index) => (
                                            <tr key={user.id || index}>
                                                <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>
                                                    {Array.isArray(user.roles)
                                                        ? user.roles.map((roleId, idx) => {
                                                            const found = roles.find(r => r.id === roleId);
                                                            return found ? (
                                                                <span key={roleId} style={{ marginRight: 4 }}>
                                                                    {found.name}{idx < user.roles.length - 1 ? ', ' : ''}
                                                                </span>
                                                            ) : null;
                                                        })
                                                        : (() => {
                                                            const found = roles.find(r => r.id === user.roles);
                                                            return found ? found.name : user.roles;
                                                        })()}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => openForm(user)}
                                                    >Chi tiết</button>
                                                    {(() => {
                                                        const userRoleNames = Array.isArray(user.roles)
                                                            ? user.roles.map(roleId => {
                                                                const found = roles.find(r => r.id === roleId);
                                                                return found ? found.name : roleId;
                                                            })
                                                            : [(() => {
                                                                const found = roles.find(r => r.id === user.roles);
                                                                return found ? found.name : user.roles;
                                                            })()];
                                                        if (!userRoleNames.includes('CUSTOMER') && !userRoleNames.includes('ADMIN') && currentUser.roles.includes('ADMIN')) {
                                                            return (
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={async () => {
                                                                        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
                                                                            try {
                                                                                await AdminApi.deleteAccount(user.id);
                                                                                toast.success('Xóa tài khoản thành công!');
                                                                            } catch {
                                                                                toast.error('Xóa tài khoản thất bại!');
                                                                            }
                                                                            fetchUsers();
                                                                        }
                                                                    }}
                                                                >Xóa</button>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {searchResults.length > usersPerPage && (
                                <div className="d-flex justify-content-center mt-4">
                                    <nav>
                                        <ul className="pagination">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => paginate(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Trước
                                                </button>
                                            </li>
                                            {Array.from({ length: Math.ceil(searchResults.length / usersPerPage) }).map((_, index) => (
                                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                                        {index + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === Math.ceil(searchResults.length / usersPerPage) ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => paginate(currentPage + 1)}
                                                    disabled={currentPage === Math.ceil(searchResults.length / usersPerPage)}
                                                >
                                                    Sau
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isFormVisible && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    {selectedUser ? (
                        <UserDetailPopup 
                            user={selectedUser} 
                            roles={roles} 
                            onClose={closeForm} 
                            onRoleChange={() => window.location.reload()} 
                            currentUser={currentUser} 
                        />
                    ) : (
                        <AccountForm onClose={closeForm} onCreated={fetchUsers} />
                    )}
                </>
            )}
        </div>
    );
}

function UserDetailPopup({ user, roles, onClose, onRoleChange, currentUser }) {
    const [addresses, setAddresses] = React.useState([]);
    React.useEffect(() => {
        if (user && user.id) {
            import('../../../Api/Admin/AdminApi').then(({ default: AdminApi }) => {
                AdminApi.listAddressAdmin(user.email)
                    .then(list => setAddresses(Array.isArray(list) ? list : []))
                    .catch(() => setAddresses([]));
            });
        }
    }, [user]);

    const defaultAddress = addresses.find(addr => addr.is_default);
    const isCustomer = Array.isArray(user.roles)
        ? user.roles.some(roleId => {
            const found = roles.find(r => r.id === roleId);
            return (found ? found.name : roleId) === 'CUSTOMER';
        })
        : (() => {
            const found = roles.find(r => r.id === user.roles);
            return (found ? found.name : user.roles) === 'CUSTOMER';
        })();

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 340, maxWidth: '90vw', width: 'fit-content', position: 'relative' }}>
                <h5>Thông tin tài khoản</h5>
                <p><b>Username:</b> {user.username}</p>
                <p><b>Email:</b> {user.email}</p>
                <p><b>Số điện thoại:</b> {user.phone || 'Chưa cập nhật'}</p>
                <p><b>Role:</b> {
                    Array.isArray(user.roles)
                        ? user.roles.map((roleId, idx) => {
                            const found = roles.find(r => r.id === roleId);
                            return found ? (
                                <span key={roleId} style={{ marginRight: 4 }}>
                                    {found.name}{idx < user.roles.length - 1 ? ', ' : ''}
                                </span>
                            ) : null;
                        })
                        : (() => {
                            const found = roles.find(r => r.id === user.roles);
                            return found ? found.name : user.roles;
                        })()
                }
                </p>
                {isCustomer && (
                    <p><b>Địa chỉ mặc định:</b> {defaultAddress ? `${defaultAddress.address_line}` : 'Chưa có'}</p>
                )}
                <button className="btn btn-secondary mt-2" onClick={onClose}>Đóng</button>
                <span onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng">&times;</span>
            </div>
        </div>
    );
}

export default Account;