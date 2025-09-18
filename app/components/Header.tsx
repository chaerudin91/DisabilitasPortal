import React from 'react';
import { Accessibility, ArrowLeft, Menu, X } from 'lucide-react';
import { EarOff } from 'lucide-react'; // Pastikan impor ikon yang baru

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  features: Array<{
    id: string;
    title: string;
    page: string;
  }>;
}

export default function Header({ currentPage, setCurrentPage, features }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                setCurrentPage('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <EarOff className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Deafine
              </h1>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`transition-colors font-medium ${
                currentPage === 'home' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Home
            </button>
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setCurrentPage(feature.page)}
                className={`transition-colors font-medium ${
                  currentPage === feature.page 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </nav>


          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  setCurrentPage('home');
                  setMobileMenuOpen(false);
                }}
                className={`text-left font-medium transition-colors ${
                  currentPage === 'home' 
                    ? 'text-indigo-600' 
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Home
              </button>
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => {
                    setCurrentPage(feature.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left font-medium transition-colors ${
                    currentPage === feature.page 
                      ? 'text-indigo-600' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {feature.title}
                </button>
              ))}
              {currentPage !== 'home' && (
                <button
                  onClick={() => {
                    setCurrentPage('home');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors font-medium text-left"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}