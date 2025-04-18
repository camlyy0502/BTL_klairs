
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

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
                    <img className='' style={{ width: 50, borderRadius: '50%', }} src='' alt />
                    <i style={{ fontFamily: '"Style Script"', fontSize: "26px" }}>Klairs</i>
                </div>
                <div className="col-md-6 d-flex " style={{ alignItems: 'center' }}>
                    <i class="fas fa-list" style={{ color: '#62677399' }}></i>
                    <div className='search' style={{ marginLeft: '12px' }}>
                        <input type="text" placeholder="Search" style={{ outline: 'none', border: 'none', position: 'relative' }}></input>
                        <span style={{ color: '#62677399', position: 'absolute', left: '520px' }}><i class="fas fa-search"></i></span>
                    </div>
                </div>
                <div className="col-md-1 text-end">
                    <i class="fas fa-bell" style={{ color: '#62677399' }}></i>
                </div>
                <div className="col-md-2 account " onClick={toggleSettings} ref={settingsRef} style={{ position: 'relative', cursor: 'pointer' }}>
                    <img className='' style={{ width: 50, borderRadius: '50%' }} src='https://e7.pngegg.com/pngimages/754/474/png-clipart-computer-icons-system-administrator-avatar-computer-network-heroes-thumbnail.png' alt />
                    <span style={{ fontSize: 16, color: '#62677399', marginLeft: '4px' }}>Admin</span>
                    <span style={{ fontSize: 16, color: '#62677399', marginLeft: '4px' }}><i class="fas fa-chevron-down"></i></span>
                    {isSettingsOpen && (
                        <div className='account_child' style={{ position: 'absolute', marginTop: '12px', padding: '8px', background: '#dedede' }}>
                            <h6>Welcome!</h6>
                            <ul >
                                <li><Link to=''><i class="fas fa-user" style={{ paddingRight: '8px', color: '#62677399', textDecoration: 'none' }}></i>Profile</Link></li>
                                <li><Link to=''><i class="fas fa-cog" style={{ paddingRight: '8px', color: '#62677399', textDecoration: 'none' }}></i>Settings</Link></li>
                                <li><Link to=''><i class="fas fa-lock" style={{ paddingRight: '8px', color: '#62677399', textDecoration: 'none' }}></i>Lock Screen</Link></li>
                                <li className='pt-2'><Link to='/Login'><i class="fas fa-cog" style={{ paddingRight: '8px', color: '#62677399', textDecoration: 'none' }}></i>
                                    Logout</Link></li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="col-md-1">
                    <span style={{ color: '#62677399' }}><i class="fas fa-cog me-2"></i></span>
                </div>




            </div>

        </div>
    )
}

export default Header