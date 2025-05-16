import React, { useState } from "react";
import AccountApi from "../../../Api/Account/AccountApi";

const Login = ({ isVisible, onClose }) => {
    const [isRightPanelActive, setRightPanelActive] = useState(false);
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
                window.location.reload();
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
                             <div className="social-container">
                                <a href="#" className="social"><img src="https://coachingskills.vn/wp-content/uploads/2024/07/facebook-logo-icon-facebook-icon-png-images-icons-and-png-backgrounds-1.png" alt=""/></a>
                                <a href="#" className="social"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt=""/></a>

                            </div>
                            <span>or use your email for registration</span>
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
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={signUpData.password}
                                onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                                required
                            />
                            <button type="submit" disabled={isSubmit}>
                                {isSubmit ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form onSubmit={handleLoginSubmit}>
                            <h1>Sign in</h1>
                             <div className="social-container">
                                <a href="#" className="social"><img src="https://coachingskills.vn/wp-content/uploads/2024/07/facebook-logo-icon-facebook-icon-png-images-icons-and-png-backgrounds-1.png" alt=""/></a>
                                <a href="#" className="social"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt=""/></a>

                            </div>
                            <span>or use your account</span>
                            {error && <div className="error-message">{error}</div>}
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={loginData.email}
                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                required
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                required
                            />
                            <a href="#">Forgot your password?</a>
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