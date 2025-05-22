"use client";
import React, { useEffect, useState } from "react"; // Import useEffect and useState

export default function Listings({ location, searchParams }) { // Receives filtering props
  const [ads, setAds] = useState([]); // State to hold the fetched listings
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);

      // Build query string for the API call
      const queryParams = new URLSearchParams();
      queryParams.append("status", "approved"); // Always request approved listings for public display

      if (location) {
        queryParams.append("location", location);
      }
      if (searchParams && searchParams.title) { // Assuming searchParams has a title property
        queryParams.append("title", searchParams.title);
      }
      // Add other search parameters if your API supports them (e.g., minPrice, maxPrice, fuel, type)
      // Example: if (searchParams && searchParams.minPrice) queryParams.append("minPrice", searchParams.minPrice);

      try {
        // Fetch from the consolidated API endpoint /api/listings
        const res = await fetch(`/api/listings?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // Assuming the API returns { success: true, vehicles: [...] }
        setAds(data.vehicles || []);
      } catch (err) {
        console.error("Error fetching listings in Listings component:", err);
        setError("Зар оруулахад алдаа гарлаа. Дахин оролдоно уу."); // Error message in Mongolian
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [location, searchParams]); // Re-run effect when location or searchParams change

  if (loading) {
    return (
      <div style={{ color: 'blue', fontSize: '18px', padding: '30px', textAlign: 'center' }}>
        Зарнууд ачаалж байна...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', fontSize: '18px', padding: '30px', textAlign: 'center' }}>
        {error}
      </div>
    );
  }

  if (!ads.length) {
    return (
      <div style={{ color: 'blue', fontSize: '18px', padding: '30px', textAlign: 'center' }}>
        Одоогоор идэвхтэй зар байхгүй байна.
      </div>
    );
  }

  return (
    <section className="all-listings">
      <div className="container">
        {/* You might want to conditionalize this title or remove it for index.js if not suitable */}
        <h2 className="section-title">Бүх зарууд</h2>
        <div className="listings-scroll-wrapper">
          {ads.map((item) => (
            <div className="listing-card" key={item._id}>
              <img
                src={
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : "/images/no-image.png"
                }
                alt={item.title}
                style={{ width: 200, borderRadius: 8, marginBottom: 8 }}
              />
              <div className="listing-info">
                <h3>{item.title}</h3>
                <div className="listing-details">
                  <span>
                    <i className="fa fa-tachometer"></i> {item.km} км
                  </span>
                  <span>
                    <i className="fa fa-leaf"></i> {item.fuel}
                  </span>
                  <span>
                    <i className="fa fa-car"></i> {item.type}
                  </span>
                </div>
                <div className="listing-price">{item.price}₮</div>
                <div className="listing-location">
                  <i className="fa fa-map-marker"></i> {item.location}
                </div>
                <a
                  href={`/delgerengui/${item._id}`}
                  className="view-details-btn"
                >
                  Дэлгэрэнгүй
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}