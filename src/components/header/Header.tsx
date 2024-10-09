"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './header.module.css';
import Navbar from './Navbar';
import LogoutButton from './LogoutButton';

const Header = () => {
  const [tokenExists, setTokenExists] = useState(false);

  const checkToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug statement
    setTokenExists(!!token);
  };

  useEffect(() => {
    checkToken();
    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  return (
    <header className={styles.header}>
      <Navbar isAdmin={false} />
      <div className={styles.right}>
        {tokenExists ? (
          <LogoutButton onLogout={checkToken} />
        ) : (
          <>
            <Link className={styles.btn} href="/login">
              Login
            </Link>
            {/* No need to check token here, this is handled by the state */}
            {/* <Link className={styles.btn} href="/register">
              Register
            </Link> */}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
