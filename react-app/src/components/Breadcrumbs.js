import React from 'react';

function Breadcrumbs({ items }) {
    return (
        <div className="col-sm-6">
            <ol className="breadcrumb float-sm-end">
                {items.map((item, index) => (
                    <li className={`breadcrumb-item${index === items.length - 1 ? ' active' : ''}`} key={index}>
                        {index === items.length - 1 ? (
                            item.label
                        ) : (
                            <a href={item.link}>{item.label}</a>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default Breadcrumbs;

// const breadcrumbItems = [
//     { label: 'Home', link: '/' },
//     { label: 'Dashboard', link: '/dashboard' },
// ];
//
// <Breadcrumbs items={breadcrumbItems} />
