import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end', 
  marginRight: '15px',
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  paddingRight: '2px',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '');

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb" style={breadcrumbContainerStyle}>
        <li className="breadcrumb-item">
          <Link to="/" style={linkStyle}>
            home
          </Link>
        </li>
        {pathSegments.map((segment, index) => (
          <li className="breadcrumb-item" key={index}>
            <Link to={`/${segment}`} style={linkStyle}>
              {segment}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
