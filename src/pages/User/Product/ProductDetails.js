import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";

function ProductDetails() {
    const [showBuyBox, setShowBuyBox] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBuyBox(true);
            } else {
                setShowBuyBox(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div className='container product_details mb-5 '>
            <div className='custom-container' style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <div className='row'>
                    <div className='col-md-6 product_details-img'>
                        <img src='https://klairsvietnam.vn/wp-content/uploads/2020/07/nuoc-hoa-hong-khong-mui-klairs-768x768.jpg' />
                        <div className='sale'>-25%</div>

                    </div>
                    <div className='col-md-4'>
                        <p style={{ color: '#666666B3' }}>
                            <span style={{ fontWeight: '600' }}>TRANG CHỦ /</span>
                            <span style={{ fontWeight: '600', marginLeft: '8px' }}>CỬA HÀNG /</span>
                            <span style={{ fontWeight: '600', marginLeft: '8px' }}>SẢN PHẨM</span>
                        </p>
                        <p style={{ fontSize: '1.7em', fontWeight: '700' }}>Dầu tẩy trang Klairs Gentle Black Deep Cleansing Oil</p>
                        <p className='mt-1' style={{ fontSize: '24px' }}>
                            <span style={{ textDecoration: 'line-through', color: '#777', fontWeight: '400' }}>
                                <span>425.000</span>
                                <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                    đ
                                </span>
                            </span>
                            <span style={{ marginLeft: '12px', fontWeight: '600' }}>
                                <span>310.000</span>
                                <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                    đ
                                </span>
                            </span>
                        </p>
                        <ul className='list-group'>
                            <li>Nhẹ nhàng làm sạch các lớp makeup hay kem chống nắng sâu dưới da trả lại làn da sạch, mịn màng</li>
                            <li>Giữ được độ ẩm cần thiết cho da mặt sau khi làm sạch</li>
                            <li>Thành phần chứa các loại dầu thực vật tự nhiên nên làn da nhạy cảm nhất cũng có thể sử dụng</li>
                            <li>Dung tích : 150ml</li>
                            <li>Xuất xứ : Hàn Quốc</li>
                        </ul>
                        <div className='d-flex align-items-center justify-content-between mt-3'>
                            <div className='d-flex'>
                                <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>-</button>
                                <input style={{ border: "1px solid #ddd", width: '40px', height: '38px' }} type='number' min='1' value='1' />
                                <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>+</button>

                            </div>
                            <button style={{ backgroundColor: '#d26e4b', color: '#fff', width: '200px', height: '40px', border: 'none' }}>THÊM VÀO GIỎ HÀNG</button>
                        </div>
                    </div>
                    <div className='col-md-2'></div>
                </div>
                <div className={`buy-box d-flex align-items-center justify-content-center  ${showBuyBox ? "show" : ""}`}>
                    <img style={{ width: '45px', height: '45px', marginLeft: '16px' }} src='https://klairsvietnam.vn/wp-content/uploads/2020/07/kem-chong-nang-klairs-1-100x100.jpg' />
                    <p style={{ width: '230px', fontSize: '14px', fontWeight: '600', marginBottom: '0' }}>Kem chống nắng, bảo vệ da Klairs Soft Airy UV Essence Spf 50 PA++++</p>
                    <p className='text-center ml-2 mb-0' style={{ color: '#000' }}>
                        <span style={{ textDecoration: 'line-through' }}>
                            <span>480.000</span>
                            <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                đ
                            </span>
                        </span>
                        <span style={{ marginLeft: '12px', fontWeight: '600' }}>
                            <span>360.000</span>
                            <span style={{ textDecoration: 'underline', fontSize: '12px', position: 'absolute' }}>
                                đ
                            </span>
                        </span>
                    </p>
                    <div className='d-flex' style={{ marginLeft: '30px' }}>
                        <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>-</button>
                        <input style={{ border: "1px solid #ddd", width: '40px', height: '38px' }} type='number' min='1' value='1' />
                        <button style={{ border: "1px solid #ddd", width: '20px', height: '38px' }}>+</button>
                    </div>
                    <button style={{ backgroundColor: '#d26e4b', color: '#fff', width: '200px', height: '40px', border: 'none', marginLeft: '12px' }}>THÊM VÀO GIỎ HÀNG</button>

                </div>
                <div className='mt-5 ' style={{ borderTop: '1px solid #ddd' }}>
                    <p className='mt-2'>
                        <span
                            style={{ cursor: 'pointer' }}
                            className={` ${activeTab === "description" ? "den" : "xam"}`}
                            onClick={() => setActiveTab("description")}
                        >
                            MÔ TẢ
                        </span>
                        <span
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            className={` ${activeTab === "reviews" ? "den" : "xam"}`}
                            onClick={() => setActiveTab("reviews")}
                        >
                            ĐÁNH GIÁ(0)
                        </span>
                    </p>

                    <div className=''>
                        {activeTab === "description" ? (
                            <div>
                                <h4 className='mt-3'>Kem chống nắng Klairs Soft Airy UV Essence Spf 50 PA+++++</h4>
                                <p>
                                    <span style={{ fontWeight: '600' }}>Kem chống nắng, bảo vệ da Klairs</span>
                                    <span>Soft Airy UV Essence Spf 50 PA++++ là sản phẩm chống nắng dành cho da nhạy cảm làm sáng da hiệu quả,
                                        mang đến làn da tươi tắn, khỏe khoắn. Kem có khả năng kiềm dầu và nhờn trên da, ngăn chặn quá trình lão hóa cho da,
                                        cung cấp độ ẩm, làm dịu da khỏi các tác hại từ môi trường. SPF 50+ sẽ giúp chống lại các tia UVA UVB gây hại cho da,
                                        bảo vệ da khỏi ánh nắng an toàn, mà không hề bị bóng dầu trên da, cảm giác khó chịu trên mặt.</span>
                                </p>
                                <img style={{ width: '100%', height: '1050px' }} src='https://klairsvietnam.vn/wp-content/uploads/2023/03/kem-chong-nang-klairs.jpg' />

                                <h4 className='mt-3'>Thành phần và công dụng kem chống nắng Klairs</h4>
                                <ul className='list-group'>
                                    <li>Kem Chống Nắng Dear Klairs dưỡng và làm mềm da Soft Airy UV Essence SPF50+ 80ml</li>
                                    <li>SPF 50+ sẽ giúp chống lại các tia UVA UVB gây hại cho da, bảo vệ da khỏi ánh nắng an toàn, mà không hề bị bóng dầu trên da, cảm giác khó chịu trên mặt.</li>
                                    <li>Niacinamide: Thúc đẩy sản xuất lipid sẽ tăng cường hàng rào bảo vệ tự nhiên của da, làm sáng và đều màu da.</li>
                                    <li>Centella asiatica (chiết xuất rau má): Kích thích quá trình làm lành vùng da bị tổn thương, tránh tình trạng để lại sẹo sau khi bị tổn thương.</li>
                                    <li>Guaiazulene (chiết xuất từ hoa cúc La Mã), làm dịu và mát da có tác dụng giúp hồi phục đến 89.7% vết thương do cháy nắng, 60.6% da kích ứng và 86.5% vết thương hở.</li>
                                    <li>Các thành phần dưỡng ẩm đáng tin cậy như Sodium Hyaluronate, glycerin, caprylic / capric triglyceride, cho làn da mềm mại, mịn màng.</li>
                                    <li>Peptide – một loại protein sử dụng công nghệ tế bào gốc, tác động vào sâu tế bào da, giúp kích thích tái tạo và phục hồi da nhanh hơn cũng như chống lại dấu hiệu lão hóa.</li>
                                    <li>Kết cấu dạng kem mỏng nhẹ, màu trắng khi bôi lên da thẩm thấu nhanh mà không bị bóng nhờn.</li>
                                </ul>
                                <img style={{ width: '100%', height: '1050px', marginTop: '20px' }} src='https://klairsvietnam.vn/wp-content/uploads/2023/03/kem-chong-nang-dear-klairs.jpg' />

                            </div>
                        ) : (
                            <div>
                                <h5>Đánh giá</h5>
                                <p>Chưa có đánh giá nào.</p>
                                <div className='reviews'>
                                    <h5>Hãy là người đầu tiên nhận xét “Dầu tẩy trang Klairs Gentle Black Deep Cleansing Oil” </h5>
                                    <h6 className='mt-2'>Đánh giá của bạn *</h6>
                                    <div className='d-flex'>
                                        <div className='star' style={{ borderRight: '1px solid #ddd', padding: '4px', display: 'inline-block' }} >
                                            <i className="fas fa-star "></i>
                                        </div>
                                        <div className='star' style={{ borderRight: '1px solid #ddd', padding: '4px', display: 'inline-block' }} >
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                        </div>
                                        <div className='star' style={{ borderRight: '1px solid #ddd', padding: '4px', display: 'inline-block' }} >
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                        </div>
                                        <div className='star' style={{ borderRight: '1px solid #ddd', padding: '4px', display: 'inline-block' }} >
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                        </div>
                                        <div className='star' style={{ padding: '4px', display: 'inline-block' }} >
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                            <i className="fas fa-star "></i>
                                        </div>
                                    </div>
                                    <h6 className='mt-3'>Nhận xét của bạn *</h6>
                                    <textarea style={{ width: '100%', height: '120px', border: '1px solid #ddd' }}></textarea>
                                    <div className='row mt-2'>
                                        <div className='col-md-6'>
                                            <h6 className='mt-2'>Tên *</h6>
                                            <input style={{ height: '40px', border: '1px solid #ddd', outline: 'none', width: '100%' }} type='text' />
                                        </div>
                                        <div className='col-md-6'>
                                            <h6 className='mt-2'>Email *</h6>
                                            <input style={{ height: '40px', border: '1px solid #ddd', outline: 'none', width: '100%' }} type='text' />
                                        </div>
                                        <div className='d-flex align-items-center mt-3'>
                                            <input type='checkbox' />
                                            <h6 style={{ margin: '0 0 0 8px' }}>Lưu tên của tôi, email, và trang web trong trình duyệt này cho lần bình luận kế tiếp của tôi.</h6>
                                        </div>
                                        <button style={{ width: '100px', height: '40px', background: '#000', color: '#fff', marginTop: '12px' }}>GỬI ĐI</button>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
                <div className="mt-5">
                    <h4>SẢN PHẨM TƯƠNG TỰ</h4>
                    <div className='mt-4 row '>
                        <div className='col-md-3 product-container'>
                            <ProductItem
                                productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/serum-duong-trang-da-klairs-600x600.jpg'
                                productPrice='400.000'
                                productName='Serum Vitamin C dưỡng trắng da Klairs Freshly Jucied Vitamin Drop Serum'
                                productPriceSale='300.000'
                                sale='25'
                            ></ProductItem>
                        </div>
                        <div className='col-md-3 product-container'>
                            <ProductItem
                                productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/kem-chong-nang-klairs-1.jpg'
                                productPrice='400.000'
                                productName='Kem chống nắng bảo vệ da Klairs Soft Airi UV Essence Spf 50 PA++'
                                productPriceSale='300.000'
                                sale='25'
                            ></ProductItem>
                        </div>
                        <div className='col-md-3 product-container'>
                            <ProductItem
                                productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/Klairs-Rich-Moist-Soothing-Cream-600x600.jpg'
                                productPrice='400.000'
                                productName='Kem dưỡng ẩm Klairs Rich Moist Soothing Cream'
                                productPriceSale='300.000'
                                sale='25'
                            ></ProductItem>
                        </div>
                        <div className='col-md-3 product-container'>
                            <ProductItem
                                productImg='https://klairsvietnam.vn/wp-content/uploads/2020/07/Klairs-Rich-Moist-Soothing-Serum-600x600.jpg'
                                productPrice='400.000'
                                productName='Serum dưỡng ẩm Klairs Rich Moist Soothing Serum'
                                productPriceSale='300.000'
                                sale='25'
                            ></ProductItem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails