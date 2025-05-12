import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import '../public/style.css';
import '../public/login.css';
import Footer from 'components/footer';

export default function SignPage() {
    const [activeForm, setActiveForm] = useState('login');
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const showForm = (formType) => {
        setActiveForm(formType);
        setErrors({});
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateSignup = (formData) => {
        const newErrors = {};
        if (!formData.get('name')) newErrors.name = 'Нэрээ оруулна уу';
        if (!formData.get('email')) {
            newErrors.email = 'Имэйл хаяг оруулна уу';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.get('email'))) {
            newErrors.email = 'Хүчинтэй имэйл оруулна уу';
        }
        if (!formData.get('phone')) {
            newErrors.phone = 'Утасны дугаар оруулна уу';
        } else if (!/^\d{8}$/.test(formData.get('phone'))) {
            newErrors.phone = '8 оронтой тоо оруулна уу';
        }
        if (!formData.get('password')) {
            newErrors.password = 'Нууц үг оруулна уу';
        } else if (formData.get('password').length < 6) {
            newErrors.password = 'Хамгийн багадаа 6 тэмдэгт';
        }
        if (formData.get('password') !== formData.get('confirmPassword')) {
            newErrors.confirmPassword = 'Нууц үг таарахгүй байна';
        }
        return newErrors;
    };

    const validateLogin = (formData) => {
        const newErrors = {};
        if (!formData.get('emailPhone')) newErrors.emailPhone = 'Имэйл эсвэл утасны дугаар оруулна уу';
        if (!formData.get('password')) newErrors.password = 'Нууц үг оруулна уу';
        return newErrors;
    };

    const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const validationErrors = validateSignup(formData);
    
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password'),
                role: 'user'
            }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Бүртгэл амжилтгүй боллоо');
        }

        const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
            }),
        });

        const loginData = await loginResponse.json();
        
        if (!loginResponse.ok) {
            throw new Error(loginData.message || 'Нэвтрэхэд алдаа гарлаа');
        }

        // Redirect to profile
        window.location.href = '/profile';
    } catch (error) {
        setErrors({ general: error.message });
    } finally {
        setLoading(false);
    }
};

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  const formData = new FormData(e.target);
  const validationErrors = validateLogin(formData);

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailPhone: formData.get('emailPhone'),
        password: formData.get('password')
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Нэвтрэхэд алдаа гарлаа');
    }
    // Хэрэглэгчийн мэдээлэл localStorage-д хадгалах
    localStorage.setItem('currentUser', JSON.stringify(data.data)); // Энэ мөрийг нэмнэ

    // Redirect хийх
    window.location.href = '/profile';

    // Redirect based on user role
    switch (data.data.role) {
      case 'admin':
        window.location.href = '/admin';
        break;
      case 'dealer':
        window.location.href = '/profile';
        break;
      default:
        window.location.href = '/profile';
    }

  } catch (error) {
    setErrors({ general: error.message });
  } finally {
    setLoading(false);
  }
};

    if (typeof window !== 'undefined' && !localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    return (
        <>
            <Head>
                <title>AutoNation | Нэвтрэх</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
            </Head>

            <section className="header"> 
                <nav>
                    <Link href="/"><img src="/images/Logo_AN.png" alt="AutoNation Logo" /></Link>
                    <div className={`nav-links ${menuOpen ? 'show' : ''}`} id="navLinks">
                        <i className="fa fa-times" onClick={toggleMenu}></i>
                        <ul>
                            <li><a href="/">Нүүр</a></li>
                            <li><a href="/buh_zaruud">Бүх зарууд</a></li>
                            <li><a href="/sell">Зар нэмэх</a></li>
                            <li><a href="/sign" className="nevtreh-btn">Нэвтрэх</a></li>
                        </ul>
                    </div>
                    <i className="fa fa-bars" onClick={toggleMenu}></i>
                </nav>

                <section className="auth-section">
                    <div className="auth-container">
                        <div className="auth-card">
                            <form 
                                id="loginForm" 
                                className={`auth-form ${activeForm === 'login' ? 'active' : ''}`}
                                onSubmit={handleLogin}
                            >
                                <div className="form-header">
                                    <h2>Нэвтрэх</h2>
                                    <p>AutoNation-д тавтай морилно уу</p>
                                </div>
                                
                                {errors.general && <div className="error-message">{errors.general}</div>}
                                
                                <div className="input-group">
                                    <i className="fa fa-user"></i>
                                    <input 
                                        type="text" 
                                        name="emailPhone" 
                                        placeholder="Имэйл эсвэл утасны дугаар" 
                                        className={errors.emailPhone ? 'error' : ''}
                                    />
                                    {errors.emailPhone && <span className="error-text">{errors.emailPhone}</span>}
                                </div>
                                
                                <div className="input-group">
                                    <i className="fa fa-lock"></i>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        placeholder="Нууц үг" 
                                        className={errors.password ? 'error' : ''}
                                    />
                                    <span 
                                        className={`toggle-password fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                        onClick={togglePasswordVisibility}
                                    ></span>
                                    {errors.password && <span className="error-text">{errors.password}</span>}
                                </div>
                                
                                <div className="form-options">
                                    <label className="remember-me">
                                        <input type="checkbox" /> Намайг сана
                                    </label>
                                    <a href="#" className="forgot-password">Нууц үгээ мартсан?</a>
                                </div>
                                
                                <button type="submit" className="auth-btn" disabled={loading}>
                                    {loading ? (
                                        <><i className="fas fa-spinner fa-spin"></i> Нэвтэрч байна...</>
                                    ) : (
                                        <><i className="fa fa-sign-in"></i> Нэвтрэх</>
                                    )}
                                </button>
                                
                                <div className="form-footer">
                                    Бүртгэлгүй юу? <a onClick={() => showForm('signup')}><u>Шинэ хэрэглэгч бол бүртгүүлэх</u></a>
                                </div>
                            </form>

                            <form 
                                id="signupForm" 
                                className={`auth-form ${activeForm === 'signup' ? 'active' : ''}`}
                                onSubmit={handleSignup}
                            >
                                <div className="form-header">
                                    <h2>Бүртгүүлэх</h2>
                                    <p>Шинэ хэрэглэгч бол бүртгүүлнэ үү</p>
                                </div>
                                
                                {errors.general && <div className="error-message">{errors.general}</div>}
                                
                                <div className="input-group">
                                    <i className="fa fa-user"></i>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder="Бүтэн нэр" 
                                        className={errors.name ? 'error' : ''}
                                    />
                                    {errors.name && <span className="error-text">{errors.name}</span>}
                                </div>
                                
                                <div className="input-group">
                                    <i className="fa fa-envelope"></i>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Имэйл хаяг" 
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>
                                
                                <div className="input-group">
                                    <i className="fa fa-phone"></i>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        placeholder="Утасны дугаар" 
                                        className={errors.phone ? 'error' : ''}
                                    />
                                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                                </div>
                                
                                <div className="input-group">
                                    <i className="fa fa-lock"></i>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        placeholder="Нууц үг" 
                                        className={errors.password ? 'error' : ''}
                                    />
                                    <span 
                                        className={`toggle-password fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                        onClick={togglePasswordVisibility}
                                    ></span>
                                    {errors.password && <span className="error-text">{errors.password}</span>}
                                </div>
                                
                                <div className="input-group">
                                    <i className="fa fa-lock"></i>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="confirmPassword" 
                                        placeholder="Нууц үг давтах" 
                                        className={errors.confirmPassword ? 'error' : ''}
                                    />
                                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                                </div>
                                
                                <button type="submit" className="auth-btn" disabled={loading}>
                                    {loading ? (
                                        <><i className="fas fa-spinner fa-spin"></i> Бүртгүүлж байна...</>
                                    ) : (
                                        <><i className="fa fa-user-plus"></i> Бүртгүүлэх</>
                                    )}
                                </button>
                                
                                <div className="form-footer">
                                    Бүртгэлтэй юу? <a onClick={() => showForm('login')}><u>Нэвтрэх</u></a>
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