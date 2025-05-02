import { useState, useRef } from 'react';
import '../public/style.css';
import '../public/sell.css';
import Footer from "../components/footer";
import Header from '../components/header';

export default function SellPage() {
    const [specs, setSpecs] = useState([{ key: '', value: '' }]);
    const [images, setImages] = useState([]);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef();

    const handleSpecChange = (index, field, value) => {
        const updatedSpecs = [...specs];
        updatedSpecs[index][field] = value;
        setSpecs(updatedSpecs);
    };

    const addSpec = () => {
        setSpecs([...specs, { key: '', value: '' }]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        
        const readers = files.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });
        
        Promise.all(readers).then(results => {
            setImages(prev => [...prev, ...results].slice(0, 10));
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
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
            images: images,
            specs: Object.entries(specifications).map(([key, value]) => `${key}: ${value}`),
            contact: {
                email: e.target.sellerEmail.value,
                phone: e.target.sellerPhone.value
            },
            details: {
                modelYear: e.target.modelYear.value,
                importYear: e.target.importYear.value,
                mileage: e.target.mileage.value,
                description: e.target.description.value
            },
            date: new Date().toISOString()
        };

        const storedCars = JSON.parse(localStorage.getItem('cars')) || [];
        storedCars.push(newCar);
        localStorage.setItem('cars', JSON.stringify(storedCars));
        
        alert('Таны зар амжилттай илгээгдлээ!');
        window.location.href = '/';
    };

    return (
        <>
            <div className="header">
                <div className="guide-overlay">
                    <div className="guide-container">
                        <h2>Зар нэмэх 3 Алхам</h2>
                        <div className="guide-steps">
                            <div className="step-card">
                                <div className="step-icon">
                                    <i className="fas fa-camera"></i>
                                </div>
                                <h3>1. Зураг оруулна</h3>
                                <p>Машиныхаа тод зурагуудыг оруулна</p>
                            </div>

                            <div className="step-card">
                                <div className="step-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <h3>2. Мэдээлэл бөглөнө</h3>
                                <p>Бүх шаардлагатай мэдээллийг бөглөнө</p>
                            </div>

                            <div className="step-card">
                                <div className="step-icon">
                                    <i className="fas fa-check"></i>
                                </div>
                                <h3>3. Зар нийтэлнэ</h3>
                                <p>Зарыг шалгаад нийтлэгдэнэ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sell-container">
                <div className="form-header">
                    <h1>Машинаа Хурдан Зар</h1>
                    <p>Машины мэдээллээ доор оруул</p>
                </div>

                <form className="advanced-form" onSubmit={handleSubmit}>
                    <div className="form-columns">
                        <div className="form-col">
                            <div className="image-upload">
                                <div 
                                    className={`drop-zone ${dragging ? 'dragover' : ''}`}
                                    onClick={() => fileInputRef.current.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
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
                                        <div key={index} className="preview-image-container">
                                            <img
                                                src={src}
                                                className="preview-image"
                                                alt={`preview-${index}`}
                                            />
                                            <button 
                                                type="button" 
                                                className="remove-image-btn"
                                                onClick={() => removeImage(index)}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
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
                                    placeholder="Жишээ нь: Toyota Prius"
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
                                        max={new Date().getFullYear()}
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
                                        max={new Date().getFullYear()}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="mileage">Явсан Миль (km)</label>
                                    <input
                                        type="number"
                                        id="mileage"
                                        name="mileage"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Үнэ (₮)</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        required
                                        min="0"
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
                            placeholder="Машины нэмэлт мэдээлэл, гэмтэл, дутуу дулимаг, онцлог шинж чанаруудыг дэлгэрэнгүй бичнэ үү"
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
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sellerPhone">Утас</label>
                                <input
                                    type="tel"
                                    id="sellerPhone"
                                    name="sellerPhone"
                                    required
                                    placeholder="99008800"
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
            <Footer />
        </>
    );
}