import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import AdminApi from '../../Api/Admin/AdminApi';
import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import OrderAdminApi from "../../Api/Admin/OrderApi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

function Home() {
    const [stats, setStats] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
    const [toDate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [userMap, setUserMap] = useState({});


    const fetchStats = async (fromDate, toDate) => {
        AdminApi.reportStats(fromDate, toDate)
            .then(res => {
                setStats(res);
                setLoading(false);
            })
            .catch(() => setLoading(false));
        };

    useEffect(() => {
        fetchStats(fromDate, toDate);
    }, [fromDate, toDate]);

    // Fetch danh sách user và build userMap
    useEffect(() => {
        AdminApi.listAccount().then(users => {
            // users là mảng user, mỗi user có user_id, name, email, phone...
            const map = {};
            users.forEach(u => {
                map[u.id] = u; // hoặc map[u.user_id] = u; tùy theo API trả về
            });
            setUserMap(map);
        });
    }, []);

    const fetchOrders = async (fromDate, toDate) => {
        // Giả sử AdminApi.listOrders là API lấy danh sách đơn hàng theo ngày
        const res = await OrderAdminApi.getAllOrder();
        setOrders(res);
    };

    useEffect(() => {
        fetchOrders(fromDate, toDate);
    }, [fromDate, toDate]);

    // Xử lý dữ liệu từ stats
    const periods = stats.map(item => item.period);
    const totalOrders = stats.map(item => item.totalOrders);
    const totalRevenue = stats.map(item => item.totalRevenue);
    const cancelledOrders = stats.map(item => item.cancelledOrders);
    const completedOrders = stats.map(item => item.completedOrders);
    const pendingOrders = stats.map(item => item.pendingOrders);

    // Dữ liệu cho Line Chart
    const lineOrderData = {
        labels: periods,
        datasets: [
            {
                label: "Tổng đơn hàng",
                data: totalOrders,
                borderColor: "#6c63ff",
                backgroundColor: "rgba(108, 99, 255, 0.1)",
                tension: 0.4,
            },
            {
                label: "Đơn hoàn thành",
                data: completedOrders,
                borderColor: "#43bfae",
                backgroundColor: "rgba(67, 191, 174, 0.1)",
                tension: 0.4,
            },
            {
                label: "Đơn chờ xử lý",
                data: pendingOrders,
                borderColor: "#f7b731",
                backgroundColor: "rgba(247, 183, 49, 0.1)",
                tension: 0.4,
            },
            {
                label: "Đơn huỷ",
                data: cancelledOrders,
                borderColor: "#ff7675",
                backgroundColor: "rgba(255, 118, 117, 0.1)",
                tension: 0.4,
            },
        ],
    };

    const lineMonryData = {
        labels: periods,
        datasets: [
            {
                label: "Tổng doanh thu",
                data: totalRevenue,
                borderColor: "#00b894",
                backgroundColor: "rgba(0, 184, 148, 0.1)",
                tension: 0.4,
            }
        ],
    };

    // Tổng số tiền (không tính đơn bị huỷ) và tổng số đơn hàng
    const totalRevenueSum = stats.reduce((sum, item) => sum + ((item.cancelledOrders ? 0 : item.totalRevenue) || 0), 0);
    const totalOrdersSum = totalOrders.reduce((sum, v) => sum + (v || 0), 0);
    const cancelledOrdersSum = cancelledOrders.reduce((sum, v) => sum + (v || 0), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchStats(fromDate, toDate);
    };

    const exportToExcel = () => {
        const data = orders.map(item => {
            let name = '';
            let phone = '';
            if (item.user_id && userMap[item.user_id]) {
                name = userMap[item.user_id].name || userMap[item.user_id].email || '';
                phone = userMap[item.user_id].phone || '';
            } else {
                name = item.customer_name || '';
                phone = item.customer_phone || '';
            }
            return {
                'Tên/Email': name,
                'Mã đơn': item.orderId || item.id || '',
                'Ngày đặt hàng': item.order_date ? dayjs(item.order_date).format('DD/MM/YYYY HH:mm:ss') : '',
                'Số điện thoại': phone,
                'Tổng tiền': item.totalPrice || item.total_price || 0
            };
        });
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Thống kê');
        XLSX.writeFile(wb, `thong_ke_${fromDate}_den_${toDate}.xlsx`);
    };

    return (
        <div className="p-3" style={{ background: "#fff", minHeight: "100vh" }}>
            {/* <div className="border-bottom">
                <i style={{ color: "#62677399" }}>Welcome!</i>
            </div> */}

            <div className="row mt-2 p-2">
                <div className="col-md-4 p-2" style={{ height: "100px" }}>
                    <div
                        style={{
                            boxShadow: "0 -4px 10px 4px rgba(0, 0, 0, 0.1)",
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                        }}
                    >
                        <h6 className="pt-3">Tổng tiền</h6>
                        <p>{totalRevenueSum.toLocaleString()}đ</p>
                    </div>
                </div>
                <div className="col-md-4 p-2" style={{ height: "100px" }}>
                    <div
                        style={{
                            boxShadow: "0 -4px 10px 4px rgba(0, 0, 0, 0.1)",
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                        }}
                    >
                        <h6 className="pt-3">Số đơn hàng</h6>
                        <p>{totalOrdersSum}</p>
                    </div>
                </div>
                <div className="col-md-4 p-2" style={{ height: "100px" }}>
                    <div
                        style={{
                            boxShadow: "0 -4px 10px 4px rgba(0, 0, 0, 0.1)",
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
                        }}
                    >
                        <h6 className="pt-3">Đơn bị huỷ</h6>
                        <p>{cancelledOrdersSum}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row mt-4">
                    <div className="col-md-3">
                        <label style={{ marginRight: "8px" }}>Từ ngày : </label>
                        <input type="date" id="from_date" name="from_date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label style={{ marginRight: "8px" }}>Đến ngày : </label>
                        <input type="date" id="to_date" name="to_date" className="ml-2" value={toDate} onChange={e => setToDate(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <button style={{ borderColor: "#62677399" }} type="submit">Thống kê</button>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-success" onClick={exportToExcel} style={{ marginLeft: 8 }}>Xuất Excel</button>
                    </div>
                </div>
            </form>

            <h5 style={{ color: "#62677399", marginTop: "16px" }}>Biểu đồ thống kê</h5>

            <div className="row mt-3">
                <div className="col-md-12" style={{ marginBottom: "100px" }}>
                    <Line data={lineOrderData} options={{ plugins: { legend: { display: false } } }} />
                    <div style={{ textAlign: 'center', marginTop: 8, color: '#888' }}>
                        <span style={{ marginRight: 16 }}><span style={{ display: 'inline-block', width: 12, height: 4, background: '#6c63ff', borderRadius: 2, marginRight: 4 }}></span>Tổng đơn hàng</span>
                        <span style={{ marginRight: 16 }}><span style={{ display: 'inline-block', width: 12, height: 4, background: '#43bfae', borderRadius: 2, marginRight: 4 }}></span>Đơn hoàn thành</span>
                        <span style={{ marginRight: 16 }}><span style={{ display: 'inline-block', width: 12, height: 4, background: '#f7b731', borderRadius: 2, marginRight: 4 }}></span>Đơn chờ xử lý</span>
                        <span><span style={{ display: 'inline-block', width: 12, height: 4, background: '#ff7675', borderRadius: 2, marginRight: 4 }}></span>Đơn huỷ</span>
                    </div>
                </div>
                <div className="col-md-12" style={{ marginBottom: "100px" }}>
                    <Line data={lineMonryData} options={{ plugins: { legend: { display: false } } }} />
                    <div style={{ textAlign: 'center', marginTop: 8, color: '#888' }}>
                        <span style={{ display: 'inline-block', width: 12, height: 4, background: '#00b894', borderRadius: 2, marginRight: 4 }}></span>Tổng doanh thu
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
