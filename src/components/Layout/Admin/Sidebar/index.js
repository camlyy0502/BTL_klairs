import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    useEffect(() => {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide) => {
            slide.addEventListener('click', () => {
                // Loại bỏ class active khỏi tất cả slide
                slides.forEach((s) => s.classList.remove('active'));
                // Thêm class active vào slide được chọn
                slide.classList.add('active');
            });
        });
    }, []);

    return (
        <div className="col-md-2 slider" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            <div className="pt-3">
                <img className='' style={{ width: 50, borderRadius: '50%', }} src='https://e7.pngegg.com/pngimages/754/474/png-clipart-computer-icons-system-administrator-avatar-computer-network-heroes-thumbnail.png' alt />
                <span style={{ fontSize: 16, marginLeft: 8, color: '#62677399' }}>Admin</span>
            </div>
            <h6 className="mt-4" style={{ color: '#62677399' }}>NAVIGATION</h6>
            <ul className='navigation m-0 p-0'>

                <li className='slide active' style={{ padding: '8px 20px' }}>
                    <Link to='/Admin'><i class="fas fa-home me-2"></i> Dashboard </Link>
                </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Account'> <i class="fas fa-user me-2"></i> Tài khoản</Link> </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Category'><i class="fas fa-user me-2"></i>Danh mục</Link> </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Chat'><i class="fas fa-user me-2"></i>Quản lý tin nhắn</Link> </li>


            </ul>
            <div>

            </div>
        </div>

    )
}

export default Sidebar