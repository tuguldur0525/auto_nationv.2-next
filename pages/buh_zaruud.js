import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import SearchBar from "../components/searchbar";
import Listings from "../components/listings";
import FilterSection from "../components/filterSection";
import Chatbot from "../components/Chatbot"; // Ensure Chatbot component is imported

export default function BuhZaruud() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchParams, setSearchParams] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Menu toggle functions
    const navLinks = document.getElementById("navLinks");
    if (navLinks) { // Added check to ensure navLinks exists
      window.showMenu = () => (navLinks.style.right = "0");
      window.hideMenu = () => (navLinks.style.right = "-200px");
    }
  }, []);

  // Load currentUser from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("currentUser");
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>AutoNation | Бүх зарууд</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
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

      <Listings location={selectedLocation} searchParams={searchParams} />

      <Chatbot /> {/* Added Chatbot */}
      <Footer />
    </>
  );
}