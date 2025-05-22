// pages/index.js
import { useEffect, useState } from "react"
import Head from "next/head"
import SearchBar from "../components/searchbar"
import Footer from "../components/footer"
import Listings from "../components/listings" // Correct import for Listings component
import LocationSelector from "../components/locationselector"
import Header from "../components/header" // Assuming you have a Header component

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState("")
  const [searchParams, setSearchParams] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Menu toggle functions
    const navLinks = document.getElementById("navLinks")
    window.showMenu = function () {
      navLinks.style.right = "0"
    }
    window.hideMenu = function () {
      navLinks.style.right = "-200px"
    }

    // Populate year dropdown (if 'yearDropdown' element exists)
    const yearDropdown = document.getElementById("yearDropdown")
    if (yearDropdown) {
      for (let i = new Date().getFullYear(); i >= 2000; i--) {
        let option = document.createElement("option")
        option.value = i
        option.textContent = i
        yearDropdown.appendChild(option)
      }
    }

    // "Зар нэмэх" (Add Listing) link authentication check
    // Ensure this link actually points to /sell not zar_nemeh.html
    const zarNemehLink = document.querySelector('a[href="/sell"]') // Changed to /sell
    if (zarNemehLink) {
      zarNemehLink.addEventListener("click", function (e) {
        const isAuthenticated = localStorage.getItem("isAuthenticated")
        if (!isAuthenticated) {
          e.preventDefault()
          alert("Та эхлээд бүртгүүлнэ үү.")
          window.location.href = "/login" // Changed to Next.js route
        }
      })
    }

    // Session timeout for isAuthenticated
    const interval = setInterval(() => {
      localStorage.removeItem("isAuthenticated")
    }, 1800000) // 30 minutes

    // Load currentUser from localStorage
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("currentUser")
      if (user) {
        setCurrentUser(JSON.parse(user))
      }
    }

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>AutoNation | Vehicle sales v.2</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/style.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>
      <section className="header">
        <nav>
          <a href="/">
            <img src="/images/Logo_AN.png" alt="Logo" />
          </a>
          <div className="nav-links" id="navLinks">
            <i className="fa fa-times" onClick={() => hideMenu()}></i>
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
              {currentUser ? (
                <li>
                  <a href="/profile" className="nevtreh-btn">
                    <i className="fa fa-user-circle"></i>{" "}
                    {currentUser.name || "Профайл"}
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
          <i className="fa fa-bars" onClick={() => showMenu()}></i>
        </nav>
      </section>
      <LocationSelector onLocationSelect={setSelectedLocation} />
      <SearchBar onSearch={setSearchParams} />
      {/* Listings component now handles its own data fetching based on props */}
      <Listings location={selectedLocation} searchParams={searchParams} />
      <Footer />
    </>
  )
}