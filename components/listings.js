"use client";
import { useEffect, useState } from "react";

export default function Listings({ location }) {
  const [listings, setListings] = useState([]);
  const [electricCars, setElectricCars] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          `/api/listings${location ? `?location=${encodeURIComponent(location)}` : ""}`
        );
        const data = await res.json();
        setListings(data.newCars);
        setElectricCars(data.electricCars);
      } catch (err) {
        console.error("Алдаа:", err);
      }
    };

    fetchListings();
  }, [location]); // ✅ Run again whenever location changes

  return (
    <section className="all-listings">
      <div className="container">
        <div className="category-section">
          <h2 className="section-title">Шинэ зарууд</h2>
          <div className="listings-scroll-wrapper">
            {listings.map((item, index) => (
              <div className="listing-card" key={index}>
                <div className="listing-badge new">Шинэ</div>
                <img src={item.image} alt={item.title} />
                <div className="listing-info">
                  <h3>{item.title}</h3>
                  <div className="listing-details">
                    <span><i className="fa fa-tachometer"></i> {item.km} км</span>
                    <span><i className="fa fa-leaf"></i> {item.fuel}</span>
                    <span><i className="fa fa-car"></i> {item.type}</span>
                  </div>
                  <div className="listing-price">{item.price}</div>
                  <div className="listing-location">
                    <i className="fa fa-map-marker"></i> {item.location}
                  </div>
                  <a href="/delgerengui" className="view-details-btn">Дэлгэрэнгүй</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="category-section">
          <h2 className="section-title">Цахилгаан</h2>
          <div className="listings-scroll-wrapper">
            {electricCars.map((item, index) => (
              <div className="listing-card" key={index}>
                <div className="listing-badge electric">Цахилгаан</div>
                <img src={item.image} alt={item.title} />
                <div className="listing-info">
                  <h3>{item.title}</h3>
                  <div className="listing-details">
                    <span><i className="fa fa-tachometer"></i> {item.km} км</span>
                    <span><i className="fa fa-leaf"></i> {item.fuel}</span>
                    <span><i className="fa fa-car"></i> {item.type}</span>
                  </div>
                  <div className="listing-price">{item.price}</div>
                  <div className="listing-location">
                    <i className="fa fa-map-marker"></i> {item.location}
                  </div>
                  <a href="/delgerengui" className="view-details-btn">Дэлгэрэнгүй</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
