
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
        AI Nail Art Studio
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        Turn your nail art dreams into reality.
      </p>
    </header>
  );
};

export default Header;
