"use client"
import { useEffect, useState } from "react"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const navLinks = document.getElementById("navLinks")

    window.showMenu = () => {
      if (navLinks) navLinks.style.right = "0"
    }

    window.hideMenu = () => {
      if (navLinks) navLinks.style.right = "-200px"
    }

    // Check login state
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("currentUser"))
      // Listen for login/logout changes from other tabs
      const handleStorage = () =>
        setIsLoggedIn(!!localStorage.getItem("currentUser"))
      window.addEventListener("storage", handleStorage)
      return () => window.removeEventListener("storage", handleStorage)
    }
  }, [])

  return (
    <section className="header1">
      <nav>
        <a href="/">
          <img src="/images/Logo_AN.png" alt="Logo" />
        </a>
        <div className="nav-links" id="navLinks">
          <i className="fa fa-times" onClick={() => window.hideMenu()}></i>
          <ul>
            <li>
              <a href="/">Нүүр</a>
            </li>
            <li>
              <a href="/buh_zaruud">Бүх зарууд</a>
            </li>
            <li>
              <a href="/sell">Зар нэмэх</a>
            </li>
            {isLoggedIn ? (
              <li>
                <a href="/profile" className="user-icon" title="Профайл">
                  <i className="fa fa-user"></i>
                </a>
              </li>
            ) : (
              <li>
                <a href="/login" className="nevtreh-btn">
                  Нэвтрэх
                </a>
              </li>
            )}
          </ul>
        </div>
        <i className="fa fa-bars" onClick={() => window.showMenu()}></i>
      </nav>
    </section>
  )
}
