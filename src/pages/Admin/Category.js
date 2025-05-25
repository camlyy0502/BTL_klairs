import React, { useState, useEffect } from 'react';
import CategoryAdminApi from '../../Api/Admin/CategoryAdminApi';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';

function Category() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
  const confirmDelete = async () => {
    try {
      await CategoryAdminApi.deleteCategory(deleteId);
      toast.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error) {
      toast.error('Xóa danh mục thất bại');
    }
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
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await CategoryAdminApi.getCategories();
      setCategories(response);
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục');
    }
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    
    try {
      if (editId) {
        await CategoryAdminApi.updateCategory(editId, form);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await CategoryAdminApi.createCategory(form);
        toast.success('Thêm danh mục thành công');
      }
      fetchCategories();
      setShowForm(false);
    } catch (error) {
      toast.error(editId ? 'Cập nhật danh mục thất bại' : 'Thêm danh mục thất bại');
    }
  };    return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4>Quản lý danh mục
                <button
                  className="btn btn-primary btn-sm float-end"
                  onClick={() => handleAdd()}
                >
                  Thêm danh mục mới
                </button>
                <input
                  type="text"
                  className="form-control float-end me-2"
                  placeholder="Tìm kiếm theo tên danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '250px' }}
                />
              </h4>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Đang tải...</p>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên loại</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.filter(category => {
                      const searchLower = searchTerm.toLowerCase();
                      return searchTerm === '' ? true : (
                        category.name?.toLowerCase().includes(searchLower) ||
                        category.id?.toString().includes(searchTerm)
                      );
                    }).map((cat, idx) => (
                      <tr key={cat.id}>
                        <td>{idx + 1}</td>
                        <td>{cat.name}</td>
                        <td>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cat)}>Sửa</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa danh mục */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Sửa danh mục' : 'Thêm danh mục mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Tên danh mục</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            {editId ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal show={showDeletePopup} onHide={() => setShowDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa danh mục này không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeletePopup(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Category;