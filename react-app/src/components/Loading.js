import React from 'react';

const Loading = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <i className="fas fa-spinner fa-spin" style={styles.spinner}></i>
                <p style={styles.text}>Loading...</p>
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
    spinner: {
        fontSize: '3em',
        color: '#007bff', // Match your dashboard accent color
        marginBottom: '20px',
    },
    text: {
        fontSize: '1.2em',
        color: '#6c757d', // Match your dashboard text color
    },
};

export default Loading;
