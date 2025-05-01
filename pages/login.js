import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import '../public/style.css';
import '../public/login.css';

export default function SignPage() {
    const [activeForm, setActiveForm] = useState('login');
    const [menuOpen, setMenuOpen] = useState(false);

    const showForm = (formType) => {
        setActiveForm(formType);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSignup = (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
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
            alert('Хэрэглэгч аль хэдийн бүртгэлтэй байна!');
            return;
        }

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Амжилттай бүртгүүллээ! Нэвтрэх форм руу шилжинэ.');
        showForm('login');
        e.target.reset();
    };

    const handleLogin = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const formData = new FormData(e.target);

        const emailPhone = formData.get('emailPhone');
        const password = formData.get('password');

        const user = users.find(user =>
            (user.email === emailPhone || user.phone === emailPhone) &&
            user.password === password
        );

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Амжилттай нэвтэрлээ!');
            window.location.href = '/profile';
        } else {
            alert('Имэйл/утасны дугаар эсвэл нууц үг буруу байна!');
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
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
            </Head>

            {/* Navigation Bar */}
            <section className="header">
                <nav>
                    <Link href="/"><img src="/images/Logo_AN.png" alt="AutoNation Logo" /></Link>
                    <div className={`nav-links ${menuOpen ? 'show' : ''}`} id="navLinks">
                        <i className="fa fa-times" onClick={toggleMenu}></i>
                        <ul>
                            <li><Link href="/">Нүүр</Link></li>
                            <li><Link href="/listings">Бүх зарууд</Link></li>
                            <li><Link href="/sell">Зар нэмэх</Link></li>
                            <li><Link href="/sign" className="nevtreh-btn">Нэвтрэх</Link></li>
                        </ul>
                    </div>
                    <i className="fa fa-bars" onClick={toggleMenu}></i>
                </nav>
            </section>

            {/* Auth Section */}
            <section className="auth-section">
                <div className="auth-container">
                    <div className="auth-card">
                        {/* Login Form */}
                        <form 
                            id="loginForm" 
                            className={`auth-form ${activeForm === 'login' ? 'active' : ''}`}
                            onSubmit={handleLogin}
                        >
                            <div className="form-header">
                                <h2>Нэвтрэх</h2>
                                <p>Тавтай морилно уу</p>
                            </div>
                            
                            <div className="input-group">
                                <i className="fa fa-user"></i>
                                <input 
                                    type="text" 
                                    name="emailPhone" 
                                    placeholder="Имэйл эсвэл утасны дугаар" 
                                    required 
                                />
                            </div>
                            
                            <div className="input-group">
                                <i className="fa fa-lock"></i>
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Нууц үг" 
                                    required 
                                />
                                <span className="toggle-password fa fa-eye"></span>
                            </div>
                            
                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" /> Намайг сана
                                </label>
                                <a href="#" className="forgot-password">Нууц үгээ мартсан?</a>
                            </div>
                            
                            <button type="submit" className="auth-btn">
                                <i className="fa fa-sign-in"></i> Нэвтрэх
                            </button>
                            
                            <div className="form-footer">
                                Бүртгэлгүй юу? <a onClick={() => showForm('signup')}>Шинэ хэрэглэгч бол бүртгүүлэх</a>
                            </div>
                        </form>

                        {/* Signup Form */}
                        <form 
                            id="signupForm" 
                            className={`auth-form ${activeForm === 'signup' ? 'active' : ''}`}
                            onSubmit={handleSignup}
                        >
                            <div className="form-header">
                                <h2>Бүртгүүлэх</h2>
                                <p>Шинэ хэрэглэгч бол бүртгүүлнэ үү</p>
                            </div>
                            
                            <div className="input-group">
                                <i className="fa fa-user"></i>
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Бүтэн нэр" 
                                    required 
                                />
                            </div>
                            
                            <div className="input-group">
                                <i className="fa fa-envelope"></i>
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Имэйл хаяг" 
                                    required 
                                />
                            </div>
                            
                            <div className="input-group">
                                <i className="fa fa-phone"></i>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    placeholder="Утасны дугаар" 
                                    required 
                                    pattern="[0-9]{8}" 
                                />
                            </div>
                            
                            <div className="input-group">
                                <i className="fa fa-lock"></i>
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Нууц үг" 
                                    required 
                                />
                                <span className="toggle-password fa fa-eye"></span>
                            </div>
                            
                            <div className="input-group">
                                <i className="fa fa-lock"></i>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    placeholder="Нууц үг давтах" 
                                    required 
                                />
                            </div>
                            
                            <button type="submit" className="auth-btn">
                                <i className="fa fa-user-plus"></i> Бүртгүүлэх
                            </button>
                            
                            <div className="form-footer">
                                Бүртгэлтэй юу? <a onClick={() => showForm('login')}>Нэвтрэх</a>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <h3>Манай апп-ыг татах</h3>
                            <p>Google play болон App store-с татах боломжтой.</p>
                            <div className="app-logo">
                                <img src="images/apple-logo-transparent.svg" alt="App Store" />
                                <img src="images/play-store-logo3.png" alt="Google Play" />
                            </div>
                        </div>
                        <div className="footer-col">
                            <img src="images/Logo_AN.png" alt="Brand Logo" className="footer-logo" />
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
