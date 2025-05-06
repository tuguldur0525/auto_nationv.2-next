'use client'; 
import { useEffect } from 'react';

export default function Header() {
  useEffect(() => {
    const navLinks = document.getElementById("navLinks");

    window.showMenu = () => {
      if (navLinks) navLinks.style.right = "0";
    };

    window.hideMenu = () => {
      if (navLinks) navLinks.style.right = "-200px";
    };
  }, []);

  return (
    <section className="header1">
      <nav>
        <a href="/">
          <img src="/images/Logo_AN.png" alt="Logo" />
        </a>
        <div className="nav-links" id="navLinks">
          <i className="fa fa-times" onClick={() => window.hideMenu()}></i>
          <ul>
            <li><a href="/">Нүүр</a></li>
            <li><a href="/buh_zaruud">Бүх зарууд</a></li>
            <li><a href="/sell">Зар нэмэх</a></li>
            <li><a href="/login" className="nevtreh-btn">Нэвтрэх</a></li>
          </ul>
        </div>
        <i className="fa fa-bars" onClick={() => window.showMenu()}></i>
      </nav>
    </section>
  );
}