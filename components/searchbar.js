//component/searchbar.js
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Reload хийхээс сэргийлнэ
    onSearch({ query, brand, manufacturer, year }); // 🔍 Эдгээр утгуудыг эцэг рүү дамжуулна
  };

  return (
    <section className="searchBar">
      <div className="mainSearch">
        <div className="searchTitle">
          <h2>Автомашин хайх</h2>
          <p>Хүссэн автомашинаа олохын тулд хайлт хийж эхлээрэй</p>
        </div>

        <div className="searchsection">
          <form id="form" onSubmit={handleSubmit}>
            <div className="search-fields">
              {/* Машины нэр хайх */}
              <div className="input-group">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  id="query"
                  name="q"
                  placeholder="Машины нэр, загвар..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* Брэнд */}
              <div className="input-group">
                <i className="fa fa-car"></i>
                <select
                  id="brand"
                  name="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">Брэнд сонгох</option>
                  <option value="Toyota">Toyota</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="Tesla">Tesla</option>
                </select>
              </div>

              {/* Үйлдвэрлэгч */}
              <div className="input-group">
                <i className="fa fa-industry"></i>
                <select
                  id="manufacturer"
                  name="manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                >
                  <option value="">Үйлдвэрлэгч сонгох</option>
                  <option value="Japan">Япон</option>
                  <option value="Germany">Герман</option>
                  <option value="USA">АНУ</option>
                  <option value="Korea">Солонгос</option>
                </select>
              </div>

              {/* Он */}
              <div className="input-group">
                <i className="fa fa-calendar"></i>
                <select
                  id="yearDropdown"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Он сонгох</option>
                  {Array.from({ length: 30 }, (_, i) => {
                    const y = 2025 - i;
                    return <option key={y} value={y}>{y}</option>;
                  })}
                </select>
              </div>
            </div>

            <button type="submit" className="search-btn">
              <i className="fa fa-search"></i> Хайх
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
