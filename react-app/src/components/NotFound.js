import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>404 - Not Found</h1>
                <p style={styles.text}>Sorry, the page you are looking doesn't exist.</p>
                <Link to="/repositories" style={styles.link}>
                    Search Among Available Repositories
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa', // Match your dashboard background color
    },
    content: {
        textAlign: 'center',
    },
    title: {
        fontSize: '3em',
        color: '#dc3545', // Match your dashboard accent color
    },
    text: {
        fontSize: '1.2em',
        color: '#6c757d', // Match your dashboard text color
    },
    link: {
        display: 'block',
        marginTop: '20px',
        fontSize: '1.2em',
        color: '#007bff', // Match your dashboard link color
    },
};

export default NotFound;
