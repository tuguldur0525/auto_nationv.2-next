'use client';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from 'components/header';
import Footer from 'components/footer';

import '../../public/delgerengui.css';

export default function CarDetailPage() {
  const router = useRouter();
  const { id } = router.query; // Get the car ID from the URL query

  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Basic DOM manipulations from your original code
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

    // Fetch car data when the component mounts or `id` changes
    const fetchCarData = async () => {
      if (!id) return; // Don't fetch if id is not available yet

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/cars/${id}`); // Assuming your API route is /api/cars/[id]
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCarData(data);
      } catch (e) {
        console.error("Failed to fetch car data:", e);
        setError("Машины мэдээлэл татаж чадсангүй. Та дахин оролдоно уу."); // Error message in Mongolian
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [id]); // Re-run effect if the `id` changes

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
          <h2>Мэдээлэл ачаалж байна...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container" style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
          <h2>Уучлаарай, алдаа гарлаа: {error}</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!carData) {
    return (
      <>
        <Header />
        <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
          <h2>Машины мэдээлэл олдсонгүй.</h2>
        </div>
        <Footer />
      </>
    );
  }

  // Destructure carData for easier access
  const {
    brand,
    model,
    year,
    description,
    price,
    mileage,
    engineType,
    transmission,
    ownerName,
    ownerStatus,
    ownerPhone,
    vin, // Assuming you have VIN in your data
    code, // Assuming you have a code in your data
    importedYear,
    engineCapacity,
    steeringWheel,
    driveType,
    color,
    doorCount,
    seatCount,
    imageUrls // Array of Cloudinary image URLs
  } = carData;

  // Ensure imageUrls is an array, even if empty
  const images = imageUrls || [];
  const mainImage = images[0] || '/images/placeholder.jpg'; // Fallback for main image
  const thumbnailImages = images.slice(0, 7); // Display up to 7 thumbnails initially

  return (
    <>
      <Head>
        <title>AutoNation | {brand} {model}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <Header />

      <div className="back-btn">
        <a href="/">
          <i className="fa fa-angle-left"> Буцах</i>
        </a>
      </div>

      <div className="car-info">
        <h1>{brand} {model} {year}</h1>
        <p>{description}</p>
      </div>

      <div className="container">
        <div className="images">
          <div className="main-img">
            <img src={mainImage} alt={`${brand} ${model} main image`} />
          </div>

          <div className="thumbnails">
            <div className="thumb-container">
              {thumbnailImages.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  onClick={(e) => window.changeMainImage(e.target)}
                />
              ))}

              {images.length > 7 && ( // Show "+X more" button only if there are more than 7 images
                <div className="thumbnail-with-button">
                  <img src={images[7]} onClick={(e) => window.changeMainImage(e.target)} /> {/* Display the 8th image before the button */}
                  <button id="toggleThumbsBtn" onClick={() => window.toggleThumbnails()}>
                    +{images.length - 7} more
                  </button>
                </div>
              )}

              {/* Hidden thumbnails (start from the 8th image if exists) */}
              {images.slice(7).map((imgUrl, i) => (
                <img
                  key={`hidden-${i}`}
                  src={imgUrl}
                  className="hidden-thumb"
                  onClick={(e) => window.changeMainImage(e.target)}
                />
              ))}
            </div>
          </div>

          <div className="contact-card">
            <h3>Эзэмшигчтэй холбогдох</h3>
            <div className="user-info">
              <img src="/images/profilethumb.png" alt="profilethumb" /> {/* Replace with actual owner profile pic if available */}
              <div>
                <strong>{ownerName}</strong>
                <small><br />{ownerStatus}</small>
              </div>
            </div>
            <div className="details">
              <p><span className="price">Машины үнэ: {price}₮</span></p>
              <p>Явсан миль: {mileage}км</p>
              <p>Хөдөлгүүрийн төрөл: {engineType}</p>
              <p>Хурдны хайрцаг: {transmission}</p>
            </div>
            <a className="call-button" href={`tel:+976${ownerPhone}`}>
              Утасны дугаар<br />+976 {ownerPhone}
            </a>
          </div>
        </div>
      </div>

      <div className="car-details-section">
        <h2>Дэлгэрэнгүй мэдээлэл</h2>
        <div className="car-specs-grid">
          <div className="spec-item"><span>Үйлдвэрлэгч:</span> {brand}</div>
          <div className="spec-item"><span>Марк:</span> {model}</div>
          <div className="spec-item"><span>Төрөл:</span> SUV</div> {/* Assuming type is SUV for all cars, or fetch from DB */}
          <div className="spec-item"><span>Арлын дугаар:</span> {vin}</div>
          <div className="spec-item"><span>Код:</span> {code}</div>
          <div className="spec-item"><span>Үйлдвэрлэсэн он:</span> {year}</div>
          <div className="spec-item"><span>Орж ирсэн он:</span> {importedYear}</div>
          <div className="spec-item"><span>Явсан км:</span> {mileage} км</div>
          <div className="spec-item"><span>Шатахуун:</span> {engineType}</div>
          <div className="spec-item"><span>Хроп:</span> {transmission}</div>
          <div className="spec-item"><span>Моторын багтаамж /cc/:</span> {engineCapacity}</div>
          <div className="spec-item"><span>Жолооны хүрд:</span> {steeringWheel}</div>
          <div className="spec-item"><span>Хөтлөгч:</span> {driveType}</div>
          <div className="spec-item"><span>Өнгө:</span> {color}</div>
          <div className="spec-item"><span>Хаалганы тоо:</span> {doorCount}</div>
          <div className="spec-item"><span>Суудлын тоо:</span> {seatCount}</div>
        </div>
      </div>

      <Footer />
    </>
  );
}