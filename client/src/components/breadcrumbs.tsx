import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// const breadcrumbStyle = {
//   backgroundColor: '#007bff', // Background color matching the navbar
//   padding: '10px', // Adjust the padding as needed
//   marginRight: '20px', // Move it a little to the right
//   borderRadius: '4px', // Rounded corners
// };

const linkStyle = {
    color: '#007bff', 
    textDecoration: 'none',
    paddingLeft: '4px',
  };

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '');

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
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
