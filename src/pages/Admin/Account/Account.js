import React, { useState, useEffect } from 'react';
import AccountForm from './AccountForm';
import AdminApi from '../../../Api/Admin/AdminApi';
import AccountApi from '../../../Api/Account/AccountApi';
import { toast } from 'react-toastify';

function Account() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openForm = (user) => {
        setSelectedUser(user);
        setIsFormVisible(true);
    };

    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        try {
            const response = await AdminApi.listAccount();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const [roles, setRoles] = useState([]);

    const [currentUser, setCurrentUser] = useState(null);

    const [filteredUsers, setFilteredUsers] = useState([]);

    // Lấy danh sách tài khoản
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await AdminApi.listAccount();
                setUsers(response);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
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
    // Lấy user hiện tại (giả sử có API hoặc localStorage lưu user)
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

    // Đóng form
    const closeForm = () => {
        setIsFormVisible(false);
    };
    return (
        <div>
            <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingLeft: '4px' }}>
                <div className="container supplier pt-3">
                    <button type="button" className="btn btn-success" onClick={() => {
                        setSelectedUser(null);
                        setIsFormVisible(true);
                    }}>Thêm</button>
                    {isFormVisible && (
                        <>
                            <div className="overLay"></div>
                            {selectedUser ? (
                                <UserDetailPopup user={selectedUser} roles={roles} onClose={closeForm} onRoleChange={() => window.location.reload()} currentUser={currentUser} />
                            ) : (
                                <AccountForm onClose={closeForm} onCreated={fetchUsers} />
                            )}
                        </>
                    )}
                </div>
                <div className='container pt-4'>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Roles</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id || index}>
                                    <td>{index+1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
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
                                            className="btn btn-warning btn-sm mr-2"
                                            onClick={() => openForm(user)}
                                        >Chi tiết</button>
                                        {/* <button
                                            className="btn btn-warning btn-sm mr-2"
                                            onClick={() => openForm(user)}
                                        >Sửa</button> */}
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
                                            if (!userRoleNames.includes('CUSTOMER') && !userRoleNames.includes('ADMIN')) {
                                                return (
                                                    <button
                                                        style={{ marginLeft: '8px' }}
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
            </div>
        </div>
    )
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
    // const roleNames = Array.isArray(user.roles)
    //     ? user.roles.map(roleId => {
    //         const found = roles.find(r => r.id === roleId);
    //         return found ? found.name : roleId;
    //     }).join(', ')
    //     : (() => {
    //         const found = roles.find(r => r.id === user.roles);
    //         return found ? found.name : user.roles;
    //     })();
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
    // const [selectedRole, setSelectedRole] = React.useState(user.roles && Array.isArray(user.roles) ? user.roles[0] : user.roles);
    // const [isUpdating, setIsUpdating] = React.useState(false);
    // const canEditRole = currentUser && (Array.isArray(currentUser.roles)
    //     ? currentUser.roles.some(r => (typeof r === 'string' ? r : r.name) === 'ADMIN')
    //     : (typeof currentUser.roles === 'string' ? currentUser.roles : currentUser.roles?.name) === 'ADMIN');
    //   console.log('user', user);

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
                {/* {canEditRole ? (
                  <span>
                    <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} disabled={isUpdating}>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <button className="btn btn-primary btn-sm ml-2" disabled={isUpdating} onClick={async () => {
                      setIsUpdating(true);
                      try {
                        await AdminApi.changeRoleUser(user.id, { role_id: selectedRole });
                        toast.success('Cập nhật role thành công!');
                        if (onRoleChange) onRoleChange();
                      } catch {
                        toast.error('Cập nhật role thất bại!');
                      } finally {
                        setIsUpdating(false);
                      }
                    }}>Lưu</button>
                  </span>
                ) : roleNames} */}
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

export default Account