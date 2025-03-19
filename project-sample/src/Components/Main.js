import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import LoginForm from './LoginForm';
import RegistrationForm from './Registrationform';
import BooksList from './BooksList';
import AddBookForm from './AddBookForm';

const Main = () => {
    return (
        <main style={{ flex: 1 }}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/books" element={<BooksList />} />
                <Route path="/addbook" element={<AddBookForm />} />
            </Routes>
        </main>
    );
};

export default Main;