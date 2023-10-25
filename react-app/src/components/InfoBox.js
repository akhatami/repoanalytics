import React from 'react';

function InfoBox({ colSize = '3', color = 'green', iconClass = 'fa-code', text = 'Text', number, content, path }) {
    const infoBoxStyle = {
        cursor: path ? 'pointer' : 'auto', // Change cursor to pointer if a path is provided
    };

    const handleClick = () => {
        if (path) {
            window.location.href = path; // Redirect to the specified path
        }
    };

    return (
        <div className={`col-lg-${colSize} info-box-container`} style={infoBoxStyle} onClick={handleClick}>
            <div className={`info-box bg-gradient-${color}`}>
                <span className="info-box-icon"><i className={`fas ${iconClass}`}></i></span>
                <div className="info-box-content">
                    <span className="info-box-text">{text}</span>
                    {number !== null && number !== undefined ? (
                        <span className="info-box-number">{number}</span>
                    ) : null}
                    {content !== null && content !== undefined ? (
                        <span className="info-box-content small">{content}</span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default InfoBox;
