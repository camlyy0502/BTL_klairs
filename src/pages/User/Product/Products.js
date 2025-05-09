import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import DashboardApi from '../../../Api/Product/DashboardApi';
// import { useNavigate } from 'react-router-dom';


function Product() {
    const [price, setPrice] = useState(500000); // Giá mặc định
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchLimitProduct = async () => {
            try {
              const res = await DashboardApi.getLimitProduct(12);
              setProducts(res.data);
            } catch (error) {
              throw error;
            }
          };
          fetchLimitProduct();
    }, []);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [total, setTotal] = useState();
    const [limit, setLimit] = useState(9);

    const fetchProducts = async (page) => {
        try {
            const res = await DashboardApi.getLimitProduct(limit, page);
            setProducts(res.data);
            setTotalPages(res.pages);
            setTotal(res.total);
            setLimit(9);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // const navigate = useNavigate();

    return (
        <div className='container-fluid p-0 mb-5 product'>
            <div className='product-banner p-0'>
            </div>
            <div className='container mt-4'>
                <div className='custom-container'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <div>
                            <p className="m-0" style={{ fontSize: '18px' }}>
                                <span style={{ color: '#666666B3' }}>TRANG CHỦ /</span>
                                <span style={{ fontWeight: '600', marginLeft: '8px' }}>CỬA HÀNG</span>
                            </p>
                        </div>
                        <div className='d-flex align-items-center justify-content-center'>
                            <p className='m-0 me-4'>Hiển thị {currentPage != 1 ? (limit*(currentPage-1)+1) : 1}-{limit*currentPage < total ? limit*currentPage : total} của {total} kết quả</p>
                            <select>
                                <option>Thứ tự mặc định</option>
                                <option>Thứ tự theo mức độ phổ biến</option>
                                <option>Thứ tự theo điểm đánh giá</option>
                                <option>Mới nhất</option>
                                <option>Theo thứ tự giá : Thấp đến cao</option>
                                <option>Theo thứ tự giá : Cao đến thấp</option>
                            </select>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-3'>
                            <div className='product-search d-flex align-items-center'>
                                <input type='text' placeholder='Tìm kiếm...' />
                                <button><i className="fas fa-search text-white"></i></button>
                            </div>
                            <h5 className="mt-4">Lọc theo giá</h5>
                            <input
                                type="range"
                                className="form-range"
                                min="100000"
                                max="5000000"
                                step="100000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <div className="d-flex align-items-center justify-content-between">
                                <button style={{ background: '#666', borderRadius: '99px', width: '55px', height: '30px', border: 'none ', color: '#fff' }}>Lọc</button>
                                <p className="m-0">Giá: <strong>
                                    <span>{price.toLocaleString()}</span>
                                    <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                        đ
                                    </span></strong></p>
                            </div>
                        </div>
                        <div className='col-md-9'>
                            <div className="row">
                                {
                                    products.map((product, index) => (
                                        <div
                                            className="col-md-4 product-container"
                                            key={index}
                                        >
                                            <ProductItem
                                                productId={product.id}
                                                productImg={product.url}
                                                productPrice={product.price}
                                                productName={product.name}
                                                productPriceSale="500000"
                                                sale={product.sale}
                                                quantity={product.quantity}
                                            ></ProductItem>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="mt-3 d-flex align-items-center justify-content-center">
                                {currentPage > 1 && (
                                    <div
                                        style={{ background: '#fff', color: '#000' }}
                                        className="page"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                    </div>
                                )}
                                {[...Array(totalPages)].map((_, index) => (
                                    <div
                                        key={index}
                                        style={{ background: currentPage === index + 1 ? '#000' : '#fff', color: currentPage === index + 1 ? '#fff' : '#000' }}
                                        className="page"
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                                {currentPage < totalPages && (
                                    <div
                                        style={{ background: '#fff', color: '#000' }}
                                        className="page"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        <i className="fas fa-arrow-right"></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product