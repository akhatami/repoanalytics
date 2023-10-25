import React from 'react';
import { useLocation } from 'react-router-dom'; // Import Link and useLocation
function SideBar(){
    const location = useLocation();
    const isMenuItemActive = (path) => location.pathname === path;

    return(
        <nav className="main-sidebar sidebar-dark-primary">
            {/* Sidebar content */}
            <div className="sidebar-brand">
                <a href="/" className="brand-link">
                    <img
                        src="/logo192.png"
                        alt="logo"
                        className="brand-image img-circle"
                    />
                    <span className="brand-text font-weight-light ">Repo-Insights</span>
                </a>
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    <li className="nav-item">
                        <a href="/repositories" className={`nav-link ${isMenuItemActive('/repositories') ? 'active' : ''}`}>
                            <i className="nav-icon fas fa-laptop-code"></i>
                            <p>Repositories</p>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a href="/statistics" className={`nav-link ${isMenuItemActive('/statistics') ? 'active' : ''}`}>
                            <i className="nav-icon fas fa-chart-pie"></i>
                            <p>Statistics</p>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a href="/request" className={`nav-link ${isMenuItemActive('/request') ? 'active' : ''}`}>
                            <i className="nav-icon fas fa-plus-circle"></i>
                            <p>Add a repo</p>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a href="/about" className={`nav-link ${isMenuItemActive('/about') ? 'active' : ''}`}>
                            <i className="nav-icon fas fa-cogs"></i>
                            <p>About</p>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default SideBar;
