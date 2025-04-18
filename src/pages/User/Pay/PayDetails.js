import React from 'react'

function PayDetails() {
    return (
        <div className='container cart mb-5 ' style={{ minHeight: '300px' }}>
            <div className='custom-container' style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <div className='row'>
                    <div className='col-md-7'>
                        <h5>Chi tiết đơn hàng</h5>
                        <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }}>
                            <h6>SẢN PHẨM</h6>
                            <h6>TỔNG</h6>
                        </div>
                        <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }}>
                            <p style={{ fontSize: '14px', width: '250px' }}>Kem nền trang điểm Klairs Illuminating Supple Blemish Cream  × 1</p>
                            <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                <span>360.000</span>
                                <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                    đ
                                </span>
                            </span>
                        </div>
                        <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }}>
                            <p style={{ fontWeight: '500' }}>Giao hàng</p>
                            <p>Miễn phí giao hàng</p>
                        </div>
                        <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }}>
                            <p style={{ fontWeight: '500' }}>Thanh toán</p>
                            <p>Thanh toán khi nhận hàng</p>
                        </div>
                        <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }}>
                            <p style={{ fontWeight: '500' }}>Tổng</p>
                            <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                <span>360.000</span>
                                <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                    đ
                                </span>
                            </span>
                        </div>

                    </div>
                    <div className='col-md-5' style={{ paddingLeft: '20px' }}>
                        <div style={{ border: '1px solid #ddd', padding: '20px' }}>
                            <p style={{ color: '#7a9c59' }}>Cảm ơn bạn. Đơn hàng của bạn đã được nhận.</p>
                            <ul className='list-group'>
                                <li>
                                    <span>Mã đơn hàng:</span>
                                    <span style={{ fontWeight: '500', marginLeft: '8px' }}>5626</span>
                                </li>
                                <li>
                                   
                                    <span>Ngày:</span>
                                    <span style={{ fontWeight: '500', marginLeft: '8px' }}>04/03/2025</span>
                                </li>
                                <li>
                                    <span>Tổng cộng:</span>
                                    <span style={{ fontWeight: '500', marginLeft: '8px' }}>
                                        <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                            <span>360.000</span>
                                            <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                                đ
                                            </span>
                                        </span>
                                    </span>
                                </li>
                                <li>
                                   
                                    <span>Phương thức thanh toán:</span>
                                    <span style={{ fontWeight: '500', marginLeft: '8px' }}>Trả tiền mặt khi nhận hàng</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PayDetails
