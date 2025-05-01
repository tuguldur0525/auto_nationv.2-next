// app/buh_zaruud/page.js

import Head from 'next/head';
import { useEffect } from 'react';
import Footer from '../components/footer';
import Headers from '../components/header';
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

      {/* Listings section placeholder */}
      <section className="all-listings">
        <div className="container">
          <h2 className="section-title">Шинэ зарууд</h2>
          <div className="listings-grid">
            <div className="listing-card">
              <div className="listing-badge new">Шинэ</div>
              <img src="/images/prius60white.avif" alt="Prius" />
              <div className="listing-info">
                <h3>Toyota Prius 2020</h3>
                <div className="listing-details">
                  <span><i className="fa fa-tachometer"></i> 0 км</span>
                  <span><i className="fa fa-leaf"></i> Хибрид</span>
                  <span><i className="fa fa-car"></i> Седан</span>
                </div>
                <div className="listing-price">125,000,000₮</div>
                <div className="listing-location">
                  <i className="fa fa-map-marker"></i> Улаанбаатар
                </div>
                <a href="#" className="view-details-btn">Дэлгэрэнгүй</a>
              </div>
            </div>
            {/* Add more static or fetched listings here */}
          </div>
        </div>
      </section>

    
    <Footer />
    </>
  );
}
