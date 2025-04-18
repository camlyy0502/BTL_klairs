import React from 'react'
import { useNavigate } from 'react-router-dom';

function Cart() {
    const navigate = useNavigate();

    const handleToPay = () => {
        navigate('/Pay'); // Chuyển đến trang Pay
    };
    const handleToProduct = () => {
        navigate('/Product'); // Chuyển đến trang Pay
    };
    return (
        <div className='container cart mb-5 ' style={{ minHeight: '300px' }}>
            <div className='custom-container' style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <div className='row mt-4'>
                    <div className='col-md-7'>
                        <div>
                            <div className='row' style={{ borderBottom: '2px solid #ddd', padding: '0 0 8px 0' }}>
                                <div className='col-md-2 p-0'>
                                    <h6 >SẢN PHẨM</h6>
                                </div>
                                <div className='col-md-4'>

                                </div>
                                <div className='col-md-2'>
                                    <h6>GIÁ</h6>
                                </div>
                                <div className='col-md-2'>
                                    <h6>SỐ LƯỢNG</h6>
                                </div>
                                <div className='col-md-2 p-0'>
                                    <h6 style={{ textAlign: 'right' }}>TẠM TÍNH</h6>
                                </div>
                            </div>
                            <div className='row mt-3 align-items-center' style={{ borderBottom: '1px solid #ddd', padding: '0 0 8px 0' }}>
                                <div className='col-md-2 p-0 d-flex align-items-center'>
                                    <button style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</button>
                                    <img style={{ width: '75px', height: '75px' }} src='https://klairsvietnam.vn/wp-content/uploads/2020/07/kem-nen-trang-diem-klairs-600x600.jpg' />
                                </div>
                                <div className='col-md-4'>
                                    Kem nền trang điểm Klairs Illuminating Supple Blemish Cream
                                </div>
                                <div className='col-md-2'>
                                    <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                        <span>360.000</span>
                                        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                            đ
                                        </span>
                                    </span>
                                </div>
                                <div className='col-md-2'>
                                    <div className='d-flex align-items-center'>
                                        <button style={{ border: "1px solid #ddd", width: '20px', height: '33px' }}>-</button>
                                        <input style={{ border: "1px solid #ddd", width: '40px', height: '33px' }} type='number' min='1' value='1' />
                                        <button style={{ border: "1px solid #ddd", width: '20px', height: '33px' }}>+</button>

                                    </div>
                                </div>
                                <div className='col-md-2 p-0' style={{ textAlign: 'right' }}>
                                    <span className='cart-price' style={{ marginLeft: '4px', position: 'relative', color: '#000' }}>
                                        <span>360.000</span>
                                        <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute', top: '5%' }}>
                                            đ
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className='cart-bt_continue' onClick={handleToProduct}>  TIẾP TỤC XEM SẢN PHẨM</button>

                    </div>
                    <div className='col-md-5' style={{ paddingLeft: '30px' }}>
                        <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '20px', paddingBottom: '16px' }}>
                            <div className='' style={{ borderBottom: '2px solid #ddd', padding: '0 0 8px 0' }}>
                                <h6>CỘNG GIỎ HÀNG</h6>
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
                            <button onClick={handleToPay} style={{ backgroundColor: '#d26e4b', color: '#fff', width: '100%', height: '40px', border: 'none' }}>TIẾN HÀNH THANH TOÁN</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart