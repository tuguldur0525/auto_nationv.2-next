// pages/index.js
import { useEffect } from "react";
import Head from "next/head";

import SearchBar from "../components/searchbar";
import Footer from "../components/footer";
import Listings from "../components/zar";
export default function Home() {
  useEffect(() => {
    const navLinks = document.getElementById("navLinks");
    window.showMenu = function () {
      navLinks.style.right = "0";
    };
    window.hideMenu = function () {
      navLinks.style.right = "-200px";
    };

    const yearDropdown = document.getElementById("yearDropdown");
    if (yearDropdown) {
      for (let i = new Date().getFullYear(); i >= 2000; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearDropdown.appendChild(option);
      }
    }

    const zarNemehLink = document.querySelector('a[href="zar_nemeh.html"]');
    if (zarNemehLink) {
      zarNemehLink.addEventListener("click", function (e) {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!isAuthenticated) {
          e.preventDefault();
          alert("Та эхлээд бүртгүүлнэ үү.");
          window.location.href = "nevtreh.html";
        }
      });
    }

    const interval = setInterval(() => {
      localStorage.removeItem("isAuthenticated");
    }, 1800000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>AutoNation | Vehicle sales v.2</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/style.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>

      <section className="header">
        <nav>
          <a href="/">
            <img src="/images/Logo_AN.png" alt="Logo" />
          </a>
          <div className="nav-links" id="navLinks">
            <i className="fa fa-times" onClick={() => hideMenu()}></i>
            <ul>
              <li>
                <a href="/">Нүүр</a>
              </li>
              <li>
                <a href="/buh_zaruud">Бүх зарууд</a>
              </li>
              <li>
                <a href="/zar_nemeh">Зар нэмэх</a>
              </li>
              <li>
                <a href="/nevtreh" className="nevtreh-btn">
                  Нэвтрэх
                </a>
              </li>
            </ul>
          </div>
          <i className="fa fa-bars" onClick={() => showMenu()}></i>
        </nav>

        <div className="text-box">
          <h1>Автомашины хамгийн том зарын нэгдсэн сайт</h1>
          <p>
            Яг одоо худалдаалагдаж буй шинэ, хуучин автомашины найдвартай
            мэдээллийг 21 аймаг, 9 дүүргээс хайх боломжтой.
          </p>
          <label htmlFor="country">Байршил сонгох:</label>
          <select id="country">
            <option value="ub">Улаанбаатар</option>
            <option value="ara">Архангай</option>
            <option value="bao">Баян-Өлгий</option>
            <option value="bah">Баянхонгор</option>
            <option value="bul">Булган</option>
            <option value="goa">Говь-Алтай</option>
            <option value="gos">Говьсүмбэр</option>
            <option value="dau">Дархан-уул</option>
            <option value="dor">Дорноговь</option>
            <option value="dod">Дорнод</option>
            <option value="dud">Дундговь</option>
            <option value="zav">Завхан</option>
            <option value="uvu">Өвөрхангай</option>
            <option value="umn">Өмнөговь</option>
            <option value="orh">Орхон</option>
            <option value="suh">Сүхбаатар</option>
            <option value="sel">Сэлэнгэ</option>
            <option value="tuv">Төв</option>
            <option value="uvs">Увс</option>
            <option value="hov">Ховд</option>
            <option value="hen">Хэнтий</option>
          </select>
          <button id="selectBtn">Сонгох</button>
          <p id="selectedCountry"></p>
        </div>
      </section>

      {<SearchBar /> }
      {<Footer/>}
    
    </>
  );
  }
