import React from 'react';
import '../styles/Header.css';
import { useNavigate } from "react-router-dom";




const Header = () => {
    const navigate = useNavigate();

    const Gohome= ()=>{
        navigate('home');
    }

    return (
        <div className="header">
            <nav className="nav">
                <div className="nav-container">
                    <a className="nav-logo" href="home" onClick={Gohome}>KwenToon</a>
                    <button 
                        className="nav-toggle" 
                        type="button"
                        
                    >
                        <span className="toggle-icon"></span>
                    </button>
                    <div className="nav-links">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <a className="nav-link active"  href="home" onClick={Gohome}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Popular</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link ">Completed</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">MyList</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
