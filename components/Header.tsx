import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
        AI Nail Art Studio
      </h1>
      <p className="text-base text-gray-500 mt-2">
        Turn your nail art dreams into reality.
      </p>
    </header>
  );
};

export default Header;