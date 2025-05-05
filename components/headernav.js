"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./Header.css"; // Optional: CSS styling

const Header = () => {
  const [navVisible, setNavVisible] = useState(false);

  const showMenu = () => setNavVisible(true);
  const hideMenu = () => setNavVisible(false);

  return (
    <nav className="header-nav">
      <Link href="/">
        <img src="/images/Logo_AN.png" alt="Logo" className="logo" />
      </Link>

      <div className={`nav-links ${navVisible ? "active" : ""}`} id="navLinks">
        <i className="fa fa-times" onClick={hideMenu}></i>
        <ul>
          <li>
            <Link href="/">Нүүр</Link>
          </li>
          <li>
            <Link href="/buh_zaruud">Бүх зарууд</Link>
          </li>
          <li>
            <Link href="/sell">Зар нэмэх</Link>
          </li>
          <li>
            <Link href="/login" className="nevtreh-btn">
              Нэвтрэх
            </Link>
          </li>
        </ul>
      </div>

      <i className="fa fa-bars" onClick={showMenu}></i>
    </nav>
  );
};

export default Header;