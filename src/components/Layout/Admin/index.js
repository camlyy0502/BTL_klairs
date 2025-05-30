import Header from "./Header";
import Sidebar from "./Sidebar";
function Admin({ children }) {
    return (
        <div style={{ backgroundColor: '#efeff099' }}>
            <Header />
            <div className="container">
                <div className="row" style={{ width: '1450px' }}>
                    {/* Sidebar */}
                    <Sidebar />
                    <div className="col-md-10 ad-main" >{children}</div>
                </div>
            </div>

        </div>
    );
}
export default Admin;