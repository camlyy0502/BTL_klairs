import React from 'react'
import ProductItem from '../Product/ProductItem'
import { useEffect, useState } from 'react';
import DashboardApi from '../../../Api/Product/DashboardApi';

function Home() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchAllProduct = async () => {
            try {
              const res = await DashboardApi.getAllProduct();
              setProducts(res);
            } catch (error) {
              throw error;
            }
          };
          fetchAllProduct();
    }, []);
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
                            <span>Là nhãn hàng chăm sóc da nhạy cảm hàng đầu với hàng nghìn khách hàng tại hơn 50 quốc gia đã và đang tin tưởng sử dụng</span>
                        </p>
                        
                        <h5 className='text-center mt-5' style={{ fontSize: '32px' }}>BỘ SẢN PHẨM DEAR KLAIRS</h5>
                        <div className='mt-4 row '>
                            {
                                products.map((product, index) => (
                                        <div key={index} className='col-md-3 product-container'>
                                        <ProductItem
                                            productImg={product.url}
                                            productPrice={product.price}
                                            productName={product.name}
                                            productPriceSale="500000"
                                            sale="20"
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

// import React from 'react'
// import ProductItem from '../Product/ProductItem'

// function Home() {
//     return (
//         <div className="container">
//             <div className="custom-container">
//                 <div id="carouselExample" className="carousel slide banner" data-bs-ride="carousel">
//                     <div className="carousel-inner">
//                         <div className="carousel-item">
//                             <img src="https://klairsvietnam.vn/wp-content/uploads/2020/07/banner-klairs.jpg" className="d-block w-100" alt="Hình 3" />
//                         </div>
//                         <div className="carousel-item active">
//                             <img src="https://klairsvietnam.vn/wp-content/uploads/2020/07/banner-klair.jpg" className="d-block w-100" alt="Hình 1" />
//                         </div>
//                         <div className="carousel-item">
//                             <img src="https://klairsvietnam.vn/wp-content/uploads/2020/07/banner-klairs.jpg" className="d-block w-100 " alt="Hình 2" />
//                         </div>

//                     </div>
//                     {/* Nút điều hướng */}
//                     <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
//                         <span className="carousel-control-prev-icon" aria-hidden="true" />
//                     </button>
//                     <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
//                         <span className="carousel-control-next-icon" aria-hidden="true" />
//                     </button>
//                 </div>
//                 <div className='container mt-5 mb-5'>
//                     <div className='custom-container'>
//                         <h5 className='text-center' style={{ fontSize: '32px' }}>DEAR KLAIRS</h5>
//                         <p className='text-center mt-4' style={{ fontSize: '16px' }}>
//                             <span style={{ fontWeight: '600' }}>Dear Klairs</span>
//                             <span> Thương hiệu mỹ phẩm Hàn Quốc với các dòng sản phẩm hoàn toàn từ thiên nhiên,</span>
//                             <span style={{ fontWeight: '600' }}> Klairs</span>
//                             <span>Là nhãn hàng chăm sóc da nhạy cảm hàng đầu với hàng nghìn khách hàng tại hơn 50 quốc gia đã và đang tin tưởng sử dụng</span>
//                         </p>
                        
//                         <h5 className='text-center mt-5' style={{ fontSize: '32px' }}>BỘ SẢN PHẨM DEAR KLAIRS</h5>
//                         <div className='mt-4 row '>
//                             <div className='col-md-3 product-container'>
//                                 <ProductItem
//                                     productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/serum-duong-trang-da-klairs-600x600.jpg'
//                                     productPrice='400.000'
//                                     productName='Serum Vitamin C dưỡng trắng da Klairs Freshly Jucied Vitamin Drop Serum'
//                                     productPriceSale='300.000'
//                                     sale='25'
//                                 ></ProductItem>
//                             </div>
//                             <div className='col-md-3 product-container'>
//                                 <ProductItem
//                                     productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/kem-chong-nang-klairs-1.jpg'
//                                     productPrice='400.000'
//                                     productName='Kem chống nắng bảo vệ da Klairs Soft Airi UV Essence Spf 50 PA++'
//                                     productPriceSale='300.000'
//                                     sale='25'
//                                 ></ProductItem>
//                             </div>
//                             <div className='col-md-3 product-container'>
//                                 <ProductItem
//                                     productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/Klairs-Rich-Moist-Soothing-Cream-600x600.jpg'
//                                     productPrice='400.000'
//                                     productName='Kem dưỡng ẩm Klairs Rich Moist Soothing Cream'
//                                     productPriceSale='300.000'
//                                     sale='25'
//                                 ></ProductItem>
//                             </div>
//                             <div className='col-md-3 product-container'>
//                                 <ProductItem
//                                     productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/Klairs-Rich-Moist-Soothing-Serum-600x600.jpg'
//                                     productPrice='400.000'
//                                     productName='Serum dưỡng ẩm Klairs Rich Moist Soothing Serum'
//                                     productPriceSale='300.000'
//                                     sale='25'
//                                 ></ProductItem>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>

//     )
// }

// export default Home