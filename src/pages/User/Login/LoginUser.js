import React, { useState } from "react";
import AccountApi from "../../../Api/Account/AccountApi";

const Login = ({ isVisible, onClose, isRegister }) => {
    const [isRightPanelActive, setRightPanelActive] = useState(!!isRegister);
    const [isSubmit, setIsSubmit] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [signUpData, setSignUpData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);

    const handleSignUpClick = () => {
        setRightPanelActive(true);
        setError("");
    };

    const handleSignInClick = () => {
        setRightPanelActive(false);
        setError("");
    };
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setError("");
        
        try {
            const response = await AccountApi.login(loginData);
            if (response.cookie) {
                // Get user info to check role
                const userInfo = await AccountApi.info();
                if (userInfo.roles && userInfo.roles.some(role => role !== "CUSTOMER")) {
                    // If user has any role other than CUSTOMER, redirect to admin
                    window.location.href = "/admin";
                } else {
                    // If user is a customer, just reload the page
                    window.location.reload();
                }
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsSubmit(false);
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setError("");
        
        try {
            await AccountApi.register(signUpData);
            setRightPanelActive(false);
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmit(false);
        }
    };

    // Khi prop isRegister thay đổi, cập nhật panel
    React.useEffect(() => {
        setRightPanelActive(!!isRegister);
    }, [isRegister]);

    if (!isVisible) {
        return null;
    }
    return (
        <div >
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                }}
                onClick={onClose}
            ></div>
            <div className='login-container'>
                <div
                    className={`container1 ${isRightPanelActive ? "right-panel-active" : ""}`}
                    id="container"
                >
                    <div className="form-container sign-up-container">
                        <form onSubmit={handleSignUpSubmit}>
                            <h1>Create Account</h1>
                            <div>
                                <img src="https://klairsvietnam.vn/wp-content/uploads/2020/07/logo-klairs.png" alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <input 
                                type="text" 
                                placeholder="Name" 
                                value={signUpData.name}
                                onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                                required
                            />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={signUpData.email}
                                onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                                required
                            />
                            <div style={{ position: 'relative', width: '284px' }}>
                                <input 
                                    type={showSignUpPassword ? "text" : "password"}
                                    placeholder="Password" 
                                    value={signUpData.password}
                                    onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                                    required
                                    style={{ paddingRight: 36 }}
                                />
                                <span
                                    onClick={() => setShowSignUpPassword((prev) => !prev)}
                                    style={{
                                        position: 'absolute',
                                        right: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        zIndex: 2
                                    }}
                                >
                                    {!showSignUpPassword ? (
                                        <i className="fas fa-eye-slash"></i>
                                    ) : (
                                        <i className="fas fa-eye"></i>
                                    )}
                                </span>
                            </div>
                            <button type="submit" disabled={isSubmit}>
                                {isSubmit ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form onSubmit={handleLoginSubmit}>
                            <h1>Sign in</h1>
                            <div>
                                <img src="https://klairsvietnam.vn/wp-content/uploads/2020/07/logo-klairs.png" alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={loginData.email}
                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                required
                            />
                            <div style={{ position: 'relative', width: '284px' }}>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password" 
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                    required
                                    style={{ paddingRight: 36 }}
                                />
                                <span
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    style={{
                                        position: 'absolute',
                                        right: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        zIndex: 2
                                    }}
                                >
                                    {!showPassword ? (
                                        <i className="fas fa-eye-slash"></i>
                                    ) : (
                                        <i className="fas fa-eye"></i>
                                    )}
                                </span>
                            </div>
                            {/* <a href="#">Forgot your password?</a> */}
                            <button  disabled={isSubmit}> {isSubmit ? 'Signing In...' : 'Sign In'}</button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay2">
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <button className="ghost" id="signIn" onClick={handleSignInClick}>Sign In</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Enter your personal details and start journey with us</p>
                                <button className="ghost" id="signUp" onClick={handleSignUpClick}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;