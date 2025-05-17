import { Line, Pie } from "react-chartjs-2";
import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

function Home() {
    // Dữ liệu cho Pie Chart
    const pieData = {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
            {
                data: [30, 50, 20],
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
            },
        ],
    };

    // Dữ liệu cho Line Chart
    const lineData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
            {
                label: "Orders",
                data: [0, 10, 20, 10, 10, 30],
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
            },
            {
                label: "Sales",
                data: [0, 11, 15, 30, 40, 50],
                borderColor: "blue",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
        ],
    };

    return (
        <div className="p-3" style={{ background: "#fff", minHeight: "100vh" }}>
            <div className="border-bottom">
                <i style={{ color: "#62677399" }}>Welcome!</i>
            </div>

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
                        <p>0đ</p>
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
                        <p>0</p>
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
                        <h6 className="pt-3">Số tài khoản</h6>
                        <p>0</p>
                    </div>
                </div>
            </div>

            <form>
                <div className="row mt-4">
                    <div className="col-md-3">
                        <label style={{ marginRight: "8px" }}>Từ ngày : </label>
                        <input type="date" id="from_date" name="from_date" />
                    </div>
                    <div className="col-md-3">
                        <label style={{ marginRight: "8px" }}>Đến ngày : </label>
                        <input type="date" id="to_date" name="to_date" className="ml-2" />
                    </div>
                    <div className="col-md-2">
                        <button style={{ borderColor: "#62677399" }}>Thống kê</button>
                        <button type="button" style={{ borderColor: "#62677399", marginLeft: "10px" }}>
                            Tất cả
                        </button>
                    </div>
                </div>
            </form>

            <h5 style={{ color: "#62677399", marginTop: "16px" }}>Biểu đồ thống kê</h5>



            {/* Chọn năm */}
            <div className="chart row">
                <div className="col-md-2">
                    <input
                        type="text"
                        style={{ borderColor: "#62677399", width: "70%" }}
                        placeholder="Nhập năm"
                    />
                </div>
                <div className="col-md-2">
                    <select className="w-100"></select>
                </div>
                <div className="col-md-2">
                    <button style={{ borderColor: "#62677399" }}>Chọn</button>
                </div>
            </div>

            {/* Biểu đồ Line */}
            {/* Biểu đồ Pie */}
            <div className="row mt-3">
                

                <div className="col-md-8" style={{ marginBottom: "100px" }}>
                    <Line data={lineData} />
                </div>
            </div>
        </div>
    );
}

export default Home;
