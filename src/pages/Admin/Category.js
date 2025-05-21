import React, { useState } from 'react';

function Category() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Sữa rửa mặt' },
    { id: 2, name: 'Kem dưỡng' },
  ]);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Thêm state cho popup xác nhận xóa
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleAdd = () => {
    setForm({ name: '' });
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name });
    setEditId(cat.id);
    setShowForm(true);
  };

  // Khi bấm xóa, chỉ hiện popup xác nhận
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  // Xác nhận xóa
  const confirmDelete = () => {
    setCategories(categories.filter(c => c.id !== deleteId));
    setShowDeletePopup(false);
    setDeleteId(null);
  };

  // Hủy xóa
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteId(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) {
      setCategories(categories.map(c => c.id === editId ? { ...c, name: form.name } : c));
    } else {
      setCategories([...categories, { id: Date.now(), name: form.name }]);
    }
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý loại sản phẩm</h3>
      <button className="btn btn-primary mb-3" onClick={handleAdd}>Thêm loại sản phẩm</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên loại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, idx) => (
            <tr key={cat.id}>
              <td>{idx + 1}</td>
              <td>{cat.name}</td>
              <td>
                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(cat)}>Sửa</button>
                <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(cat.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Popup form thêm/sửa */}
      {showForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <form onSubmit={handleFormSubmit} style={{
            background: '#fff', padding: 24, borderRadius: 10, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative'
          }}>
            <h5>{editId ? 'Sửa loại sản phẩm' : 'Thêm loại sản phẩm'}</h5>
            <input name="name" value={form.name} onChange={handleFormChange} placeholder="Tên loại sản phẩm" required />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="submit" className="btn btn-success">Lưu</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
            <span onClick={() => setShowForm(false)} style={{
              position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888'
            }} title="Đóng">&times;</span>
          </form>
        </div>
      )}
      {/* Popup xác nhận xóa */}
      {showDeletePopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.2)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: 24, borderRadius: 10, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', alignItems: 'center'
          }}>
            <h5>Xác nhận xóa</h5>
            <p>Bạn có chắc muốn xóa loại sản phẩm này?</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-danger" onClick={confirmDelete}>Xóa</button>
              <button className="btn btn-secondary" onClick={cancelDelete}>Hủy</button>
            </div>
            <span onClick={cancelDelete} style={{
              position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888'
            }} title="Đóng">&times;</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;