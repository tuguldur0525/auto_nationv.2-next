import { useState, useRef } from 'react';
import '../public/style.css';
import '../public/sell.css';
import Footer from "../components/footer";
import Header from '../components/header';

export default function SellPage() {
    const [specs, setSpecs] = useState([{ key: '', value: '' }]);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef();

    const handleSpecChange = (index, field, value) => {
        const updatedSpecs = [...specs];
        updatedSpecs[index][field] = value;
        setSpecs(updatedSpecs);
    };

    const addSpec = () => {
        setSpecs([...specs, { key: '', value: '' }]);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });
        Promise.all(readers).then(results => setImages(results));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const specifications = {};
        specs.forEach(({ key, value }) => {
            if (key && value) specifications[key] = value;
        });

        const newCar = {
            name: e.target.carModel.value,
            price: e.target.price.value,
            image: images[0] || 'default-car.jpg',
            specs: Object.entries(specifications).map(([key, value]) => `${key}: ${value}`),
            contact: `${e.target.sellerEmail.value} | ${e.target.sellerPhone.value}`,
            details: {
                modelYear: e.target.modelYear.value,
                importYear: e.target.importYear.value,
                mileage: e.target.mileage.value,
                description: e.target.description.value
            }
        };

        const storedCars = JSON.parse(localStorage.getItem('cars')) || [];
        storedCars.push(newCar);
        localStorage.setItem('cars', JSON.stringify(storedCars));
        window.location.href = '/';
    };

    return (
        <>
        <div className="sell-container">
            <div className="form-header">
                <h1>Машинаа Хурдан Зар</h1>
                <p>Машины мэдээллээ доор оруул</p>
            </div>

            <form className="advanced-form" onSubmit={handleSubmit}>
                <div className="form-columns">
                    <div className="form-col">
                        <div className="image-upload">
                            <div className="drop-zone" onClick={() => fileInputRef.current.click()}>
                                <i className="fas fa-cloud-upload-alt"></i>
                                <p>Зурагаа Энд Авчирч Тавь</p>
                                <span>эсвэл</span>
                                <button type="button" className="browse-btn">Файлаас Сонгох</button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    multiple
                                    accept="image/*"
                                    hidden
                                />
                            </div>
                            <div className="image-preview">
                                {images.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        className="preview-image"
                                        alt={`preview-${index}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-col">
                        <div className="form-group">
                            <label htmlFor="carModel">Машины загвар</label>
                            <input
                                type="text"
                                id="carModel"
                                name="carModel"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="modelYear">Үйлдвэрлэгдсэн Он</label>
                                <input
                                    type="number"
                                    id="modelYear"
                                    name="modelYear"
                                    min="1900"
                                    max="2024"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="importYear">Орж Ирсэн Он</label>
                                <input
                                    type="number"
                                    id="importYear"
                                    name="importYear"
                                    min="1900"
                                    max="2024"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="mileage">Явсан Миль(km)</label>
                                <input
                                    type="number"
                                    id="mileage"
                                    name="mileage"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Үнэ(₮)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    required
                                />
                            </div>
                        </div>

                        <div className="specs-editor">
                            <h4>Машины Үзүүлэлт</h4>
                            <div className="specs-list">
                                {specs.map((spec, index) => (
                                    <div key={index} className="spec-item">
                                        <input
                                            type="text"
                                            placeholder="Үзүүлэлт"
                                            value={spec.key}
                                            onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Утга"
                                            value={spec.value}
                                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="add-spec-btn"
                                onClick={addSpec}
                            >
                                <i className="fas fa-plus"></i> Үзүүлэлт Нэмэх
                            </button>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Нэмэлт Мэдээлэл</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                    ></textarea>
                </div>

                <div className="seller-info">
                    <h4>Холбогдох Мэдээлэл</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="sellerEmail">Email</label>
                            <input
                                type="email"
                                id="sellerEmail"
                                name="sellerEmail"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sellerPhone">Утас</label>
                            <input
                                type="tel"
                                id="sellerPhone"
                                name="sellerPhone"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="publish-btn">
                        <i className="fas fa-rocket"></i> ЗАР НИЙТЛЭХ
                    </button>
                </div>
            </form>
        </div>
        {<Footer/>}

    </>
    );
    
}