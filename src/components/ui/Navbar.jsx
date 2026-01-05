import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Menu } from 'lucide-react';
import { ToastTwo } from '../../pages/ToastTwo';
import { auth } from '../../firebase';

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setShowLogoutToast(true);
      setTimeout(() => {
        setShowLogoutToast(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error logging out:', error);
      // Optionally, show an error toast here
    }
  };

  const buttonClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0";
  
  const dropdownClasses = "z-40 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-950 shadow-md absolute mt-2 right-0";

  return (
    <>
      <nav className="bg-white border-b z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-[#4338ca]">MockAI</h2>
          </div>
          
          {/* <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <a href="/dashboard" className="text-gray-950 hover:text-[#4338ca] transition-colors">
              Dashboard
            </a>
            
          </div> */}

          <div className="flex items-center space-x-4" ref={dropdownRef}>
            <button className={`${buttonClasses} md:hidden`}>
              <Menu className="h-5 w-5" />
            </button>
            
            
            
            <div className="relative">
              <button 
                className={buttonClasses}
                onClick={() => toggleDropdown('user')}
              >
                <User className="h-5 w-5" />
              </button>
              
              {activeDropdown === 'user' && (
                <div className={dropdownClasses}>
                  <div className="px-2 py-1.5 text-sm font-semibold">My Account</div>
                  <div className="h-px bg-gray-200 my-1" />
                  <button 
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 w-full"
                    onClick={() => {
                      navigate('/profile');
                      setActiveDropdown(null);
                    }}
                  >
                    Profile
                  </button>
                  <button 
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <ToastTwo
        show={showLogoutToast}
        message="Logging out..."
        onClose={() => setShowLogoutToast(false)}
        type="info"
      />
    </>
  );
}

export default Navbar;

