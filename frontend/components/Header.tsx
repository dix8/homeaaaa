import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  logo?: string | null;
}

const Header: React.FC<HeaderProps> = ({ title = 'My Portfolio', logo }) => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              {logo ? (
                <Image
                  src={logo}
                  alt={title}
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              ) : null}
              <span className="text-xl font-bold ml-2">{title}</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="/projects" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              Projects
            </Link>
            <Link href="/contact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 