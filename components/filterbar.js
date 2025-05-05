// components/FilterBar.js

export default function FilterBar({ selectedFilter, onFilterChange, sortBy, onSortChange }) {
    const filters = ["Бүгд", "Шинэ зарууд", "Хуучин автомашинууд", "Хибрид", "Цахилгаан", "SUV", "Седан"];
    const sortOptions = [
      { label: "Шинээр нэмэгдсэн", value: "newest" },
      { label: "Үнэ өсөхөөр", value: "price-low" },
      { label: "Үнэ буурахаар", value: "price-high" },
      { label: "Гүйлт бага", value: "mileage-low" },
      { label: "Гүйлт их", value: "mileage-high" },
    ];
  
    return (
      <section className="filter-section">
        <div className="container">
          <div className="filter-tabs">
            {filters.map((label, i) => (
              <button
                key={i}
                className={`filter-tab ${selectedFilter === label ? "active" : ""}`}
                onClick={() => onFilterChange(label)}
              >
                {label}
              </button>
            ))}
          </div>
  
          <div className="sort-options">
            <span>Эрэмбэлэх:</span>
            <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    );
  }
  