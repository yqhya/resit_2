import React, { useState, useEffect } from 'react';

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');
    const [orderQuantity, setOrderQuantity] = useState({});

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:555/books');
            const data = await response.json();
            setBooks(data);
        } catch (err) {
            setError('Error fetching books');
            console.error(err);
        }
    };

    const handleOrder = async (bookId) => {
        try {
            const quantity = orderQuantity[bookId] || 1;
            const response = await fetch('http://localhost:555/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookId,
                    quantity
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error placing order');
            }

            alert('Order placed successfully!');
            fetchBooks(); // Refresh the book list
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Harry Potter Books</h2>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.bookGrid}>
                {books.map(book => (
                    <div key={book.id} style={styles.bookCard}>
                        <img 
                            src={book.imageUrl} 
                            alt={book.title}
                            style={styles.bookImage}
                        />
                        <h3 style={styles.bookTitle}>{book.title}</h3>
                        <p style={styles.author}>By {book.author}</p>
                        <p style={styles.description}>{book.description}</p>
                        <p style={styles.price}>Price: ${book.price.toFixed(2)}</p>
                        <p style={styles.quantity}>
                            {book.quantity > 0 
                                ? `${book.quantity} copies available`
                                : 'Out of stock'
                            }
                        </p>
                        <div style={styles.orderSection}>
                            <input
                                type="number"
                                min="1"
                                max={book.quantity}
                                value={orderQuantity[book.id] || 1}
                                onChange={(e) => setOrderQuantity({
                                    ...orderQuantity,
                                    [book.id]: parseInt(e.target.value)
                                })}
                                style={styles.quantityInput}
                                disabled={book.quantity === 0}
                            />
                            <button 
                                onClick={() => handleOrder(book.id)}
                                style={styles.orderButton}
                                disabled={book.quantity === 0}
                            >
                                Order Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    title: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '2.5em'
    },
    bookGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        padding: '20px',
    },
    bookCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    bookImage: {
        width: '100%',
        height: '300px',
        objectFit: 'contain',
        marginBottom: '15px',
    },
    bookTitle: {
        margin: '0 0 10px 0',
        color: '#2c3e50',
        fontSize: '1.4em',
    },
    author: {
        color: '#7f8c8d',
        marginBottom: '10px',
        fontStyle: 'italic',
    },
    description: {
        color: '#34495e',
        marginBottom: '15px',
        lineHeight: '1.4',
        flex: 1,
    },
    price: {
        fontSize: '1.3em',
        color: '#e74c3c',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    quantity: {
        color: '#27ae60',
        marginBottom: '15px',
        fontWeight: 'bold',
    },
    orderSection: {
        display: 'flex',
        gap: '10px',
        marginTop: 'auto',
    },
    quantityInput: {
        width: '70px',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1em',
    },
    orderButton: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        flex: 1,
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    error: {
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#fceaea',
        borderRadius: '4px',
    },
};

export default BooksList;
