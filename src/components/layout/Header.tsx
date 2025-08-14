'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '#home', current: true },
  { name: 'About', href: '#about', current: false },
  { name: 'Features', href: '#features', current: false },
  { name: 'Partners', href: '#partners', current: false },
  { name: 'News', href: '#news', current: false },
  { name: 'Contact', href: '#contact', current: false },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication status on component mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSmoothScroll = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setProfileMenuOpen(false);
    router.push('/');
  };

  // Don't show landing page navigation on dashboard
  const isDashboard = pathname === '/dashboard';
  const isLoginPage = pathname === '/login';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Kenya Climate Resilience Dashboard</span>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">KCRD</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Desktop Navigation - Only show on landing page */}
        {!isDashboard && !isLoginPage && (
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleSmoothScroll(item.href)}
                className={`text-sm font-semibold leading-6 ${
                  item.current ? 'text-primary-600' : 'text-gray-900 hover:text-primary-600'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // Authenticated user - show profile menu
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-900 hover:text-primary-600 focus:outline-none"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span>{user?.firstName || 'User'}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                      <div className="text-gray-500">{user?.email}</div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not authenticated - show sign in button
              <Link href="/login" className="btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Kenya Climate Resilience Dashboard</span>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">KC</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">KCRD</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                {!isDashboard && !isLoginPage && (
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          handleSmoothScroll(item.href);
                          setMobileMenuOpen(false);
                        }}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                          item.current ? 'text-primary-600' : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
                <div className="py-6">
                  <div className="flex flex-col space-y-4">
                    {isAuthenticated ? (
                      <>
                        <div className="px-3 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                          <div className="text-gray-500">{user?.email}</div>
                        </div>
                        <Link 
                          href="/dashboard" 
                          className="text-base font-semibold leading-7 text-gray-900 hover:text-primary-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                          className="text-base font-semibold leading-7 text-gray-900 hover:text-primary-600 text-left"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link 
                        href="/login" 
                        className="btn-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Click outside to close profile menu */}
      {profileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setProfileMenuOpen(false)}
        />
      )}
    </header>
  );
}
