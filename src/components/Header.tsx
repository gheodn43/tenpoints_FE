'use client';

import client from "../apolloClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CHECK_AUTH_QUERY } from '@/graphql/checkAuth.query';
import { useQuery } from "@apollo/client";
import { useLogout } from '../hooks/useLogout'; 

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false); // New state
  const router = useRouter();
  const { data: authData, loading: authLoading } = useQuery(CHECK_AUTH_QUERY, {
    client,
  });
  const logout = useLogout();

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = localStorage.getItem('username');

      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        console.log('username is null and call check auth')
        if (authData && authData.isAuthenticated.is_authenticated) {
          console.log('username: ' + authData.isAuthenticated.username + ", is auth: "+ authData.isAuthenticated.is_authenticated)
          localStorage.setItem('username', authData.isAuthenticated.username);
          setUsername(authData.isAuthenticated.username);
        }
      }
      setIsAuthChecked(true); // Set to true after auth is checked
    };

    if (!authLoading && authData) { // Ensure data is not loading before calling fetchUsername
      fetchUsername();
    }
  }, [authData, authLoading]);
  const handleUserIconClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    const success = await logout(); 
    if (success) {
      setUsername(null);
      setMenuOpen(false);
      router.replace('/');
    }
  };

  return (
    <header className="w-full flex justify-between px-8 py-4">
      <Link href="/">
        <h1 className="font-bold font-racing-sans text-3xl">TENPOINTS</h1>
      </Link>
      
      {isAuthChecked ? (
        username ? (
          <div className="relative">
            <span className="font-inter responsive-font-medium flex items-center space-x-2 ">
              <span>{username}</span>
              <i 
                className="fa-regular fa-user transition-transform duration-300 hover:cursor-pointer"
                onClick={handleUserIconClick}
              ></i>
            </span>
            {menuOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-black border border-gray-300 shadow-lg z-10">
                <button 
                  className="w-full text-left responsive-font-small px-4 py-2 hover:bg-secondary" 
                  onClick={handleProfileClick}
                >
                  Profile
                </button>
                <button 
                  className="w-full text-left responsive-font-small px-4 py-2 hover:bg-secondary" 
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/signin">
            <button className="font-inter responsive-font-medium">Sign in</button>
          </Link>
        )
      ) : (
        ''
      )}
    </header>
  );
};

export default Header;
