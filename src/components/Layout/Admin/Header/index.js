
import { Link } from 'react-router-dom';
import React, { useState, useRef } from 'react';

function Header() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef(null);
    const toggleSettings = () => {
        setIsSettingsOpen(prev => !prev);

    };
    return (
        <div className="container">
            <div className="header-admin row" style={{ height: '70px', alignItems: 'center' }}>
                <div className="col-md-2">
                    <img className='' src='https://www.klairs.com/assets/images/common/logo.svg' alt="" />
                    {/* <i style={{ fontFamily: '"Style Script"', fontSize: "26px" }}>Klairs</i> */}
                </div>
                
            </div>

        </div>
    )
}

export default Header