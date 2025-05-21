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
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [priceForm, setPriceForm] = useState({ product_id: null, price: '' });
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [infoForm, setInfoForm] = useState({ product_id: null, name: '', intro: '', description: '' });
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await DashboardApi.getAllProduct();
      setProducts(res.data);
    } catch (e) {
      toast.error('Không thể tải danh sách sản phẩm');
    }
    setLoading(false);
  };

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

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

  const handleShowPriceForm = (product) => {
    setPriceForm({ product_id: product.product_id, price: product.price });
    setShowPriceForm(true);
  };

  const handlePriceChange = (e) => {
    setPriceForm({ ...priceForm, price: e.target.value });
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    try {
      await DashboardApi.updateProduct({ product_id: priceForm.product_id, price: priceForm.price });
      toast.success('Cập nhật giá thành công');
      setShowPriceForm(false);
      fetchProducts();
    } catch (e) {
      toast.error('Cập nhật giá thất bại');
    }
  };

  const handleShowInfoForm = (product) => {
    setInfoForm({
      product_id: product.product_id,
      name: product.name,
      intro: product.short_description || '',
      description: product.long_description || ''
    });
    setShowInfoForm(true);
  };

  const handleInfoChange = (e) => {
    setInfoForm({ ...infoForm, [e.target.name]: e.target.value });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await DashboardApi.updateProduct({
        product_id: infoForm.product_id,
        name: infoForm.name,
        intro: infoForm.intro,
        description: infoForm.description
      });
      toast.success('Cập nhật thông tin thành công');
      setShowInfoForm(false);
      fetchProducts();
    } catch (e) {
      toast.error('Cập nhật thông tin thất bại');
    }
  };

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

  // Thêm hàm đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-toggle')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="container mt-4">
      <h3>Quản lý sản phẩm</h3>
      <button onClick={handleAdd} className="btn btn-primary mb-3">Thêm sản phẩm mới</button>
      {loading ? <p>Đang tải...</p> : (
        <>
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
              {currentProducts.map(product => (
                <tr key={product.id}>
                  <td><img src={product.url} alt="img" style={{ width: 60, height: 60, objectFit: 'cover' }} /></td>
                  <td>{product.name}</td>
                  <td>{product.price ? Number(product.price).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) : ''}đ</td>
                  <td>{product.quantity}</td>
                  <td style={{ position: 'relative' }}>
                    <button 
                      className="btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === product.id ? null : product.id);
                      }}
                    >
                      ...
                    </button>
                    {activeDropdown === product.id && (
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
                        <button className="dropdown-item" onClick={() => { setActiveDropdown(null); handleShowInfoForm(product); }}>
                          <i className="fas fa-info-circle me-2"></i>Thông tin chi tiết
                        </button>
                        <button className="dropdown-item" onClick={() => { setActiveDropdown(null); handleEdit(product); }}>
                          <i className="fas fa-edit me-2"></i>Sửa thông tin
                        </button>
                        <button className="dropdown-item" onClick={() => { setActiveDropdown(null); handleShowQuantityForm(product); }}>
                          <i className="fas fa-box me-2"></i>Cập nhật số lượng
                        </button>
                        <button className="dropdown-item" onClick={() => { setActiveDropdown(null); handleShowPriceForm(product); }}>
                          <i className="fas fa-dollar-sign me-2"></i>Cập nhật giá
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
      {showPriceForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 2200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handlePriceSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            <h5>Cập nhật giá sản phẩm</h5>
            <input name="price" value={priceForm.price} onChange={handlePriceChange} placeholder="Giá mới" type="number" required />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="submit" className="btn btn-success">Lưu</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowPriceForm(false)}>Hủy</button>
            </div>
            <span onClick={() => setShowPriceForm(false)} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng">&times;</span>
          </form>
        </div>
      )}
      {showInfoForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 2300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleInfoSubmit} style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            <h5>Cập nhật thông tin sản phẩm</h5>
            <input name="name" value={infoForm.name} onChange={handleInfoChange} placeholder="Tên sản phẩm" required />
            <input name="intro" value={infoForm.intro} onChange={handleInfoChange} placeholder="Giới thiệu" />
            <textarea name="description" value={infoForm.description} onChange={handleInfoChange} placeholder="Mô tả" rows={3} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="submit" className="btn btn-success">Lưu</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowInfoForm(false)}>Hủy</button>
            </div>
            <span onClick={() => setShowInfoForm(false)} style={{ position: 'absolute', top: 8, right: 12, fontSize: 22, cursor: 'pointer', color: '#888' }} title="Đóng">&times;</span>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductManager;