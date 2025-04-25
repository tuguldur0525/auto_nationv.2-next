// components/SearchBar.js
export default function SearchBar() {
    return (
      <section className="searchBar">
        <div className="mainSearch">
          <div className="searchTitle">
            <h2>Автомашин хайх</h2>
            <p>Хүссэн автомашинаа олохын тулд хайлт хийж эхлээрэй</p>
          </div>
  
          <div className="searchsection">
            <form id="form">
              <div className="search-fields">
                {/* Машины нэр хайх */}
                <div className="input-group">
                  <i className="fa fa-search"></i>
                  <input
                    type="text"
                    id="query"
                    name="q"
                    placeholder="Машины нэр, загвар..."
                  />
                </div>
  
                {/* Брэнд */}
                <div className="input-group">
                  <i className="fa fa-car"></i>
                  <select id="brand" name="brand">
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
                  <select id="manufacturer" name="manufacturer">
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
                  <select id="yearDropdown">
                    <option value="" disabled selected>
                      Он сонгох
                    </option>
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