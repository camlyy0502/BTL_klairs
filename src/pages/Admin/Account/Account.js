import React, { useState, useEffect } from 'react';
import AccountForm from './AccountForm';
import AdminApi from '../../../Api/Admin/AdminApi';

function Account() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const openForm = () => {
        // setSelectedUserId(userId);
        setIsFormVisible(true);
    };

    const [users, setUsers] = useState([]);

    const [roles, setRoles] = useState([]);

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
    
    // Đóng form
    const closeForm = () => {
        setIsFormVisible(false);
    };
    return (
        <div>
            <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingLeft: '4px' }}>
                <div className="container supplier pt-3">
                    <button type="button" class="btn btn-success " onClick={() => {
                        openForm();
                    }

                    }>Thêm</button>
                    {isFormVisible && (
                        <>
                            <div className="overLay"></div> {/* Lớp overlay */}
                            <AccountForm
                                onClose={closeForm} /> {/* Form */}
                        </>
                    )}
                </div>

                <div className='container pt-4'>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Roles</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id || index}>
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
                                            className="btn btn-warning btn-sm mr-2"
                                            onClick={() => openForm()}
                                        >Sửa</button>
                                        <button
                                            style={{ marginLeft: '8px' }}
                                            className="btn btn-danger btn-sm"
                                            // onClick={() => deleteUser(user.id)}
                                        >Xóa</button>
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

export default Account