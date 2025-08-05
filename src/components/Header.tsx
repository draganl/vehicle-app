// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition duration-150 ease-in-out">
          Vehicle App
        </Link>
        <div className="space-x-4">
          <Link
            to="/makes"
            className="text-lg hover:text-gray-300 hover:underline transition duration-150 ease-in-out"
          >
            Makes
          </Link>
          <Link
            to="/models"
            className="text-lg hover:text-gray-300 hover:underline transition duration-150 ease-in-out"
          >
            Models
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
