import React from 'react';
import Link from 'next/link';

interface FooterProps {
  copyright?: string;
  icp?: string;
  gongan?: string;
}

const Footer: React.FC<FooterProps> = ({ copyright, icp, gongan }) => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-gray-500 text-sm">
            {copyright || `© ${new Date().getFullYear()} All rights reserved.`}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {icp && (
              <Link
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-700"
              >
                {icp}
              </Link>
            )}
            
            {gongan && (
              <Link
                href="http://www.beian.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-700 flex items-center"
              >
                <img
                  src="/images/gongan.png"
                  alt="公安备案图标"
                  className="h-4 w-4 mr-1"
                />
                {gongan}
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 