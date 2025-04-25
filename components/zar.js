// components/Listings.js
export default function Listings() {
  return (
    <section className="all-listings">
      <div className="container">

        {/* ---------------- Шинэ зарууд ---------------- */}
        <div className="category-section">
          <h2 className="section-title">Шинэ зарууд</h2>
          <div className="listings-grid">

            {/* Зар #1 */}
            <div className="listing-card">
              <div className="listing-badge new">Шинэ</div>
              <img src="/images/prius60white.avif" alt="Toyota Prius 2020" />
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

            {/* Зар #2 */}
            <div className="listing-card">
              <div className="listing-badge new">Шинэ</div>
              <img src="/images/cybertruck.avif" alt="Tesla CyberTruck 2024" />
              <div className="listing-info">
                <h3>Tesla CyberTruck 2024</h3>
                <div className="listing-details">
                  <span><i className="fa fa-tachometer"></i> 0 км</span>
                  <span><i className="fa fa-bolt"></i> Цахилгаан</span>
                  <span><i className="fa fa-car"></i> SUV</span>
                </div>
                <div className="listing-price">320,000,000₮</div>
                <div className="listing-location">
                  <i className="fa fa-map-marker"></i> Улаанбаатар
                </div>
                <a href="#" className="view-details-btn">Дэлгэрэнгүй</a>
              </div>
            </div>

            {/* Зар #3 */}
            <div className="listing-card">
              <div className="listing-badge new">Шинэ</div>
              <img src="/images/patrolY62.png" alt="Nissan Patrol Y62 2024" />
              <div className="listing-info">
                <h3>Nissan Patrol Y62 2024</h3>
                <div className="listing-details">
                  <span><i className="fa fa-tachometer"></i> 0 км</span>
                  <span><i className="fa fa-bolt"></i> Хибрид</span>
                  <span><i className="fa fa-car"></i> SUV</span>
                </div>
                <div className="listing-price">400,000,000₮</div>
                <div className="listing-location">
                  <i className="fa fa-map-marker"></i> Улаанбаатар
                </div>
                <a href="#" className="view-details-btn">Дэлгэрэнгүй</a>
              </div>
            </div>

            {/* Илүү заруудыг энд нэмэж болно */}
          </div>
        </div>

        {/* ➕ Хуучин автомашин, SUV, Седан гэх мэт хэсгүүдийг хүсвэл үргэлжлүүлэн бичиж болно */}
      </div>
    </section>
  );
}