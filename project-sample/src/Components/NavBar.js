import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="nav-brand">
                Harry Potter Bookstore
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/books" className="nav-link">Books</Link>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
                <Link to="/addbook" className="nav-link">Add Book</Link>
            </div>
        </nav>
    );
};

export default NavBar;