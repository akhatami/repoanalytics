import React from 'react';

function SideBar(){
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
                    {/* Dashboard */}
                    <li className="nav-item">
                        <a href="#" className="nav-link">
                            <i className="nav-icon fas fa-tachometer-alt"></i>
                            <p>Summary Dashboard</p>
                        </a>
                    </li>

                    {/* Custom Top-Level Menu Items */}
                    <li className="nav-item">
                        <a href="#" className="nav-link">
                            <i className="nav-icon fas fa-chart-pie"></i>
                            <p>Repositories</p>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a href="#" className="nav-link">
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
