import React from 'react'
import { Link } from 'react-router-dom'
import DashboardApi from '../../../Api/Product/DashboardApi';
import { toast } from 'react-toastify';

const ProductItem = ({ productId, productImg, productName, productPrice, productPriceSale, sale, quantity }) => {
    const handleAddToCart = async (e) => {
        e.preventDefault(); // Prevent Link navigation
        const cartKey = 'klairs_cart';
        let cart = { address_id: '', orders: [] };
        try {
            // Lấy số lượng còn lại mới nhất từ API
            const res = await DashboardApi.getDetailProduct(productId);
            const productQuantity = res.product.quantity ?? (res.product && res.product.quantity);
            if (!res.product || typeof productQuantity !== 'number') {
                toast.error('Không thể kiểm tra số lượng sản phẩm.');
                return;
            }
            const stored = localStorage.getItem(cartKey);
            if (stored) {
                cart = JSON.parse(stored);
            }
            const existing = cart.orders.find(item => item.product_id === productId);
            const cartQuantity = existing ? existing.quantity + 1 : 1;
            if (cartQuantity > productQuantity) {
                toast.error('Số lượng sản phẩm trong kho không đủ!');
                return;
            }
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.orders.push({
                    product_id: productId,
                    quantity: 1,
                    product_img: productImg,
                    product_name: productName,
                    product_price: productPrice,
                    product_price_sale: productPriceSale,
                    sale: sale,
                });
            }
            localStorage.setItem(cartKey, JSON.stringify(cart));
            // Dispatch a custom event to notify other components (like Header) to update immediately
            window.dispatchEvent(new Event('cart-updated'));
            toast.success('Đã thêm vào giỏ hàng!');
        } catch (error) {
            toast.error('Có lỗi khi thêm vào giỏ hàng!');
        }
    };

    return (
        <Link to={`/products/${productId}`} onClick={e => e.stopPropagation()}>
            <div className='product-item'>
                <img src={productImg} alt={productName}/>
                <p className='text-center mt-2 mb-0' style={{ fontSize: '16px', color: '#000' }}>{productName}</p>
                <p className='text-center mt-1 mb-0' style={{ color: '#000' }}>
                <span style={{ textDecoration: sale > 0 ? 'line-through' : 'none' }}>
                    <span>{productPrice}</span>
                    <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                        đ
                    </span>
                </span>
                    {sale > 0 && (
                    <span style={{ marginLeft: '12px', fontWeight: '600' }}>    
                        <span>{productPriceSale}</span>
                        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                            đ
                        </span>
                    </span>
                        
                    )}
                </p>
                <button disabled={quantity === 0} onClick={handleAddToCart}>THÊM VÀO GIỎ HÀNG</button>
                {
                    sale > 0 && (
                        <div className='sale'>-{sale}%</div>
                    )
                }
            </div>
        </Link>
    )
}

export default ProductItem