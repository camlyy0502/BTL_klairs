import React from 'react'
import { Link } from 'react-router-dom'

const ProductItem = ({ productImg, productName, productPrice, productPriceSale, sale }) => {
    return (
        <Link to='/ProductDetails'>
            <div className='product-item'>

                <img src={productImg} />
                <p className='text-center mt-2 mb-0' style={{ fontSize: '16px', color: '#000' }}>{productName}</p>
                <p className='text-center mt-1 mb-0' style={{ color: '#000' }}>
                    <span style={{ textDecoration: 'line-through' }}>
                        <span>{productPrice}</span>
                        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                            đ
                        </span>
                    </span>
                    <span style={{ marginLeft: '12px', fontWeight: '600' }}>    
                        <span>{productPriceSale}</span>
                        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                            đ
                        </span>
                    </span>
                </p>
                <button>THÊM VÀO GIỎ HÀNG</button>
                <div className='sale'>-{sale}%</div>
            </div>
        </Link>
    )
}

export default ProductItem