// pages/buh_zaruud.js
import { useEffect } from "react";
import Head from "next/head";

export default function BuhZaruud() {
  useEffect(() => {
    const navLinks = document.getElementById("navLinks");
    window.showMenu = function () {
      navLinks.style.right = "0";
    };
    window.hideMenu = function () {
      navLinks.style.right = "-200px";
    };
  }, []);

  return (
    <>
      <Head>
        <title>AutoNation | Бүх зарууд</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/buh_zaruud.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
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
              <li><a href="/">Нүүр</a></li>
              <li><a href="/buh_zaruud">Бүх зарууд</a></li>
              <li><a href="/zar_nemeh">Зар нэмэх</a></li>
              <li><a href="/nevtreh" className="nevtreh-btn">Нэвтрэх</a></li>
            </ul>
          </div>
          <i className="fa fa-bars" onClick={() => showMenu()}></i>
        </nav>
      </section>

      {/* TODO: Filter buttons, listings, footer - JSX conversion will continue based on layout */}
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
        Энд бүх заруудыг JSX хэлбэрт бүрэн хөрвүүлж байрлуулна
      </h1>
    </>
  );
}
