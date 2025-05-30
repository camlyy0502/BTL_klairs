import React from 'react';
import ProductItem from '../Product/ProductItem';
import { useEffect, useState } from 'react';
import DashboardApi from '../../../Api/Product/DashboardApi';
import { getFullImageUrl } from '../../../utils/imageUrl';

function Home() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchAllProduct = async () => {
            try {
              const res = await DashboardApi.getAllProduct();
              setProducts(res.data);
            } catch (error) {
              throw error;
            }
          };
          fetchAllProduct();
    }, []);
    // const navigate = useNavigate();

    return (
        <div className="container">
            <div className="custom-container">
                <div id="carouselExample" className="carousel slide banner" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item">
                            <img src="https://klairsvietnam.vn/wp-content/uploads/2020/07/banner-klairs.jpg" className="d-block w-100" alt="Hình 3" />
                        </div>
                        <div className="carousel-item active">
                            <img src="https://klairsvietnam.vn/wp-content/uploads/2020/07/banner-klair.jpg" className="d-block w-100" alt="Hình 1" />
                        </div>
                        <div className="carousel-item">
                            <img src="https://klairsvietnam.vn/wp-content/uploads/2020/07/banner-klairs.jpg" className="d-block w-100 " alt="Hình 2" />
                        </div>
                    </div>
                    {/* Nút điều hướng */}
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                    </button>
                </div>
                <div className='container mt-5 mb-5'>
                    <div className='custom-container'>
                        <h5 className='text-center' style={{ fontSize: '32px' }}>DEAR KLAIRS</h5>
                        <p className='text-center mt-4' style={{ fontSize: '16px' }}>
                            <span style={{ fontWeight: '600' }}>Dear Klairs</span>
                            <span> Thương hiệu mỹ phẩm Hàn Quốc với các dòng sản phẩm hoàn toàn từ thiên nhiên,</span>
                            <span style={{ fontWeight: '600' }}> Klairs</span>
                            <span> Là nhãn hàng chăm sóc da nhạy cảm hàng đầu với hàng nghìn khách hàng tại hơn 50 quốc gia đã và đang tin tưởng sử dụng</span>
                        </p>
                        
                        <h5 className='text-center mt-5' style={{ fontSize: '32px' }}>BỘ SẢN PHẨM DEAR KLAIRS</h5>
                        <div className='mt-4 row'>
                            {
                                products.map((product, index) => (
                                    <div 
                                        key={index} 
                                        className='col-md-3 product-container'
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <ProductItem
                                            productId={product.id}
                                            productImg={product.url}
                                            productPrice={product.price}
                                            productName={product.name}
                                            productPriceSale="500000"
                                            sale={product.sale}
                                            quantity={product.quantity}
                                        ></ProductItem>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home