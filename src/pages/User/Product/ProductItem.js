import React from 'react'
import { Link } from 'react-router-dom'
import DashboardApi from '../../../Api/Product/DashboardApi';
import { toast } from 'react-toastify';
import { useCart } from '../../../contexts/CartContext';
import { getFullImageUrl } from '../../../utils/imageUrl';

const ProductItem = ({ productId, productImg, productName, productPrice, productPriceSale, sale, quantity }) => {
    const { cart, updateCart } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault(); // Prevent Link navigation
        try {
            // Lấy số lượng còn lại mới nhất từ API
            const res = await DashboardApi.getDetailProduct(productId);
            const productQuantity = res.product.quantity ?? (res.product && res.product.quantity);
            if (!res.product || typeof productQuantity !== 'number') {
                toast.error('Không thể kiểm tra số lượng sản phẩm.');
                return;
            }
            let newCart = { ...cart };
            const existing = newCart.orders.find(item => item.product_id === productId);
            const cartQuantity = existing ? existing.quantity + 1 : 1;
            if (cartQuantity > productQuantity) {
                toast.error('Số lượng sản phẩm trong kho không đủ!');
                return;
            }
            if (existing) {
                existing.quantity += 1;
            } else {
                newCart.orders.push({
                    product_id: productId,
                    quantity: 1,
                    product_img: productImg,
                    product_name: productName,
                    product_price: productPrice,
                    product_price_sale: productPriceSale,
                    sale: sale,
                });
            }
            updateCart(newCart); // realtime update
            toast.success('Đã thêm vào giỏ hàng!');
        } catch (error) {
            toast.error('Có lỗi khi thêm vào giỏ hàng!');
        }
    };

    return (
        <Link to={`/products/${productId}`} onClick={e => e.stopPropagation()}>
            <div className='product-item'>
                <img src={getFullImageUrl(productImg)} alt={productName}/>
                <p className='text-center mt-2 mb-0' style={{ fontSize: '16px', color: '#000', height: "60px" }}>{productName}</p>
                <p className='text-center mt-1 mb-0' style={{ color: '#000' }}>
    <span style={{ textDecoration: sale > 0 ? 'line-through' : 'none' }}>
        <span>{Number(productPrice).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
            đ
        </span>
    </span>
    {sale > 0 && (
        <span style={{ marginLeft: '12px', fontWeight: '600' }}>
            <span>{Number(productPriceSale).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
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