import React, { useEffect, useState } from 'react';
import DashboardApi from '../../Api/Product/DashboardApi';
import { toast } from 'react-toastify';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [showQuantityForm, setShowQuantityForm] = useState(false);
  const [quantityForm, setQuantityForm] = useState({ product_id: null, quantity: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await DashboardApi.getAllProduct();
      console.log('Products:', res.data);
      setProducts(res.data);
    } catch (e) {
      toast.error('Không thể tải danh sách sản phẩm');
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      image: product.url,
    });
    setEditId(product.product_id);
    setShowForm(true);
  };

  const handleShowQuantityForm = (product) => {
    setQuantityForm({ product_id: product.product_id, quantity: product.quantity });
    setShowQuantityForm(true);
  };

  const handleAdd = () => {
    setForm({ name: '', price: '', image: '' });
    setEditId(null);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (e) => {
    setQuantityForm({ ...quantityForm, quantity: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await DashboardApi.updateProduct({ ...form, product_id: editId });
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await DashboardApi.addProduct(form);
        toast.success('Thêm sản phẩm thành công');
      }
      setShowForm(false);
      fetchProducts();
    } catch (e) {
      toast.error('Lưu sản phẩm thất bại');
    }
  };

  const handleQuantitySubmit = async (e) => {
    e.preventDefault();
    try {
      await DashboardApi.updateProduct({ product_id: quantityForm.product_id, quantity: quantityForm.quantity });
      toast.success('Cập nhật số lượng thành công');
      setShowQuantityForm(false);
      fetchProducts();
    } catch (e) {
      toast.error('Cập nhật số lượng thất bại');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý sản phẩm</h3>
      <button onClick={handleAdd} className="btn btn-primary mb-3">Thêm sản phẩm mới</button>
      {loading ? <p>Đang tải...</p> : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><img src={product.url} alt="img" style={{ width: 60, height: 60, objectFit: 'cover' }} /></td>
                <td>{product.name}</td>
                <td>{product.price?.toLocaleString()}đ</td>
                <td>{product.quantity}</td>
                <td>
                  <button className="btn btn-sm btn-warning" onClick={() => handleEdit(product)}>Sửa</button>
                  <button className="btn btn-sm btn-info ms-2" onClick={() => handleShowQuantityForm(product)}>Cập nhật số lượng</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleFormSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            <h5>{editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h5>
            <input name="name" value={form.name} onChange={handleFormChange} placeholder="Tên sản phẩm" required />
            <input name="price" value={form.price} onChange={handleFormChange} placeholder="Giá" type="number" required />
            <input name="image" value={form.image} onChange={handleFormChange} placeholder="Link hình ảnh" required />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="submit" className="btn btn-success">Lưu</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
            <span onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng">&times;</span>
          </form>
        </div>
      )}
      {showQuantityForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleQuantitySubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            <h5>Cập nhật số lượng</h5>
            <input name="quantity" value={quantityForm.quantity} onChange={handleQuantityChange} placeholder="Số lượng mới" type="number" required />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="submit" className="btn btn-success">Lưu</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowQuantityForm(false)}>Hủy</button>
            </div>
            <span onClick={() => setShowQuantityForm(false)} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng">&times;</span>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductManager;
