import React, { useEffect, useState, useCallback } from "react";
import ProductItem from "./ProductItem";
import DashboardApi from '../../../Api/Product/DashboardApi';
import { getFullImageUrl } from '../../../utils/imageUrl';
import { useLocation } from 'react-router-dom';


function Product() {
    const location = useLocation();
    const [price, setPrice] = useState(500000); // Giá mặc định
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [total, setTotal] = useState();
    const [limit, setLimit] = useState(9);
    const [allProducts, setAllProducts] = useState([]);
    const [allProductsRaw, setAllProductsRaw] = useState([]); // Danh sách sản phẩm gốc (theo category/search, chưa filter giá)
    const [sortOption, setSortOption] = useState('default');
    const [searchText, setSearchText] = useState('');
    const [isFiltered, setIsFiltered] = useState(false);
    const [minPrice, setMinPrice] = useState(100000);
    const [maxPrice, setMaxPrice] = useState(5000000);

    // Lấy category id từ query param
    function getCategoryIdFromQuery() {
        const params = new URLSearchParams(location.search);
        return params.get('category');
    }

    const fetchProducts = useCallback(async (page) => {
        try {
            const categoryId = getCategoryIdFromQuery();
            let res;
            if (categoryId) {
                res = await DashboardApi.getLimitProduct(limit, page, categoryId);
            } else {
                res = await DashboardApi.getLimitProduct(limit, page);
            }
            setProducts(res.data);
            setTotalPages(res.pages);
            setTotal(res.total);
            setLimit(9);
        } catch (error) {
            console.error(error);
        }
    }, [limit, location.search]);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, fetchProducts]);

    // Khi vừa vào trang, setFilteredProducts = products (không filter theo price)
    useEffect(() => {
        setFilteredProducts(products);
        // Đặt giá trị slider về maxPrice khi vừa vào trang hoặc khi products thay đổi
        if (products.length > 0) {
            const prices = products.map(p => Number(p.price));
            const max = Math.max(...prices);
            setPrice(max);
        }
    }, [products]);

    // Khi có thao tác lọc/sắp xếp thì lấy toàn bộ sản phẩm, filter/sort client-side
    const handleFilterOrSort = async (newPrice, newSort, newSearch) => {
        try {
            let res;
            const categoryId = getCategoryIdFromQuery();
            if (categoryId) {
                res = await DashboardApi.getProductsByCategory(categoryId);
            } else {
                res = await DashboardApi.getAllProduct();
            }
            let data = res.data || res;
            // Lọc theo search
            if (newSearch) {
                data = data.filter(p => p.name.toLowerCase().includes(newSearch.toLowerCase()));
            }
            // Sắp xếp
            if (newSort === 'asc') {
                data = data.sort((a, b) => a.price - b.price);
            } else if (newSort === 'desc') {
                data = data.sort((a, b) => b.price - a.price);
            }
            setAllProductsRaw(data); // Lưu lại danh sách gốc (theo category/search, chưa filter giá)
            // Lọc theo giá
            let filtered = data;
            if (typeof newPrice !== 'undefined') {
                filtered = data.filter(p => Number(p.price) <= Number(newPrice));
            }
            setAllProducts(filtered);
            setIsFiltered(true);
            setCurrentPage(1);
            setTotal(filtered.length);
            setTotalPages(Math.ceil(filtered.length / limit));
            setFilteredProducts(filtered.slice(0, limit));
        } catch (error) {
            console.error(error);
        }
    };

    // Xử lý khi thay đổi giá
    const handlePriceChange = (e) => {
        const value = e.target.value;
        setPrice(value);
        handleFilterOrSort(value, sortOption, searchText);
    };

    // Xử lý khi thay đổi sắp xếp
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOption(value);
        handleFilterOrSort(price, value, searchText);
    };

    // Xử lý khi search
    const handleSearch = () => {
        handleFilterOrSort(price, sortOption, searchText);
    };

    // Xử lý phân trang khi đã filter
    useEffect(() => {
        if (isFiltered) {
            setFilteredProducts(allProducts.slice((currentPage - 1) * limit, currentPage * limit));
        }
    }, [currentPage, allProducts, isFiltered, limit]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // const navigate = useNavigate();

    // Cập nhật min/max price động dựa trên danh sách sản phẩm GỐC (allProductsRaw)
    useEffect(() => {
        let list = isFiltered ? allProductsRaw : products;
        if (list.length > 0) {
            const prices = list.map(p => Number(p.price));
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setMinPrice(min);
            setMaxPrice(max);
            setPrice(prevPrice => {
                if (prevPrice < min) return min;
                if (prevPrice > max) return max;
                return prevPrice;
            });
        } else {
            setMinPrice(0);
            setMaxPrice(0);
            setPrice(0);
        }
    }, [allProductsRaw, products, isFiltered]);

    // Khi searchText thay đổi, tự động filter lại và cập nhật min/max price
    useEffect(() => {
        if (searchText !== '') {
            handleFilterOrSort(price, sortOption, searchText);
        }
    }, [searchText, handleFilterOrSort, price, sortOption]);

    return (
        <div className='container-fluid p-0 mb-5 product'>
            <div className='product-banner p-0'>
            </div>
            <div className='container mt-4'>
                <div className='custom-container'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <div>
                            <p className="m-0" style={{ fontSize: '18px' }}>
                                <span style={{ color: '#666666B3' }}>TRANG CHỦ /</span>
                                <span style={{ fontWeight: '600', marginLeft: '8px' }}>CỬA HÀNG</span>
                            </p>
                        </div>
                        <div className='d-flex align-items-center justify-content-center'>
                            <p className='m-0 me-4'>Hiển thị {currentPage !== 1 ? (limit*(currentPage-1)+1) : 1}-{limit*currentPage < total ? limit*currentPage : total} của {total} kết quả</p>
                            <select onChange={handleSortChange} value={sortOption}>
                                <option value="default">Thứ tự mặc định</option>
                                <option value="popularity">Thứ tự theo mức độ phổ biến</option>
                                <option value="rating">Thứ tự theo điểm đánh giá</option>
                                <option value="newest">Mới nhất</option>
                                <option value="asc">Theo thứ tự giá : Thấp đến cao</option>
                                <option value="desc">Theo thứ tự giá : Cao đến thấp</option>
                            </select>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-3'>
                            <div className='product-search d-flex align-items-center'>
                                <input type='text' placeholder='Tìm kiếm...' value={searchText} onChange={e => setSearchText(e.target.value)} />
                                <button onClick={handleSearch}><i className="fas fa-search text-white"></i></button>
                            </div>
                            <h5 className="mt-4">Lọc theo giá</h5>
                            <input
                                type="range"
                                className="form-range"
                                min={minPrice}
                                max={maxPrice}
                                step="1000"
                                value={price}
                                defaultValue={maxPrice}
                                onChange={handlePriceChange}
                            />
                            <div className="d-flex align-items-center justify-content-between">
                                {/* <button style={{ background: '#666', borderRadius: '99px', width: '55px', height: '30px', border: 'none ', color: '#fff' }}>Lọc</button> */}
                                <p className="m-0">Giá: <strong>
                                    <span>0</span>
                                    <span style={{ textDecoration: 'underline', fontSize: '12px', marginLeft: '2px' }}>đ</span>
                                    <span style={{ margin: '0 8px', fontWeight: 400 }}>-</span>
                                    <span>{price.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}</span>
                                    <span style={{ textDecoration: 'underline', fontSize: '12px', marginLeft: '2px' }}>đ</span>
                                </strong></p>
                            </div>
                        </div>
                        <div className='col-md-9'>
                            <div className="row">
                                {
                                    filteredProducts.map((product, index) => (
                                        <div
                                            className="col-md-4 product-container"
                                            key={index}
                                        >
                                            <ProductItem
                                                productId={product.id}
                                                productImg={product.url}
                                                productPrice={product.price}
                                                productName={product.name}
                                                productPriceSale={product.price_sale}
                                                sale={product.sale}
                                                quantity={product.quantity}
                                            ></ProductItem>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="mt-3 d-flex align-items-center justify-content-center">
                                {currentPage > 1 && (
                                    <div
                                        style={{ background: '#fff', color: '#000' }}
                                        className="page"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                    </div>
                                )}
                                {[...Array(totalPages)].map((_, index) => (
                                    <div
                                        key={index}
                                        style={{ background: currentPage === index + 1 ? '#000' : '#fff', color: currentPage === index + 1 ? '#fff' : '#000' }}
                                        className="page"
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                                {currentPage < totalPages && (
                                    <div
                                        style={{ background: '#fff', color: '#000' }}
                                        className="page"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        <i className="fas fa-arrow-right"></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product