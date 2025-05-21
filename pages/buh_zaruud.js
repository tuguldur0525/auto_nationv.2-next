import Head from "next/head"
import { useEffect, useState } from "react"
import Footer from "../components/footer"
import Header from "../components/header"
import SearchBar from "../components/searchbar"
import Listings from "../components/listings"
import FilterSection from "../components/filterSection"
import mongoose from "mongoose"

export default function BuhZaruud() {
  const [selectedLocation, setSelectedLocation] = useState("")
  const [searchParams, setSearchParams] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const navLinks = document.getElementById("navLinks")
    window.showMenu = () => (navLinks.style.right = "0")
    window.hideMenu = () => (navLinks.style.right = "-200px")
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("currentUser")
      if (user) {
        setCurrentUser(JSON.parse(user))
      }
    }
  }, [])

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => {
        setAds(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div>Уншиж байна...</div>

  console.log("ads", ads)

  return (
    <>
      <Head>
        <title>AutoNation | Бүх зарууд</title>
        <link rel="stylesheet" href="/buh_zaruud.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>

      <Header />
      <FilterSection />
      <SearchBar onSearch={setSearchParams} />

      <Listings ads={ads} />

      <Footer />
    </>
  )
}
