// app/buh_zaruud/page.js

import Head from 'next/head';
import { useEffect } from 'react';
import Footer from '../components/footer';
import Headers from '../components/header';
import SearchBar from '../components/searchbar';
import Listings from '../components/listings';
import FilterBar from '../components/filterbar';

export default function BuhZaruud() {
  useEffect(() => {
    const navLinks = document.getElementById("navLinks");
    window.showMenu = () => (navLinks.style.right = "0");
    window.hideMenu = () => (navLinks.style.right = "-200px");
  }, []);

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

      <Headers />    
      <SearchBar />
      <FilterBar />

      {/* Filter Section */}

      <section className="filter-section">
        <div className="container">
          <div className="filter-tabs">
            {["Бүгд", "Шинэ зарууд", "Хуучин автомашинууд", "Хибрид", "Цахилгаан", "SUV", "Седан"].map((label, i) => (
              <button key={i} className={`filter-tab ${i === 0 ? "active" : ""}`}>{label}</button>
            ))}
          </div>

          <div className="sort-options">
            <span>Эрэмбэлэх:</span>
            <select id="sortBy">
              <option value="newest">Шинээр нэмэгдсэн</option>
              <option value="price-low">Үнэ өсөхөөр</option>
              <option value="price-high">Үнэ буурахаар</option>
              <option value="mileage-low">Гүйлт бага</option>
              <option value="mileage-high">Гүйлт их</option>
            </select>
          </div>
        </div>
      </section>
      <Listings />
     

    <Footer />
    </>
  );
}