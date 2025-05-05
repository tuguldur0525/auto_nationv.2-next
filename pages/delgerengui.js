// app/delgerengui/page.js
'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CarDetailPage() {
  useEffect(() => {
    const navLinks = document.getElementById("navLinks");
    window.showMenu = () => (navLinks.style.right = "0");
    window.hideMenu = () => (navLinks.style.right = "-200px");

    const changeMainImage = (img) => {
      const mainImg = document.querySelector(".main-img img");
      if (mainImg && img.src) {
        mainImg.src = img.src;
      }
    };
    window.changeMainImage = changeMainImage;

    const toggleBtn = document.getElementById("toggleThumbsBtn");
    const hiddenThumbs = document.querySelectorAll(".hidden-thumb");
    window.toggleThumbnails = () => {
      hiddenThumbs.forEach(img => img.classList.toggle("visible"));
    };
  }, []);

  return (
    <>
      <Header />
      <div className="back-btn">
        <a href="/">
          <i className="fa fa-angle-left"> Буцах</i>
        </a>
      </div>

      <div className="car-info">
        <h1>Toyota Harrier 2018</h1>
        <p>240G L PACKAGE LIMITED 4WD AT 2.4. Model Code, CBA-ACU35W-AWPGK(F).</p>
      </div>

      <div className="container">
        <div className="images">
          <div className="main-img">
            <img src="/images/HarrierBlack1.jpg" alt="harrier-main-image" />
          </div>

          <div className="thumbnails">
            <div className="thumb-container">
              <img src="/images/HarrierBlack1.jpg" onClick={(e) => window.changeMainImage(e.target)} />
              <img src="/images/HarrierBlack1.jpg" onClick={(e) => window.changeMainImage(e.target)} />
              <div className="thumbnail-with-button">
                <img src="/images/HarrierBlack1.jpg" onClick={(e) => window.changeMainImage(e.target)} />
                <button id="toggleThumbsBtn" onClick={() => window.toggleThumbnails()}>+7 more</button>
              </div>
              {/* Hidden thumbnails */}
              {[...Array(4)].map((_, i) => (
                <img
                  key={i}
                  src="/images/HarrierBlack1.jpg"
                  className="hidden-thumb"
                  onClick={(e) => window.changeMainImage(e.target)}
                />
              ))}
            </div>
          </div>

          <div className="contact-card">
            <h3>Эзэмшигчтэй холбогдох</h3>
            <div className="user-info">
              <img src="/images/profilethumb.png" alt="profilethumb" />
              <div>
                <strong>Дорж Бадмаа</strong>
                <small><br />Шинэ хэрэглэгч</small>
              </div>
            </div>
            <div className="details">
              <p><span className="price">Машины үнэ</span></p>
              <p>Явсан миль: 120,000км</p>
              <p>Хөдөлгүүрийн төрөл: Хайбрид</p>
              <p>Хурдны хайрцаг: Автомат</p>
            </div>
            <a className="call-button" href="tel:+97699009900">
              Утасны дугаар<br />+976 9900-9900
            </a>
          </div>
        </div>
      </div>

      <div className="car-details-section">
        <h2>Дэлгэрэнгүй мэдээлэл</h2>
        <div className="car-specs-grid">
          <div className="spec-item"><span>Үйлдвэрлэгч:</span> Toyota</div>
          <div className="spec-item"><span>Марк:</span> Harrier</div>
          <div className="spec-item"><span>Төрөл:</span> SUV</div>
          <div className="spec-item"><span>Арлын дугаар:</span> HWT-1234567</div>
          <div className="spec-item"><span>Код:</span> DM98765</div>
          <div className="spec-item"><span>Үйлдвэрлэсэн он:</span> 2015</div>
          <div className="spec-item"><span>Орж ирсэн он:</span> 2022</div>
          <div className="spec-item"><span>Явсан км:</span> 120,000 км</div>
          <div className="spec-item"><span>Шатахуун:</span> Hybrid</div>
          <div className="spec-item"><span>Хроп:</span> Автомат</div>
          <div className="spec-item"><span>Моторын багтаамж /cc/:</span> 3500</div>
          <div className="spec-item"><span>Жолооны хүрд:</span> Буруу</div>
          <div className="spec-item"><span>Хөтлөгч:</span> Урд</div>
          <div className="spec-item"><span>Өнгө:</span> Хар</div>
          <div className="spec-item"><span>Хаалганы тоо:</span> 5</div>
          <div className="spec-item"><span>Суудлын тоо:</span> 5</div>
        </div>
      </div>

      <Footer />
    </>
  );
}
    