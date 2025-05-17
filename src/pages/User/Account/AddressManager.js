import React, { useEffect, useState } from 'react';
import AccountApi from '../../../Api/Account/AccountApi';

function AddressManager({ onSelect, selectedAddressId }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ id: '', address: '', isDefault: false });
    const [showMenuId, setShowMenuId] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await AccountApi.getAddresses();
            setAddresses(res);
        } catch (err) {
            setError('Không thể tải địa chỉ');
        }
        setLoading(false);
    };

    const handleSetDefault = async (id) => {
        try {
            await AccountApi.setDefaultAddress(id);
            fetchAddresses();
        } catch (err) {
            alert('Không thể đặt làm mặc định');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
        try {
            await AccountApi.deleteAddress(id);
            fetchAddresses();
        } catch (err) {
            alert('Không thể xóa địa chỉ');
        }
    };

    const handleEdit = (address) => {
        setForm(address);
        setShowForm(true);
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await AccountApi.updateAddress(form);
            } else {
                await AccountApi.addAddress(form);
            }
            setShowForm(false);
            setForm({ id: '', address: '', isDefault: false });
            fetchAddresses();
        } catch (err) {
            alert('Không thể lưu địa chỉ');
        }
    };

    return (
        <div className="address-manager">
            <h4>Địa chỉ giao hàng</h4>
            {loading ? <p>Đang tải...</p> : null}
            {error ? <p style={{ color: 'red' }}>{error}</p> : null}
            <button onClick={() => { setShowForm(true); setForm({ id: '', address: '', isDefault: false }); }}>Thêm địa chỉ mới</button>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {addresses.map(addr => (
                    <li key={addr.id} style={{
                        margin: '12px 0',
                        padding: 8,
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        background: selectedAddressId === addr.id || (addr.is_default && !selectedAddressId) ? '#e3f2fd' : (addr.is_default ? '#f5f5f5' : '#fff'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        boxShadow: selectedAddressId === addr.id || (addr.is_default && !selectedAddressId) ? '0 0 0 2px #1976d2' : undefined
                    }}
                        onClick={() => onSelect(addr.id)}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input type="radio" checked={selectedAddressId === addr.id || (addr.is_default && !selectedAddressId)} onChange={() => onSelect(addr.id)} onClick={e => e.stopPropagation()} />
                                <span style={{ marginLeft: 8, fontWeight: 500 }}>{addr.recipient_name} - {addr.phone}</span>
                                {addr.is_default && <span style={{ color: 'green', marginLeft: 8 }}>(Mặc định)</span>}
                            </div>
                            <span style={{ marginLeft: 32, color: '#555' }}>{addr.address_line}</span>
                        </div>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span style={{ cursor: 'pointer', fontSize: 20, padding: '0 8px', position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                                onClick={e => {
                                    e.stopPropagation();
                                    setShowMenuId(addr.id === showMenuId ? null : addr.id);
                                }}
                            >&#8942;</span>
                            {showMenuId === addr.id && (
                                <div style={{ position: 'absolute', right: 0, top: 24, background: '#fff', border: '1px solid #ddd', borderRadius: 4, zIndex: 10, minWidth: 120, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', padding: 0 }}>
                                    <button style={{ width: '100%', border: 'none', background: 'none', padding: 8, textAlign: 'left', cursor: 'pointer' }} onClick={() => { handleSetDefault(addr.id); setShowMenuId(null); }}>Đặt làm mặc định</button>
                                    <button style={{ width: '100%', border: 'none', background: 'none', padding: 8, textAlign: 'left', cursor: 'pointer' }} onClick={() => { handleEdit(addr); setShowMenuId(null); }}>Sửa</button>
                                    <button style={{ width: '100%', border: 'none', background: 'none', padding: 8, textAlign: 'left', color: 'red', cursor: 'pointer' }} onClick={() => { handleDelete(addr.id); setShowMenuId(null); }}>Xóa</button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <form onSubmit={handleFormSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', minWidth: 340, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                        <h5 style={{ margin: 0, marginBottom: 8 }}>{form.id ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h5>
                        <input name="recipient_name" value={form.recipient_name || ''} onChange={handleFormChange} placeholder="Tên người nhận" style={{ width: '100%' }} required />
                        <input name="phone" value={form.phone || ''} onChange={handleFormChange} placeholder="Số điện thoại" style={{ width: '100%' }} required />
                        <input name="address_line" value={form.address_line || ''} onChange={handleFormChange} placeholder="Địa chỉ nhận hàng" style={{ width: '100%' }} required />
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button type="submit">Lưu</button>
                            <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
                        </div>
                        <span onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng">&times;</span>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AddressManager;
