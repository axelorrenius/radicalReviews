import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './searchBar.css';
import Modal from 'react-bootstrap/Modal';
import { useAuth } from './authContext';

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

  // search stuff
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };

  // Function to handle search input change
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setSearchInput(input);

    // BYT DETTA TILL NÅGON VERKLIGT 
    const mockSuggestions = ['Course 1', 'Course 2', 'Course 3', 'User 1', 'User 2'];
    
    // Filter suggestions based on the input
    const filteredSuggestions = mockSuggestions.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };

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

  const { authenticated, login, logout } = useAuth();

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

        <div className="search-bar px-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <div className="suggestions">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>

        {authenticated ? (
          <div className="ms-auto d-flex align-items-center">
            <span className="navbar-text px-4">{user ? user.name : null}</span>
            <button className="btn btn-outline-light px-4" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-outline-light px-4" onClick={openModal}>
            Login
          </button>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Login / Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <form>
            <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" 
          className="btn btn-primary"
          onClick={login}>
            Login
          </button>
        </form>
       
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
          Close
        </button>
        {/* You can add a "Submit" button if needed */}
      </Modal.Footer>
      </Modal>
    </nav>

  );
};

export default NavBar;
