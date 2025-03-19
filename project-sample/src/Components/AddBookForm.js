import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBookForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        price: '',
        quantity: '',
        imageUrl: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to add books');
            }

            const response = await fetch('http://localhost:555/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    author: formData.author,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity),
                    imageUrl: formData.imageUrl
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Book added successfully!');
                navigate('/books');
            } else {
                throw new Error(data.message || 'Error adding book');
            }
        } catch (err) {
            setError(err.message || 'Error adding book. Make sure you are logged in as admin.');
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Add New Book</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Author:</label>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={{...styles.input, height: '100px'}}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="0"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Image URL:</label>
                    <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Add Book</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
    },
    form: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#2c3e50',
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    error: {
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: '20px',
    },
};

export default AddBookForm;
