import React, { useEffect, useState } from "react";

import { useParams } from 'react-router-dom'
import DashboardApi from "../../../Api/Product/DashboardApi";

function ProductDetails() {
    const { productId } = useParams();
    const [productDetails, setProductDetails] = useState({});
    const [showBuyBox, setShowBuyBox] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBuyBox(true);
            } else {
                setShowBuyBox(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await DashboardApi.getDetailProduct(productId);
                setProductDetails(response.product);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    return (
        <div className='container product_details mb-5 '>
            <div className='custom-container' style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <div className='row'>
                    <div className='col-md-6 product_details-img'>
                        <img src={productDetails.thumb} alt={productDetails.name} />
                        {productDetails.sale && <div className='sale'>-{productDetails.sale}%</div>}
                    </div>
                    <div className='col-md-4'>
                        <p style={{ color: '#666666B3' }}>
                            <span style={{ fontWeight: '600' }}>TRANG CHỦ /</span>
                            <span style={{ fontWeight: '600', marginLeft: '8px' }}>CỬA HÀNG /</span>
                            <span style={{ fontWeight: '600', marginLeft: '8px' }}>{productDetails.category}</span>
                        </p>
                        <p style={{ fontSize: '1.7em', fontWeight: '700' }}>{productDetails.name}</p>
                        <p className='mt-1' style={{ fontSize: '24px' }}>
                            <span style={{ textDecoration: productDetails.sale > 0 ? 'line-through' : 'none', color: '#777', fontWeight: '400' }}>
                                <span>{productDetails.price}</span>
                                <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                    đ
                                </span>
                            </span>
                            {productDetails.sale > 0 && (
                            <span style={{ marginLeft: '12px', fontWeight: '600' }}>
                                <span>{productDetails.salePrice}</span>
                                <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                    đ
                                </span>
                            </span>
                            )}
                        </p>
                        <ul className='list-group'>
                            {productDetails.short_description?.split('||').map((paragraph, index) => (
                                <li key={index}>{paragraph}</li>
                            ))}
                                <li>{productDetails.origin}</li>
                        </ul>
                        <div className='d-flex align-items-center justify-content-between mt-3'>
                            <div className='d-flex'>
                                <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>-</button>
                                <input style={{ border: "1px solid #ddd", width: '40px', height: '38px' }} type='number' min='1' value='1' />
                                <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>+</button>
                            </div>
                            <button style={{ backgroundColor: '#d26e4b', color: '#fff', width: '200px', height: '40px', border: 'none' }}>THÊM VÀO GIỎ HÀNG</button>
                        </div>
                    </div>
                    <div className='col-md-2'></div>
                </div>
                <div className={`buy-box d-flex align-items-center justify-content-center  ${showBuyBox ? "show" : ""}`}>
                    <img style={{ width: '45px', height: '45px', marginLeft: '16px' }} src={productDetails.buyBoxImage} alt="Buy Box" />
                    <p style={{ width: '230px', fontSize: '14px', fontWeight: '600', marginBottom: '0' }}>{productDetails.buyBoxName}</p>
                    <p className='text-center ml-2 mb-0' style={{ color: '#000' }}>
                        <span style={{ textDecoration: 'line-through' }}>
                            <span>{productDetails.buyBoxOriginalPrice}</span>
                            <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                đ
                            </span>
                        </span>
                        <span style={{ marginLeft: '12px', fontWeight: '600' }}>
                            <span>{productDetails.buyBoxSalePrice}</span>
                            <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                đ
                            </span>
                        </span>
                    </p>
                    <div className='d-flex' style={{ marginLeft: '30px' }}></div>
                        <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>-</button>
                        <input style={{ border: "1px solid #ddd", width: '40px', height: '38px' }} type='number' min='1' value='1' />
                        <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>+</button>
                    </div>
                    <button style={{ backgroundColor: '#d26e4b', color: '#fff', width: '200px', height: '40px', border: 'none', marginLeft: '12px' }}>THÊM VÀO GIỎ HÀNG</button>
                </div>
                <div className='mt-5 ' style={{ borderTop: '1px solid #ddd' }}>
                    <p className='mt-2'>
                        <span
                            style={{ cursor: 'pointer' }}
                            className={` ${activeTab === "description" ? "den" : "xam"}`}
                            onClick={() => setActiveTab("description")}
                        >
                            MÔ TẢ
                        </span>
                        <span
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            className={` ${activeTab === "reviews" ? "den" : "xam"}`}
                            onClick={() => setActiveTab("reviews")}
                        >
                            ĐÁNH GIÁ(0)
                        </span>
                    </p>

                    <div className=''>
                        {activeTab === "description" ? (
                            <div>
                                <h4 className='mt-3'>{productDetails.descriptionTitle}</h4>
                                {productDetails.long_description}
                                <img style={{ width: '100%', height: '1050px' }} src={productDetails.descriptionImage} alt="Description" />
                            </div>
                        ) : (
                            <div>
                                <h5>Đánh giá</h5>
                                <p>Chưa có đánh giá nào.</p>
                            </div>
                        )}
                    </div>
            </div>
        </div>
    );
}

export default ProductDetails;
