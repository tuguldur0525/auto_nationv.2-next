"use client";
import { useEffect, useState } from "react";

export default function Listings({ location, searchParams }) {
  const [listings, setListings] = useState([]);
  const [electricCars, setElectricCars] = useState([]);
  const [SUVCars, setSUVCars] = useState([]);


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const params = new URLSearchParams();

        // Байршил нэмэх (хамгийн гол)
        if (location) params.append("location", location);

        // Хайлтын нөхцөлүүд нэмэх
        if (searchParams?.query) params.append("query", searchParams.query);
        if (searchParams?.brand) params.append("brand", searchParams.brand);
        if (searchParams?.manufacturer) params.append("manufacturer", searchParams.manufacturer);
        if (searchParams?.year) params.append("year", searchParams.year);

        const res = await fetch(`/api/listings?${params.toString()}`);
        const data = await res.json();
        setListings(data.newCars);
        setElectricCars(data.electricCars);
        setSUVCars(data.SUVCars);
      } catch (err) {
        console.error("Алдаа:", err);
      }
    };

    fetchListings();
  }, [location, searchParams]);

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

        <div className="category-section">
          <h2 className="section-title">SUV</h2>
          <div className="listings-scroll-wrapper">
            {SUVCars.map((item, index) => (
              <div className="listing-card" key={index}>
              
                <div className="listing-badge SUV">SUV</div>
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
