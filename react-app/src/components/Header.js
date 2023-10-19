import React from 'react';

function Header(){

    return(
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            data-widget="pushmenu"
                        ><i className="fas fa-bars"></i></button>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <a href="/home" className="nav-link">Home</a>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <a href="/contact" className="nav-link">Contact</a>
                    </li>
                    <li className="nav-item dropdown">
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown2">
                            <a className="dropdown-item" href="#">FAQ</a>
                            <a className="dropdown-item" href="#">Support</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#">Contact</a>
                        </div>
                    </li>
                </ul>
            </nav>
    );
}

export default Header;
