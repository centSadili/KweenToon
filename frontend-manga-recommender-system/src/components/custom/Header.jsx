import React from 'react';
import '../styles/Header.css';



const Header = () => {
    return (
        <div className="header">
            <nav className="nav">
                <div className="nav-container">
                    <a className="nav-logo" href="#">KwenToon</a>
                    <button 
                        className="nav-toggle" 
                        type="button"
                    >
                        <span className="toggle-icon"></span>
                    </button>
                    <div className="nav-links">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <a className="nav-link active" href="/home">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
