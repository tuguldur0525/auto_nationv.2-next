import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import '../public/style.css';
import '../public/login.css';

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

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const newUser = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password')
        };

        const exists = users.some(user =>
            user.email === newUser.email || user.phone === newUser.phone
        );

        if (exists) {
            setErrors({ general: 'Хэрэглэгч аль хэдийн бүртгэлтэй байна!' });
            setLoading(false);
            return;
        }

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        showForm('login');
        e.target.reset();
        setLoading(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData(e.target);
        const validationErrors = validateLogin(formData);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const emailPhone = formData.get('emailPhone');
        const password = formData.get('password');

        const user = users.find(user =>
            (user.email === emailPhone || user.phone === emailPhone) &&
            user.password === password
        );

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = '/profile';
        } else {
            setErrors({ general: 'Имэйл/утасны дугаар эсвэл нууц үг буруу байна!' });
            setLoading(false);
        }
    };

    if (typeof window !== 'undefined' && !localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    return (
        <>
            <Head>
                <title>Нэвтрэх | AutoNation</title>
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
                            <li><Link href="/">Нүүр</Link></li>
                            <li><Link href="/buh_zaruud">Бүх зарууд</Link></li>
                            <li><Link href="/sell">Зар нэмэх</Link></li>
                            <li><Link href="/sign" className="nevtreh-btn">Нэвтрэх</Link></li>
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
                                    <p>Тавтай морилно уу</p>
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
                                    Бүртгэлгүй юу? <a onClick={() => showForm('signup')}>Шинэ хэрэглэгч бол бүртгүүлэх</a>
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
                                    Бүртгэлтэй юу? <a onClick={() => showForm('login')}>Нэвтрэх</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <h3>Манай апп-ыг татах</h3>
                            <p>Google play болон App store-с татах боломжтой.</p>
                            <div className="app-logo">
                                <img src="/images/apple-logo-transparent.svg" alt="App Store" />
                                <img src="/images/play-store-logo3.png" alt="Google Play" />
                            </div>
                        </div>
                        <div className="footer-col">
                            <img src="/images/Logo_AN.png" alt="Brand Logo" className="footer-logo" />
                            <p>Монголын хамгийн том авто худалдааны сайт.</p>
                        </div>
                        <div className="footer-col">
                            <h3>Бидний цахим хуудсуудыг дагах</h3>
                            <ul>
                                <li><a href="#">Facebook</a></li>
                                <li><a href="#">Instagram</a></li>
                                <li><a href="#">Twitter</a></li>
                                <li><a href="#">YouTube</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h3>Холбоо барих</h3>
                            <ul>
                                <li><a href="#">Утас: +976-99008800</a></li>
                                <li><a href="#">И-Майл хаяг: autonation@sales.mn</a></li>
                                <li><a href="#">Хаяг байршил: Улаанбаатар хот, СБД 8-р хороо, Оюутны гудамж, МУИС-8</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <p>&copy; 2025 Autonation. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}