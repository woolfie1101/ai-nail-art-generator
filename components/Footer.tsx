import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-6 text-sm text-gray-500">
      <div className="flex justify-center items-center space-x-4 mb-2">
        <a 
          href="https://www.linkedin.com/in/joohee-kim-077740347/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-indigo-500 transition-colors"
          aria-label="Joohee Kim's LinkedIn Profile"
        >
          LinkedIn
        </a>
        <span aria-hidden="true">|</span>
        <a 
          href="mailto:woolfie1101@gmail.com" 
          className="hover:text-indigo-500 transition-colors"
          aria-label="Email Joohee Kim"
        >
          Email : woolfie1101@gmail.com
        </a>
      </div>
      <p>&copy; 2025 Kim Joohee. All rights reserved.</p>
       <p className="mt-2">Powered by Gemini AI</p>
    </footer>
  );
};

export default Footer;
