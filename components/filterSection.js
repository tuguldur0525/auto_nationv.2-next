"use client";

import React from "react";


const FilterSection = () => {
  const filterTabs = [
    "Бүгд",
    "Шинэ зарууд",
    "Хуучин автомашинууд",
    "Хибрид",
    "Цахилгаан",
    "SUV",
    "Седан",
  ];

  return (
    <section className="filter-section">
      <div className="container">
        <div className="filter-tabs">
          {filterTabs.map((label, i) => (
            <button
              key={i}
              className={`filter-tab ${i === 0 ? "active" : ""}`}
            >
              {label}
            </button>
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
  );
};

export default FilterSection;