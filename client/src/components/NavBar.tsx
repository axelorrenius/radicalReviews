import React from 'react';
import { Link } from 'react-router-dom';

// Include Bootstrap CSS classes (assuming you've included Bootstrap in your project)
import 'bootstrap/dist/css/bootstrap.min.css';

type NavbarProps = {
  toggleSideMenu: () => void;
};

const NavBar = (props: NavbarProps) => {
  const user = {
    id: 1,
    name: 'MockUser',
    email: 'yeehaw@yemail.com',
    isAdmin: true,
  };
  const authenticated = true;

  const menuItems = [
    {
      title: 'Home',
      pageURL: '/',
      requiresAdmin: false,
    },
    {
      title: 'Courses',
      pageURL: '/courses', 
      requiresAdmin: true,
    },
    {
      title: 'User',
      pageURL: '/user', 
      requiresAdmin: true,
    },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <Link to="/" className="navbar-brand">
        Scopus 
      </Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {menuItems
            .filter(({ requiresAdmin }) => (user && requiresAdmin && user.isAdmin) || !requiresAdmin)
            .map(({ title, pageURL }) => (
              <li className="nav-item" key={title}>
                <Link to={pageURL} className="nav-link">
                  {title}
                </Link>
              </li>
            ))}
        </ul>
        {authenticated ? (
          <div className="ms-auto d-flex align-items-center"> {/* Use ml-auto and d-flex to push the content to the right corner */}
		  <span className="navbar-text px-4">{user ? user.name : null}</span>
            {/* <button
              className="btn btn-outline-secondary mr-4"
              onClick={props.toggleSideMenu}
            >
              Instructions
            </button> */}
            <a href="/api/session/logout" className="btn btn-outline-light px-4">
              Logout
            </a>
          </div>
        ) : (
          <a href="/api/session/login" className="btn btn-outline-light px-4">
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
