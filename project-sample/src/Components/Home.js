import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            marginTop: '20px'
        }}>
            <h1 style={{
                color: '#2c3e50',
                fontSize: '2.5em',
                marginBottom: '20px'
            }}>
                Welcome to Harry Potter Bookstore
            </h1>
            <p style={{
                color: '#7f8c8d',
                fontSize: '1.2em',
                lineHeight: '1.6',
                marginBottom: '30px'
            }}>
                Discover the magical world of Harry Potter with our collection of the first three books in the series.
                Start your journey at Hogwarts today!
            </p>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px'
            }}>
                <Link to="/books" style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '1.1em'
                }}>Browse Books</Link>
                <Link to="/login" style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '1.1em'
                }}>Login to Order</Link>
            </div>
        </div>
    );
};

export default Home;