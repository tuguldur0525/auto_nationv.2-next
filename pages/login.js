import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import "../public/style.css";
import "../public/login.css";
import Footer from "components/footer";

export default function SignPage() {
  const [activeForm, setActiveForm] = useState("login");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // This effect runs only once when the component mounts on the client-side
    // to check for an existing user in localStorage.
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("currentUser");
      if (user) {
        try {
          setCurrentUser(JSON.parse(user));
        } catch (e) {
          console.error("Failed to parse currentUser from localStorage", e);
          localStorage.removeItem("currentUser"); // Clear invalid data
        }
      }
    }
  }, []);

  const showForm = (formType) => {
    setActiveForm(formType);
    setErrors({}); // Clear errors when switching forms
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateSignup = (formData) => {
    const newErrors = {};
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!name || name.trim() === "") {
      newErrors.name = "Нэрээ оруулна уу";
    }
    if (!email || email.trim() === "") {
      newErrors.email = "Имэйл хаяг оруулна уу";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Хүчинтэй имэйл оруулна уу";
    }
    if (!phone || phone.trim() === "") {
      newErrors.phone = "Утасны дугаар оруулна уу";
    } else if (!/^\d{8}$/.test(phone)) {
      newErrors.phone = "8 оронтой тоо оруулна уу";
    }
    if (!password || password.trim() === "") {
      newErrors.password = "Нууц үг оруулна уу";
    } else if (password.length < 6) {
      newErrors.password = "Нууц үг хамгийн багадаа 6 тэмдэгтээс тогтоно";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Нууц үг таарахгүй байна";
    }
    return newErrors;
  };

  const validateLogin = (formData) => {
    const newErrors = {};
    const emailPhone = formData.get("emailPhone");
    const password = formData.get("password");

    if (!emailPhone || emailPhone.trim() === "") {
      newErrors.emailPhone = "Имэйл эсвэл утасны дугаар оруулна уу";
    }
    if (!password || password.trim() === "") {
      newErrors.password = "Нууц үг оруулна уу";
    }
    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    const formData = new FormData(e.target);
    const validationErrors = validateSignup(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Step 1: Register the user
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          password: formData.get("password"),
          role: "user", // Default role for new signups
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        // Handle registration specific errors
        if (registerData.message === "User already exists") {
          setErrors({ general: "Энэ имэйл эсвэл утасны дугаар бүртгэлтэй байна. Нэвтэрнэ үү." });
        } else {
          setErrors({ general: registerData.message || "Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу." });
        }
        setLoading(false);
        return; // Stop execution if registration fails
      }

      // Step 2: Automatically log in the user after successful registration
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailPhone: formData.get("email"), // Use email for login after signup
          password: formData.get("password"),
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        // This case should ideally not happen if registration was successful
        // and credentials are correct, but good to handle defensively.
        setErrors({ general: loginData.message || "Бүртгэл амжилттай болсон ч нэвтрэхэд алдаа гарлаа. Та одоо нэвтэрч ороно уу." });
        setLoading(false);
        // Optionally, redirect to login page here if auto-login fails
        // showForm("login");
        return;
      }

      // Step 3: Store user data in localStorage and redirect
      localStorage.setItem("currentUser", JSON.stringify(loginData.data));
      setCurrentUser(loginData.data); // Update state

      // Redirect based on user role (if your backend returns it)
      switch (loginData.data.role) {
        case "admin":
          window.location.href = "/admin";
          break;
        case "dealer":
          window.location.href = "/profile"; // Or a specific dealer profile page
          break;
        default:
          window.location.href = "/profile"; // Default for 'user' role
      }

    } catch (error) {
      console.error("Signup/Login Error:", error);
      setErrors({ general: "Сүлжээний алдаа гарлаа. Та интернэт холболтоо шалгана уу." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    const formData = new FormData(e.target);
    const validationErrors = validateLogin(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailPhone: formData.get("emailPhone"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific login errors from the backend
        if (response.status === 401) { // Unauthorized (e.g., wrong password)
          setErrors({ general: "Имэйл/утасны дугаар эсвэл нууц үг буруу байна." });
        } else if (response.status === 404) { // Not Found (e.g., user doesn't exist)
          setErrors({ general: "Бүртгэлгүй хэрэглэгч байна. Бүртгүүлнэ үү." });
        } else {
          setErrors({ general: data.message || "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу." });
        }
        setLoading(false);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem("currentUser", JSON.stringify(data.data));
      setCurrentUser(data.data); // Update state

      // Redirect based on user role
      switch (data.data.role) {
        case "admin":
          window.location.href = "/admin";
          break;
        case "dealer":
          window.location.href = "/profile"; // Or a specific dealer profile page
          break;
        default:
          window.location.href = "/profile"; // Default for 'user' role
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrors({ general: "Сүлжээний алдаа гарлаа. Та интернэт холболтоо шалгана уу." });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>AutoNation | Нэвтрэх</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </Head>

      <section className="header">
        <nav>
          <Link href="/">
            <img src="/images/Logo_AN.png" alt="AutoNation Logo" />
          </Link>
          <div className={`nav-links ${menuOpen ? "show" : ""}`} id="navLinks">
            <i className="fa fa-times" onClick={toggleMenu}></i>
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
                  <Link href="/profile" className="nevtreh-btn">
                    <i className="fa fa-user-circle"></i> Профайл
                  </Link>
                </li>
              ) : (
                <li>
                  <Link href="/sign" className="nevtreh-btn">
                    Нэвтрэх
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <i className="fa fa-bars" onClick={toggleMenu}></i>
        </nav>

        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-card">
              <form
                id="loginForm"
                className={`auth-form ${
                  activeForm === "login" ? "active" : ""
                }`}
                onSubmit={handleLogin}
              >
                <div className="form-header">
                  <h2>Нэвтрэх</h2>
                  <p>AutoNation-д тавтай морилно уу</p>
                </div>

                {errors.general && (
                  <div className="error-message">{errors.general}</div>
                )}

                <div className="input-group">
                  <i className="fa fa-user"></i>
                  <input
                    type="text"
                    name="emailPhone"
                    placeholder="Имэйл эсвэл утасны дугаар"
                    className={errors.emailPhone ? "error" : ""}
                  />
                  {errors.emailPhone && (
                    <span className="error-text">{errors.emailPhone}</span>
                  )}
                </div>

                <div className="input-group">
                  <i className="fa fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Нууц үг"
                    className={errors.password ? "error" : ""}
                  />
                  <span
                    className={`toggle-password fa ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                    onClick={togglePasswordVisibility}
                  ></span>
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" /> Намайг сана
                  </label>
                  <a href="#" className="forgot-password">
                    Нууц үгээ мартсан?
                  </a>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Нэвтэрч байна...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-sign-in"></i> Нэвтрэх
                    </>
                  )}
                </button>

                <div className="form-footer">
                  Бүртгэлгүй юу?{" "}
                  <a onClick={() => showForm("signup")}>
                    <u>Шинэ хэрэглэгч бол бүртгүүлэх</u>
                  </a>
                </div>
              </form>

              <form
                id="signupForm"
                className={`auth-form ${
                  activeForm === "signup" ? "active" : ""
                }`}
                onSubmit={handleSignup}
              >
                <div className="form-header">
                  <h2>Бүртгүүлэх</h2>
                  <p>Шинэ хэрэглэгч бол бүртгүүлнэ үү</p>
                </div>

                {errors.general && (
                  <div className="error-message">{errors.general}</div>
                )}

                <div className="input-group">
                  <i className="fa fa-user"></i>
                  <input
                    type="text"
                    name="name"
                    placeholder="Бүтэн нэр"
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && (
                    <span className="error-text">{errors.name}</span>
                  )}
                </div>

                <div className="input-group">
                  <i className="fa fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="Имэйл хаяг"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                <div className="input-group">
                  <i className="fa fa-phone"></i>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Утасны дугаар"
                    className={errors.phone ? "error" : ""}
                  />
                  {errors.phone && (
                    <span className="error-text">{errors.phone}</span>
                  )}
                </div>

                <div className="input-group">
                  <i className="fa fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Нууц үг"
                    className={errors.password ? "error" : ""}
                  />
                  <span
                    className={`toggle-password fa ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                    onClick={togglePasswordVisibility}
                  ></span>
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>

                <div className="input-group">
                  <i className="fa fa-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Нууц үг давтах"
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  {errors.confirmPassword && (
                    <span className="error-text">{errors.confirmPassword}</span>
                  )}
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Бүртгүүлж байна...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-user-plus"></i> Бүртгүүлэх
                    </>
                  )}
                </button>

                <div className="form-footer">
                  Бүртгэлтэй юу?{" "}
                  <a onClick={() => showForm("login")}>
                    <u>Нэвтрэх</u>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </>
  );
}