import React, { useEffect, useState } from 'react';
import ProductApi from '../../Api/Admin/ProductApi';
import CategoryAdminApi from '../../Api/Admin/CategoryAdminApi';
import { toast } from 'react-toastify';
import { getFullImageUrl } from '../../utils/imageUrl';
import './ProductManager.css';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: 0,
    short_description: '',
    long_description: '',
    origin: '',
    category_id: '',
    thumbnail: null,
    thumbnailPreview: null
  });
  const [editId, setEditId] = useState(null);
  const [showQuantityForm, setShowQuantityForm] = useState(false);
  const [quantityForm, setQuantityForm] = useState({ product_id: null, quantity: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);  // State và cấu hình cho phân trang
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await CategoryAdminApi.getCategories();
      setCategories(res);
    } catch (e) {
      toast.error('Không thể tải danh sách danh mục');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await ProductApi.getAllProduct();
      setProducts(res.data);
    } catch (e) {
      toast.error('Không thể tải danh sách sản phẩm');
    }
    setLoading(false);
  };

  // Tính toán dữ liệu cho trang hiện tại và lọc sản phẩm theo tìm kiếm  // Lọc sản phẩm dựa trên từ khóa tìm kiếm
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return searchTerm === '' ? true : (
      product.name?.toLowerCase().includes(searchLower) ||
      product.id?.toString().includes(searchTerm) ||
      product.price?.toString().includes(searchTerm) ||
      product.short_description?.toLowerCase().includes(searchLower)
    );
  });

  // Tính toán phân trang
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem); const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  // Removed unused handleEdit function

  const handleShowQuantityForm = (product) => {
    setQuantityForm({ product_id: product.id, quantity: product.quantity });
    setShowQuantityForm(true);
  };
  const handleAdd = () => {
    setForm({
      name: '',
      price: '',
      quantity: 0,
      short_description: '',
      long_description: '',
      origin: '',
      category_id: '',
      thumbnail: null,
      thumbnailPreview: null
    });
    setEditId(null);
    setShowForm(true);
  };
  const handleFormChange = (e) => {
    if (e.target.name === 'thumbnail') {
      const file = e.target.files[0];
      if (file) {
        setForm({
          ...form,
          thumbnail: file,
          thumbnailPreview: URL.createObjectURL(file)
        });
      }
    } else if (e.target.name === 'quantity') {
      setForm({ ...form, quantity: parseInt(e.target.value) || 0 });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantityForm({ ...quantityForm, quantity: value });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Create product JSON data
      const productData = {
        name: form.name,
        price: form.price,
        quantity: form.quantity || 0,
        short_description: form.short_description,
        long_description: form.long_description,
        origin: form.origin ? "Xuất xứ: " + form.origin : "",
        category_id: form.category_id
      };

      // Append the product JSON
      formData.append('product', JSON.stringify(productData));

      // Append the thumbnail
      if (form.thumbnail) {
        formData.append('thumb', form.thumbnail);
      }

      // if (editId) {
      //   // formData.append('product_id', editId);
      //   await ProductApi.updateProduct(editId, formData);
      //   toast.success('Cập nhật sản phẩm thành công');
      // } else {
      // }
      await ProductApi.addProduct(formData);
      toast.success('Thêm sản phẩm thành công');
      setShowForm(false);
      fetchProducts();
    } catch (e) {
      toast.error('Thêm sản phẩm thất bại');
    }
  }; const handleQuantitySubmit = async (e) => {
    e.preventDefault();
    try {
      const quantity = parseInt(quantityForm.quantity) || 0;
      if (quantity < 0) {
        toast.error('Số lượng không thể là số âm');
        return;
      }
      await ProductApi.updateProductQuantity(quantityForm.product_id, { quantity: quantity });
      toast.success('Cập nhật số lượng thành công');
      setShowQuantityForm(false);
      fetchProducts();
    } catch (e) {
      toast.error('Cập nhật số lượng thất bại');
    }
  };

  const handleViewDetail = async (productId) => {
    try {
      const product = await ProductApi.getDetailProduct(productId);
      setSelectedProduct(product.product); // hoặc set state để hiển thị modal chi tiết
      setShowDetailModal(true);
    } catch (error) {
      toast.error('Không thể lấy thông tin sản phẩm');
    }
  };
  const handleEditProduct = async (productId) => {
    try {
      const product = await ProductApi.getDetailProduct(productId);
      setEditingProduct(product.product); // hoặc set state để fill form sửa
      setShowEditModal(true);
    } catch (error) {
      toast.error('Không thể lấy thông tin sản phẩm');
    }
  };
  const handleDelete = (productId) => {
    setDeletingProduct(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await ProductApi.deleteProduct(deletingProduct);
      toast.success('Xóa sản phẩm thành công');
      setShowDeleteModal(false);
      setDeletingProduct(null);
      fetchProducts(); // Refresh the products list
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
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

  // CSS styles cho modal
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative'
  };

  const modalCloseButton = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    border: 'none',
    background: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    transition: 'all 0.2s'
  };

  const formGroupStyle = {
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#333'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    transition: 'border-color 0.2s'
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4>Danh sách sản phẩm
                <button
                  className="btn btn-primary btn-sm float-end"
                  onClick={() => handleAdd()}
                >Thêm sản phẩm
                </button>
                <input
                  type="text"
                  className="form-control float-end me-2"
                  placeholder="Tìm kiếm theo tên sản phẩm, giá,..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                  }}
                  style={{ width: '250px' }}
                />
              </h4>
            </div>

            {/* Product table */}
            <div className="overflow-x-auto">
              {loading ? (
                <p>Đang tải...</p>
              ) : (
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
                        <tr key={product.id || product.product_id}>
                          <td>
                            <img
                              src={getFullImageUrl(product.url)}
                              alt="img"
                              style={{ width: 60, height: 60, objectFit: 'cover' }}
                            />
                          </td>
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
                              <div className="dropdown-menu show" style={{
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
                              }}>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleViewDetail(product.id);
                                  }}
                                >
                                  <i className="fas fa-info-circle me-2"></i>Thông tin chi tiết
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleEditProduct(product.id);
                                  }}
                                >
                                  <i className="fas fa-edit me-2"></i>Sửa thông tin
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleShowQuantityForm(product);
                                  }}
                                >
                                  <i className="fas fa-box me-2"></i>Cập nhật số lượng
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleDelete(product.id);
                                  }}
                                >
                                  <i className="fas fa-trash me-2"></i>Xóa
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination */}
                  {renderPagination()}
                </>
              )}
            </div>

            {/* Modals */}
            {showForm && (
              <div className="modal-overlay" style={modalOverlayStyle}>
                <form onSubmit={handleFormSubmit} className="modal-form" style={modalContentStyle}>
                  <h5>{editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h5>

                  <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Tên sản phẩm</label>
                    <input
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Nhập tên sản phẩm"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Mô tả ngắn</label>
                    <textarea
                      className="form-control"
                      name="short_description"
                      value={form.short_description}
                      onChange={handleFormChange}
                      placeholder="Nhập mô tả ngắn về sản phẩm"
                      rows={3}
                      // required 
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Danh mục sản phẩm</label>
                    <select
                      className="form-control"
                      name="category_id"
                      value={form.category_id}
                      onChange={handleFormChange}
                      // required
                      style={inputStyle}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Mô tả chi tiết</label>
                    <textarea
                      className="form-control"
                      name="long_description"
                      value={form.long_description}
                      onChange={handleFormChange}
                      placeholder="Nhập mô tả chi tiết về sản phẩm"
                      rows={5}
                      // required 
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Xuất xứ</label>
                    <input
                      className="form-control"
                      name="origin"
                      value={form.origin}
                      onChange={handleFormChange}
                      placeholder="Nhập xuất xứ sản phẩm"
                      // required 
                      style={inputStyle}
                    />
                  </div>
                  <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Giá (VNĐ)</label>
                    <input
                      className="form-control"
                      name="price"
                      value={form.price}
                      onChange={handleFormChange}
                      placeholder="Nhập giá sản phẩm"
                      type="number"
                      min="1"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Số lượng</label>
                    <input
                      className="form-control"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleFormChange}
                      placeholder="Nhập số lượng sản phẩm"
                      type="number"
                      min="0"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Hình ảnh</label>
                    <input
                      className="form-control"
                      type="file"
                      name="thumbnail"
                      onChange={handleFormChange}
                      accept="image/*"
                      required={!editId} // Chỉ required khi thêm mới
                      style={inputStyle}
                    />
                    {form.thumbnailPreview && (
                      <img
                        src={form.thumbnailPreview}
                        alt="Preview"
                        style={{
                          marginTop: 8,
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                    {editId && !form.thumbnailPreview && form.thumb && (
                      <img
                        src={getFullImageUrl(form.thumb)}
                        alt="Current"
                        style={{
                          marginTop: 8,
                          maxWidth: '200px',
                          maxHeight: '200px',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button type="submit" className="btn btn-success">Lưu</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
                  </div>
                  <button onClick={() => setShowForm(false)} style={modalCloseButton} title="Đóng">&times;</button>
                </form>
              </div>
            )}
            {showQuantityForm && (
              <div className="modal-overlay" style={modalOverlayStyle}>
                <form onSubmit={handleQuantitySubmit} className="modal-form" style={modalContentStyle}>
                  <h5>Cập nhật số lượng</h5>
                  <input
                    name="quantity"
                    value={quantityForm.quantity}
                    onChange={handleQuantityChange}
                    placeholder="Số lượng mới"
                    type="number"
                    min="1"
                    step="1"
                    required
                    style={inputStyle}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="submit" className="btn btn-success">Lưu</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowQuantityForm(false)}>Hủy</button>
                  </div>
                  <button onClick={() => setShowQuantityForm(false)} style={modalCloseButton} title="Đóng">&times;</button>
                </form>
              </div>
            )}
          </div>
          {/* {showInfoForm && (
            <div className="modal-overlay" style={modalOverlayStyle}>
              <form onSubmit={handleInfoSubmit} className="modal-form" style={modalContentStyle}>
                <h5>Cập nhật thông tin sản phẩm</h5>
                <input name="name" value={infoForm.name} onChange={handleInfoChange} placeholder="Tên sản phẩm" required style={inputStyle} />
                <input name="intro" value={infoForm.intro} onChange={handleInfoChange} placeholder="Giới thiệu" style={inputStyle} />
                <textarea name="description" value={infoForm.description} onChange={handleInfoChange} placeholder="Mô tả" rows={3} style={inputStyle} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button type="submit" className="btn btn-success">Lưu</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowInfoForm(false)}>Hủy</button>
                </div>
                <button onClick={() => setShowInfoForm(false)} style={modalCloseButton} title="Đóng">&times;</button>
              </form>
            </div>
          )} */}
          {showDetailModal && selectedProduct && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 2400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#fff', padding: 24, borderRadius: 10, minWidth: 600, maxWidth: '90%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                <h5>Chi tiết sản phẩm</h5>
                <div className="row">
                  <div className="col-md-4" style={{ marginBottom: 16 }}>
                    <img
                      src={getFullImageUrl(selectedProduct.thumb)}
                      alt="Product"
                      style={{
                        width: '100%',
                        maxWidth: 220,
                        maxHeight: 220,
                        borderRadius: 8,
                        objectFit: 'contain',
                        background: '#fafafa',
                        border: '1px solid #eee'
                      }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="mb-2"><strong>Tên sản phẩm:</strong> {selectedProduct.name}</div>
                    <div className="mb-2"><strong>Danh mục:</strong> {categories.find(cat => cat.id === selectedProduct.category_id)?.name || selectedProduct.category_id}</div>
                    <div className="mb-2"><strong>Giá:</strong> {selectedProduct.price ? Number(selectedProduct.price).toLocaleString('vi-VN') : ''}đ</div>
                    <div className="mb-2"><strong>Số lượng:</strong> {selectedProduct.quantity}</div>
                    <div className="mb-2"><strong>Xuất xứ:</strong> {selectedProduct.origin.split(": ")[1]}</div>
                    <div className="mb-2"><strong>Mô tả ngắn:</strong> {selectedProduct.short_description}</div>
                    <div className="mb-2"><strong>Mô tả chi tiết:</strong>
                      <div style={{ color: '#444', marginTop: 4 }}>
                        {selectedProduct.long_description
                          ? selectedProduct.long_description.split('||').map((html, idx) => (
                            <div key={idx} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: html }} />
                          ))
                          : <span>Không có</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
                </div>
                <button onClick={() => setShowDetailModal(false)} style={modalCloseButton} title="Đóng">&times;</button>
              </div>
            </div>
          )}
          {showEditModal && editingProduct && (
            <div className="modal-overlay" style={modalOverlayStyle}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const formData = new FormData();
                    const productData = {
                      name: editingProduct.name,
                      price: editingProduct.price,
                      quantity: editingProduct.quantity || 0,
                      short_description: editingProduct.short_description,
                      long_description: editingProduct.long_description,
                      origin: editingProduct.origin ? "Xuất xứ: " + editingProduct.origin : "",
                      category_id: editingProduct.category_id
                    };

                    // Append the product JSON
                    formData.append('product', JSON.stringify(productData));

                    // Append the thumbnail
                    if (editingProduct.thumbnail instanceof File) {
                      formData.append('thumb', editingProduct.thumbnail);
                    }
                    // formData.append('thumb', form.thumbnail);
                    await ProductApi.updateProduct(editingProduct.id, formData);

                    toast.success('Cập nhật sản phẩm thành công');
                    setShowEditModal(false);
                    fetchProducts();
                  } catch (e) {
                    toast.error('Cập nhật sản phẩm thất bại');
                    console.error('Update error:', e);
                  }
                }}
                className="modal-form"
                style={modalContentStyle}
              >
                <h5>Sửa sản phẩm</h5>
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input className="form-control" name="name" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Mô tả ngắn</label>
                  <textarea className="form-control" name="short_description" value={editingProduct.short_description} onChange={e => setEditingProduct({ ...editingProduct, short_description: e.target.value })} rows={3} />
                </div>
                <div className="form-group">
                  <label>Danh mục sản phẩm</label>
                  <select className="form-control" name="category_id" value={editingProduct.category_id} onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}>
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Mô tả chi tiết</label>
                  <textarea className="form-control" name="long_description" value={editingProduct.long_description} onChange={e => setEditingProduct({ ...editingProduct, long_description: e.target.value })} rows={5} />
                </div>
                <div className="form-group">
                  <label>Xuất xứ</label>
                  <input className="form-control" name="origin" value={editingProduct.origin} onChange={e => setEditingProduct({ ...editingProduct, origin: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Giá (VNĐ)</label>
                  <input className="form-control" name="price" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} type="number" required />
                </div>
                {/* XÓA hoặc COMMENT trường số lượng ở đây */}

                <div className="form-group">
                  <label>Số lượng</label>
                  <input className="form-control" name="quantity" value={editingProduct.quantity} onChange={e => setEditingProduct({ ...editingProduct, quantity: e.target.value })} type="number" min="0" required />
                </div>

                <div className="form-group">
                  <label>Hình ảnh</label>
                  <input className="form-control" type="file" name="thumbnail" onChange={e => {
                    const file = e.target.files[0];
                    console.log('Selected file:', file);
                    if (file) {
                      setEditingProduct({ ...editingProduct, thumbnail: file, url: URL.createObjectURL(file) });
                    }
                  }} accept="image/*" />
                  {editingProduct.thumb && (
                    <img src={getFullImageUrl(editingProduct.thumb)} alt="Preview" style={{ marginTop: 8, maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} />
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button type="submit" className="btn btn-success">Lưu</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Hủy</button>
                </div>
                <button onClick={() => setShowEditModal(false)} style={modalCloseButton} title="Đóng">&times;</button>
              </form>
            </div>)}
          {showDeleteModal && (
            <div className="modal-overlay" style={modalOverlayStyle}>
              <div className="modal-form" style={modalContentStyle}>
                <h5>Xác nhận xóa sản phẩm</h5>
                <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingProduct(null);
                  }}>Hủy</button>
                  <button className="btn btn-danger" onClick={confirmDelete}>
                    Xóa
                  </button>
                </div>
                <button onClick={() => setShowDeleteModal(false)} style={modalCloseButton} title="Đóng">&times;</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
}

export default ProductManager;