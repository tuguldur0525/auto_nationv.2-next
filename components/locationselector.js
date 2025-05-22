"use client"
import { useState } from "react"
export default function LocationSelector({ onLocationSelect }) {
  const [location, setLocation] = useState("")
  const handleChange = (e) => {
    setLocation(e.target.value)
  }
  const handleSelect = () => {
    onLocationSelect(location)
  }
  return (
    <div className="text-box">
      <h1>Автомашины хамгийн том зарын нэгдсэн сайт</h1>
      <p>
        Яг одоо худалдаалагдаж буй шинэ, хуучин автомашины найдвартай мэдээллийг
        21 аймаг, 9 дүүргээс хайх боломжтой.
      </p>
      <label
        className="location-label "
        htmlFor="country"
        style={{ marginRight: "10px" }}
      >
        Байршил сонгох:
      </label>
      <select id="country" value={location} onChange={handleChange}>
        <option value="">Байршил сонгох</option>
        <option value="Улаанбаатар">Улаанбаатар</option>
        <option value="Архангай">Архангай</option>
        <option value="Баян-Өлгий">Баян-Өлгий</option>
        <option value="Баянхонгор">Баянхонгор</option>
        <option value="Булган">Булган</option>
        <option value="Говь-Алтай">Говь-Алтай</option>
        <option value="Говьсүмбэр">Говьсүмбэр</option>
        <option value="Дархан">Дархан</option>
        <option value="Дорноговь">Дорноговь</option>
        <option value="Дорнод">Дорнод</option>
        <option value="Дундговь">Дундговь</option>
        <option value="Завхан">Завхан</option>
        <option value="Өвөрхангай">Өвөрхангай</option>
        <option value="Өмнөговь">Өмнөговь</option>
        <option value="Орхон">Орхон</option>
        <option value="Сүхбаатар">Сүхбаатар</option>
        <option value="Сэлэнгэ">Сэлэнгэ</option>
        <option value="Төв">Төв</option>
        <option value="Увс">Увс</option>
        <option value="Ховд">Ховд</option>
        <option value="Хэнтий">Хэнтий</option>
      </select>
      <button id="selectBtn" onClick={handleSelect}>
        Сонгох
      </button>
    </div>
  )
}
