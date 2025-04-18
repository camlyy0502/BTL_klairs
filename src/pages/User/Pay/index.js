import React from 'react'
import { useNavigate } from 'react-router-dom';

function Pay() {
    const navigate = useNavigate();

    const handleToPayDetails = () => {
        navigate('/PayDetails'); // Chuyển đến trang Pay
    };

    return (
        <div className='container cart mb-5 ' style={{ minHeight: '300px' }}>
            <div className='custom-container' style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <div className='row'>
                    <div className='col-md-7' style={{ borderTop: '2px solid #ddd', paddingTop: '20px' }}>
                        <h5>THÔNG TIN THANH TOÁN</h5>
                        <p style={{ fontWeight: '500', marginTop: '16px' }}>Họ và tên *</p>
                        <input style={{ width: '100%', height: '40px', outline: "none", border: '1px solid #ddd' }} />
                        <p style={{ fontWeight: '500', marginTop: '16px' }}>Số điện thoại *</p>
                        <input style={{ width: '100%', height: '40px', outline: "none", border: '1px solid #ddd' }} />
                        <p style={{ fontWeight: '500', marginTop: '16px' }}>Địa chỉ nhận hàng *</p>
                        <input style={{ width: '100%', height: '40px', outline: "none", border: '1px solid #ddd' }} />
                    </div>
                    <div className='col-md-5' style={{ paddingLeft: '20px' }}>
                        <div style={{ border: '2px solid #000', padding: '20px' }}>
                            <h5>ĐƠN HÀNG CỦA BẠN</h5>
                            <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd' }}>
                                <h6>SẢN PHẨM</h6>
                                <h6>TẠM TÍNH</h6>
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
                                <p style={{ fontWeight: '500' }}>Tạm tính</p>
                                <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                    <span>360.000</span>
                                    <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                        đ
                                    </span>
                                </span>
                            </div>
                            <div className='d-flex align-items-center justify-content-between mt-3' style={{ borderBottom: '1px solid #ddd', color: '#ddd' }}>
                                <p >Giao hàng</p>
                                <p>Miễn phí giao hàng</p>
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
                            <h6 className='mt-3'>Trả tiền mặt khi nhận hàng</h6>
                            <button onClick={handleToPayDetails} style={{ backgroundColor: '#d26e4b', color: '#fff', width: '150px', height: '40px', border: 'none', marginTop: '16px' }}>ĐẶT HÀNG</button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pay