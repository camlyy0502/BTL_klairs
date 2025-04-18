import React, { useState } from "react";
import ProductItem from "./ProductItem";

function Product() {
    const [price, setPrice] = useState(500000); // Giá mặc định
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
                            <p className='m-0 me-4'>Hiển thị 1-12 của 17 kết quả</p>
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
                                <button><i class="fas fa-search text-white"></i></button>
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
                                <div className="col-md-4 product-container">
                                    <ProductItem
                                        productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/serum-duong-trang-da-klairs-600x600.jpg'
                                        productPrice='400.000'
                                        productName='Serum Vitamin C dưỡng trắng da Klairs Freshly Jucied Vitamin Drop Serum'
                                        productPriceSale='300.000'
                                        sale='25'
                                    ></ProductItem>
                                </div>
                                <div className='col-md-4 product-container'>
                                    <ProductItem
                                        productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/kem-chong-nang-klairs-1.jpg'
                                        productPrice='400.000'
                                        productName='Kem chống nắng bảo vệ da Klairs Soft Airi UV Essence Spf 50 PA++'
                                        productPriceSale='310.000'
                                        sale='25'
                                    ></ProductItem>
                                </div>
                                <div className='col-md-4 product-container'>
                                    <ProductItem
                                        productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/Klairs-Rich-Moist-Soothing-Cream-600x600.jpg'
                                        productPrice='700.000'
                                        productName='Kem dưỡng ẩm Klairs Rich Moist Soothing Cream'
                                        productPriceSale='500.000'
                                        sale='25'
                                    ></ProductItem>
                                </div>
                                
                                <div className='col-md-4 product-container'>
                                    <ProductItem
                                        productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/Klairs-Rich-Moist-Soothing-Serum-600x600.jpg'
                                        productPrice='400.000'
                                        productName='Serum dưỡng ẩm Klairs Rich Moist Soothing Serum'
                                        productPriceSale='300.000'
                                        sale='25'
                                    ></ProductItem>
                                </div>
                            </div>
                            <div className="mt-3 d-flex align-items-center justify-content-center">
                                <div style={{ background: '#000', color: '#fff' }} className="page">1</div>
                                <div className="page">2</div>
                                <div className="page"><i className="fas fa-arrow-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Product