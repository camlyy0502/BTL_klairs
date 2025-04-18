import React from 'react'

const AccountForm = ({ onClose }) => {
    return (
        <div>
            <div className="form-popup111">
                <form className="form-container">
                    <h4 className='mt-3'>Thông tin tài khoản</h4>
                    <div s>
                        <label className="name">Username</label>
                        <input
                            type="text"
                            placeholder="Nhập tên"
                            name="user_name"
                            // value={user.user_name}
                            // onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="name">Password</label>
                        <input
                            type="text"
                            placeholder="Nhập tên"
                            name="user_password"
                        // value={user.user_password}
                        // onChange={handleChange}
                        />
                    </div>
                    <label className="name">Email</label>
                    <input
                        type="text"
                        placeholder="Nhập tên"
                        name="user_email"
                        // value={user.user_email}
                        // onChange={handleChange}
                        required
                    />

                    <div className='form-bt'>
                        <button type="submit" className="btn btn-primary">Lưu</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AccountForm