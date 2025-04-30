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

        // Check if user already exists
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

        // Find user
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

    // Initialize users array in localStorage if not exists
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

            {/* Auth Container */}
            <div className="auth-container">
                <div className="auth-tabs">
                    <div 
                        className={`auth-tab ${activeForm === 'login' ? 'active' : ''}`} 
                        onClick={() => showForm('login')}
                    >
                        Нэвтрэх
                    </div>
                    <div 
                        className={`auth-tab ${activeForm === 'signup' ? 'active' : ''}`} 
                        onClick={() => showForm('signup')}
                    >
                        Бүртгүүлэх
                    </div>
                </div>

                {/* Login Form */}
                <form 
                    id="loginForm" 
                    className={`auth-form ${activeForm === 'login' ? 'active' : ''}`}
                    onSubmit={handleLogin}
                >
                    <input 
                        type="text" 
                        name="emailPhone" 
                        placeholder="Имэйл эсвэл утасны дугаар" 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Нууц үг" 
                        required 
                    />
                    <button type="submit">Нэвтрэх</button>
                </form>

                {/* Signup Form */}
                <form 
                    id="signupForm" 
                    className={`auth-form ${activeForm === 'signup' ? 'active' : ''}`}
                    onSubmit={handleSignup}
                >
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Бүтэн нэр" 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Имэйл хаяг" 
                        required 
                    />
                    <input 
                        type="tel" 
                        name="phone" 
                        placeholder="Утасны дугаар" 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Нууц үг" 
                        required 
                    />
                    <button type="submit">Бүртгүүлэх</button>
                </form>
            </div>

            {/* Footer */}
            <div className="footer">
                {/* Same footer as index.html */}
            </div>
        </>
    );
}
