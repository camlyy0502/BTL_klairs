import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import DashboardApi from "../../../Api/Product/DashboardApi";
import { toast } from 'react-toastify';
import { useCart } from '../../../contexts/CartContext';

function ProductDetails() {
    const { productId } = useParams();
    const { cart, updateCart } = useCart();
    const [productDetails, setProductDetails] = useState({});
    const [showBuyBox, setShowBuyBox] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const [quantity, setQuantity] = useState(1);

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

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setQuantity(1);
        } else if (value > productDetails.quantity) {
            setQuantity(productDetails.quantity);
            toast.warning(`Chỉ còn ${productDetails.quantity} sản phẩm trong kho`);
        } else {
            setQuantity(value);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (quantity < productDetails.quantity) {
            setQuantity(quantity + 1);
        } else {
            toast.warning(`Chỉ còn ${productDetails.quantity} sản phẩm trong kho`);
        }
    };

    const addToCart = () => {
        if (quantity > productDetails.quantity) {
            toast.error('Số lượng sản phẩm trong kho không đủ');
            return;
        }

        try {
            let newCart = { ...cart };
            const existing = newCart.orders.find(item => item.product_id === productDetails.product_id);
            
            if (existing) {
                const newQuantity = existing.quantity + quantity;
                if (newQuantity > productDetails.quantity) {
                    toast.error(`Tổng số lượng trong giỏ hàng không được vượt quá ${productDetails.quantity}`);
                    return;
                }
                existing.quantity = newQuantity;
            } else {
                newCart.orders.push({
                    product_id: productDetails.product_id,
                    quantity: quantity,
                    product_img: productDetails.thumb,
                    product_name: productDetails.name,
                    product_price: productDetails.price,
                    product_price_sale: productDetails.salePrice,
                    sale: productDetails.sale
                });
            }

            updateCart(newCart); // This will update both context and localStorage
            toast.success('Đã thêm vào giỏ hàng');
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error('Không thể thêm vào giỏ hàng');
        }
    };

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
                                <span>{Number(productDetails.price).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
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
                                {/* 
                                <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>-</button>
                                <input style={{ border: "1px solid #ddd", width: '40px', height: '38px' }} type='number' min='1' value='1' />
                                <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>+</button>
                                */}
                                <input type="button" value="-" class="minus button is-form" onClick={handleDecrease}/>
                                <input type="number" class="input-text qty text" step="1" min="1" max={productDetails.quantity} name="quantity" value={quantity} title="SL" size="4" placeholder="" inputmode="numeric" data-gtm-form-interact-field-id="0" onChange={handleQuantityChange}/>
                                <input type="button" value="+" class="plus button is-form" onClick={handleIncrease}/>
                            </div>
                            <button style={{ backgroundColor: '#d26e4b', color: '#fff', width: '200px', height: '40px', border: 'none' }} onClick={addToCart}>THÊM VÀO GIỎ HÀNG</button>
                        </div>
                    </div>
                    <div className='col-md-2'></div>
                </div>
                <div className={`buy-box d-flex align-items-center justify-content-center  ${showBuyBox ? "show" : ""}`}>
                    <img style={{ width: '45px', height: '45px', marginLeft: '16px' }} src={productDetails.thumb} alt="Buy Box" />
                    <p style={{ width: '230px', fontSize: '14px', fontWeight: '600', marginBottom: '0' }}>{productDetails.name}</p>
                    <p className='text-center ml-2 mb-0' style={{ color: '#000' }}>
                        <span style={{ textDecoration: productDetails.sale > 0 ? 'line-through' : 'none' }}>
                            <span>{productDetails.price}</span>
                            <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                đ
                            </span>
                        </span>
                        {productDetails.sale > 0 && (
                        <span style={{ marginLeft: '12px', fontWeight: '600' }}>
                            <span>{productDetails.buyBoxSalePrice}</span>
                            <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                đ
                            </span>
                        </span>
                        )}
                    </p>
                    <div className='d-flex' style={{ marginLeft: '30px' }}></div>
                        {/* <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>-</button> */}
                        {/* <input style={{ border: "1px solid #ddd", width: '40px', height: '38px' }} type="number" class="input-text qty text" step="1" min="1" max={productDetails.quantity} name="quantity" value="1" title="SL" size="4" placeholder="" inputmode="numeric" data-gtm-form-interact-field-id="0" /> */}
                        {/* <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>+</button> */}
                        <input type="button" value="-" class="minus button is-form" onClick={handleDecrease}/>
                        <input type="number" class="input-text qty text" step="1" min="1" max={productDetails.quantity} name="quantity" value={quantity} title="SL" size="4" placeholder="" inputmode="numeric" data-gtm-form-interact-field-id="0" onChange={handleQuantityChange}/>
                        <input type="button" value="+" class="plus button is-form" onClick={handleIncrease}/>
                        <button disabled={productDetails.quantity === 0} style={{ backgroundColor: '#d26e4b', color: '#fff', width: '200px', height: '40px', border: 'none', marginLeft: '12px' }} onClick={addToCart}>THÊM VÀO GIỎ HÀNG</button>
                    </div>
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
