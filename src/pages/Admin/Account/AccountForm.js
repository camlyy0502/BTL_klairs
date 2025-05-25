import React, { useState, useEffect } from 'react';
import AdminApi from '../../../Api/Admin/AdminApi';
import { toast } from 'react-toastify';

const AccountForm = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        password: ''
    });
    const [roles, setRoles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        AdminApi.listRoles().then(setRoles).catch(() => setRoles([]));
        // Lấy user hiện tại
        import('../../../Api/Account/AccountApi').then(({ default: AccountApi }) => {
            AccountApi.info().then(setCurrentUser).catch(() => setCurrentUser(null));
        });
    }, []);

    // Lọc role theo quyền
    const filteredRoles = React.useMemo(() => {
        if (!currentUser) return [];
        let userRoleNames = Array.isArray(currentUser.roles)
            ? currentUser.roles.map(r => typeof r === 'string' ? r : r.name)
            : [typeof currentUser.roles === 'string' ? currentUser.roles : currentUser.roles?.name];
        if (userRoleNames.includes('ADMIN')) return roles;
        if (userRoleNames.includes('SALE')) return roles.filter(r => r.name === 'CUSTOMER');
        return [];
    }, [roles, currentUser]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Gọi API tạo tài khoản (bạn cần chỉnh lại endpoint cho đúng backend)
            const res = await AdminApi.createAccount({
                username: form.email,
                email: form.email,
                phone: form.phone,
                address: form.address,
                password: form.password,
                role_id: form.role
            });
            toast.success('Tạo tài khoản thành công!');
            onClose();
        } catch (err) {
            console.log(err);
            toast.error((err && err.response && err.response.data && err.response.data.message) || 'Có lỗi xảy ra khi tạo tài khoản');
            onClose();
        } finally {
            setIsSubmitting(false);
            if (onCreated) onCreated();
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 340, maxWidth: '90vw', width: 'fit-content', position: 'relative' }}>
                <form onSubmit={handleSubmit}>
                    <h5>Thêm tài khoản mới</h5>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Nhập mật khẩu"
                            name="password"
                            value={form.password || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập số điện thoại"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Địa chỉ</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập địa chỉ"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Vai trò</label>
                        <select
                            className="form-select"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Chọn vai trò</option>
                            {filteredRoles.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
                <span
                    onClick={onClose}
                    style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }}
                    title="Đóng"
                >
                    &times;
                </span>
            </div>
        </div>
    );
}

export default AccountForm;