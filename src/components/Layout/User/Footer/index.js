import React from 'react'

function Footer() {
    return (
        <div className='container-fluid' style={{ background: '#38342B', height: '380px', color: '#fff' }}>
            <div className='container'>
                <div className='custom-container'>
                    <div className='row pt-4'>
                        <div className='col-md-4'>
                            <h6>LIÊN HỆ</h6>
                            <p className='mt-3'>Địa chỉ : 181, Cao Thắng, phường 12, quận 10, Hồ Chí Minh</p>
                            <p>Email : klairsvietnam@gmail.com</p>
                            <p>Hotline : 0931.666.489</p>
                            <p>Website : https://klairsvietnam.vn/</p>
                        </div>
                        <div className='col-md-4'>
                            <h6>SẢN PHẨM</h6>
                        </div>
                        <div className='col-md-4'>
                            <h6>HỖ TRỢ KHÁCH HÀNG</h6>
                            <p className='mt-3'>Giới thiệu</p>
                            <p >Hướng dẫn mua hàng</p>
                            <p >Chính sách đổi trả</p>
                            <p >Chính sách bảo mật</p>
                            <p >Điều khoản dịch vụ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer