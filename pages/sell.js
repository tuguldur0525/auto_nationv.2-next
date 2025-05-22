import Head from "next/head"
import { useState, useRef, useEffect } from "react"
import "../public/style.css"
import "../public/sell.css"
import Footer from "../components/footer"

export default function SellPage() {
  const [specs, setSpecs] = useState([{ key: "", value: "" }])
  const [images, setImages] = useState([])
  const [dragging, setDragging] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const fileInputRef = useRef()
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("currentUser")
      if (user) {
        setCurrentUser(JSON.parse(user))
      }
    }
  }, [])

  // Add drag-and-drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange({ target: { files: e.dataTransfer.files } })
    }
  }

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...specs]
    updatedSpecs[index][field] = value
    setSpecs(updatedSpecs)
  }

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }])
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Store files for FormData submission
    setImages((prev) => [...prev, ...files].slice(0, 10))
  }

  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index])
      return newImages.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    // Add images
    images.forEach((file) => {
      formData.append("images", file)
    })

    // Add other fields
    const specifications = {}
    specs.forEach(({ key, value }) => {
      if (key && value) specifications[key] = value
    })

    formData.append("title", e.target.title.value)
    formData.append("brand", e.target.brand.value)
    formData.append("model", e.target.model.value)
    formData.append("km", e.target.km.value)
    formData.append("fuel", e.target.fuel.value)
    formData.append("type", e.target.type.value)
    formData.append("price", e.target.price.value)
    formData.append("location", e.target.location.value)
    formData.append("modelYear", e.target.modelYear.value)
    formData.append("importYear", e.target.importYear.value)
    formData.append("description", e.target.description.value)
    formData.append("email", e.target.email.value)
    formData.append("phone", e.target.phone.value)
    formData.append("specifications", JSON.stringify(specifications))
    formData.append("owner", currentUser?._id)
    console.log("formData", formData)

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: "Unknown error" }
        }
        console.error("BACKEND ERROR:", errorData)
        throw new Error(errorData.error || "Submission failed")
      }

      alert("Таны зар амжилттай илгээгдлээ! Админ баталгаажуулахыг хүлээнэ үү.")
      window.location.href = "/"
    } catch (error) {
      console.error("BACKEND ERROR:", error)
      alert("Алдаа гарлаа! " + error.message)
    }
  }

  // Add menu toggle functions to prevent errors
  const showMenu = () => {
    document.getElementById("navLinks").style.right = "0"
  }

  const hideMenu = () => {
    document.getElementById("navLinks").style.right = "-200px"
  }

  // console.log("moder, brand, model", e.target.model.value, e.target.brand.value)

  return (
    <>
      <Head>
        <title>AutoNation | Зар нэмэх</title>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>

      <div className="header">
        <nav>
          <a href="/">
            <img src="/images/Logo_AN.png" alt="Logo" />
          </a>
          <div className="nav-links" id="navLinks">
            <i className="fa fa-times" onClick={hideMenu}></i>
            <ul>
              <li>
                <a href="/">Нүүр</a>
              </li>
              <li>
                <a href="/buh_zaruud">Бүх зарууд</a>
              </li>
              <li>
                <a href="/sell">Зар нэмэх</a>
              </li>
              {currentUser ? (
                <li>
                  <a href="/profile" className="nevtreh-btn">
                    <i className="fa fa-user-circle"></i>{" "}
                    {currentUser.name || "Профайл"}
                  </a>
                </li>
              ) : (
                <li>
                  <a href="/login" className="nevtreh-btn">
                    Нэвтрэх
                  </a>
                </li>
              )}
            </ul>
          </div>
          <i className="fa fa-bars" onClick={showMenu}></i>
        </nav>
        <div className="guide-overlay">
          <div className="guide-container">
            <h2>Зар нэмэх 3 Алхам</h2>
            <div className="guide-steps">
              <div className="step-card">
                <div className="step-icon">
                  <i className="fa fa-camera"></i>
                </div>
                <h3>1. Зураг оруулна</h3>
                <p>Машиныхаа тод зурагуудыг оруулна</p>
              </div>

              <div className="step-card">
                <div className="step-icon">
                  <i className="fa fa-info-circle"></i>
                </div>
                <h3>2. Мэдээлэл бөглөнө</h3>
                <p>Бүх шаардлагатай мэдээллийг бөглөнө</p>
              </div>

              <div className="step-card">
                <div className="step-icon">
                  <i className="fa fa-check"></i>
                </div>
                <h3>3. Зар нийтэлнэ</h3>
                <p>Зарыг шалгаад нийтлэгдэнэ</p>
              </div>
            </div>
            <i class="fa fa-angle-down fa-4x" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div className="sell-container">
        <div className="form-header">
          <h1>Машинаа хурдан зар</h1>
          <p>Машины мэдээллээ доор оруул</p>
        </div>

        <form className="advanced-form" onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-col">
              <div className="image-upload">
                <div
                  className={`drop-zone ${dragging ? "dragover" : ""}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <i className="fa fa-cloud-upload-alt"></i>
                  <p>Зурагаа энд авчирч тавь эсвэл</p>
                  <button type="button" className="browse-btn">
                    Файлаас Сонгох
                  </button>
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
                  {images.map((file, index) => (
                    <div key={index} className="preview-image-container">
                      <img
                        src={URL.createObjectURL(file)}
                        className="preview-image"
                        alt={`preview-${index}`}
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-col">
              <div className="form-group">
                <label htmlFor="title">Машины загвар</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Жишээ нь: Toyota Prius"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fuel">Түлшний төрөл</label>
                <select id="fuel" name="fuel" required>
                  <option value="">Сонгох</option>
                  <option value="Хибрид">Хибрид</option>
                  <option value="Бензин">Бензин</option>
                  <option value="Дизель">Дизель</option>
                  <option value="Цахилгаан">Цахилгаан</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="brand">Брэнд</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  id="brand"
                  name="brand"
                  required
                  placeholder="Жишээ нь: Toyota"
                />
              </div>
              <div className="form-group">
                <label htmlFor="model">Загвар</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  id="model"
                  name="model"
                  required
                  placeholder="Жишээ нь: Prius"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Машины төрөл</label>
                <select id="type" name="type" required>
                  <option value="">Сонгох</option>
                  <option value="Седан">Седан</option>
                  <option value="SUV">SUV</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Хэтчбек">Хэтчбек</option>
                  <option value="Пикап">Пикап</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Байршил</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  defaultValue="Улаанбаатар"
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
                  <label htmlFor="km">Явсан Миль (km)</label>
                  <input type="number" id="km" name="km" required min="0" />
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
                        onChange={(e) =>
                          handleSpecChange(index, "key", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Утга"
                        value={spec.value}
                        onChange={(e) =>
                          handleSpecChange(index, "value", e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="add-spec-btn"
                  onClick={addSpec}
                >
                  <i className="fa fa-plus"></i> Үзүүлэлт Нэмэх
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
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Утас</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="99008800"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="publish-btn">
              <i className="fa fa-rocket"></i> ЗАР НИЙТЛЭХ
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}
