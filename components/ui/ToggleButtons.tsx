"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ToggleButtons: React.FC = () => {
  const [activeButton, setActiveButton] = useState<'forYou' | 'following'>('forYou');

  useEffect(() => {
    console.log('ToggleButtons component mounted');
  }, []);

  const handleButtonClick = (button: 'forYou' | 'following') => {
    setActiveButton(button);
  };

  return (
    <div className="flex justify-center mb-4">
      <Link href="/">
        <div
          onClick={() => handleButtonClick('forYou')}
          className={`cursor-pointer bg-blue-500 text-white py-2 px-4 rounded focus:outline-none transition ${
            activeButton === 'forYou' ? 'font-bold' : ''
          }`}
        >
          <p className="text-light-1 max-lg:hidden">For You</p>
        </div>
      </Link>
      <Link href="/following">
        <div
          onClick={() => handleButtonClick('following')}
          className={`cursor-pointer bg-blue-500 text-white py-2 px-4 rounded focus:outline-none transition ${
            activeButton === 'following' ? 'font-bold' : ''
          }`}
        >
          <p className="text-light-1 max-lg:hidden">Following</p>
        </div>
      </Link>
    </div>
  );
};

export default ToggleButtons;