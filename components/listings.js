"use client"
import React from "react"

export default function Listings({ ads = [] }) {
  if (!ads.length) {
    return <div style={{color: 'blue', fontSize: '18px', padding: '30px', textAlign: 'center'}}>Одоогоор зар байхгүй байна.</div>
  }

  return (
    <section className="all-listings">
      <div className="container">
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
  )
}
