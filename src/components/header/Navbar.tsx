"use client";
import Link from "next/link";
import styles from './header.module.css';
import { GrTechnology } from "react-icons/gr";
import { useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import useSWR from 'swr'; // استخدام SWR لجلب البيانات
import Script from 'next/script'; // لتحميل السكربتات

interface NavbarProps {
    isAdmin: boolean;
}

const fetcher = (url: string) => fetch(url).then(res => res.json()); // دالة لجلب البيانات

const Navbar = ({ isAdmin }: NavbarProps) => {
    const [toggle, setToggle] = useState(false);
    const [tokenExists, setTokenExists] = useState(false);

    const handleLinkClick = () => {
        setToggle(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setTokenExists(!!token);
    }, []);

    // مثال على جلب بيانات المستخدمين باستخدام SWR
    const { data, error } = useSWR('/api/users', fetcher);

    return (
        <>
            <Script
                src="https://example.com/script.js"
                strategy="lazyOnload" // تحميل السكربت بشكل متأخر
            />
            <nav className={styles.navbar}>
                <div>
                    <Link href="/" className={styles.logo}>
                        {/* <img src="/logo.png" className="h-12 w-auto" alt="Your Logo" /> */}
                    </Link>
                    <div className={styles.menu}>
                        {toggle ? (
                            <IoMdClose onClick={() => setToggle(prev => !prev)} />
                        ) : (
                            <AiOutlineMenu onClick={() => setToggle(prev => !prev)} />
                        )}
                    </div>
                </div>

                {tokenExists && (
                    <div
                        className={styles.navLinksWrapper}
                        style={{
                            clipPath: toggle ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : ""
                        }}
                    >
                        <ul className={styles.navLinks}>
                            <Link onClick={handleLinkClick} className={styles.navLink} href="/">Home</Link>
                            <Link onClick={handleLinkClick} className={styles.navLink} href="/task">Tasks</Link>
                            <Link onClick={handleLinkClick} className={styles.navLink} href="/doctors">Doctors</Link>
                            <Link onClick={handleLinkClick} className={styles.navLink} href="/user">Clients</Link>
                            <Link onClick={handleLinkClick} className={styles.navLink} href="/chart">Charts</Link>
                            <Link onClick={handleLinkClick} className={styles.navLink} href="/taskArchive">Send to Archive</Link>
                        </ul>
                    </div>
                )}
            </nav>
        </>
    );
}

export default Navbar;
