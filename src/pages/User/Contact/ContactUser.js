import React from 'react'

function Contact() {
    return (
        <div className='container cart mb-5 ' style={{ minHeight: '300px' }}>
            <div className='custom-container' style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <img style={{ width: '100%' }} src='https://klairsvietnam.vn/wp-content/uploads/2020/07/banner-lien-he-klairs.jpg' />
                <div className='row mt-4'>
                    <div className='col-md-6 d-flex flex-column align-items-center justify-content-center'>
                        <img src='https://klairsvietnam.vn/wp-content/uploads/2020/07/logo-klairs.png' />
                        <p className='mt-4'>Địa chỉ : 181, Cao Thắng, phường 12, quận 10, Hồ Chí Minh</p>
                        <p>Email : klairsvietnam@gmaiil.com</p>
                        <p>Hotline : 0931.666.489</p>
                        <p>Website : https://klairsvietnam.vn</p>

                    </div>
                    <div className='col-md-6' style={{ paddingLeft: '20px' }}>
                        <div style={{ padding: '20px', border: ' 1px solid #ddd' }}>
                            <h5 style={{ textAlign: 'center' }}>TƯ VẤN DEAR KLAIRS</h5>
                            <p style={{ fontWeight: '500', marginTop: '16px' }}>Họ và tên </p>
                            <input style={{ width: '100%', height: '40px', outline: "none", border: '1px solid #ddd' }} />
                            <p style={{ fontWeight: '500', marginTop: '16px' }}>Số điện thoại </p>
                            <input style={{ width: '100%', height: '40px', outline: "none", border: '1px solid #ddd' }} />
                            <p style={{ fontWeight: '500', marginTop: '16px' }}>Email</p>
                            <input style={{ width: '100%', height: '40px', outline: "none", border: '1px solid #ddd' }} />
                            <p style={{ fontWeight: '500', marginTop: '16px' }}>Thông điệp</p>
                            <textarea style={{ width: '100%', height: '100px', outline: "none", border: '1px solid #ddd' }}></textarea>
                            <button style={{ backgroundColor: '#000', color: '#fff', width: '150px', height: '40px', border: 'none', marginTop: '16px' }}>GỬI ĐI</button>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Contact