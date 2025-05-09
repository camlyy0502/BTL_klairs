import React from 'react'
import { Link } from 'react-router-dom'

const ProductItem = ({ productId, productImg, productName, productPrice, productPriceSale, sale, quantity }) => {
    return (
        <Link to={`/products/${productId}`}>
            <div className='product-item'>
                <img src={productImg}/>
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
                <button disabled={quantity === 0}>THÊM VÀO GIỎ HÀNG</button>
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