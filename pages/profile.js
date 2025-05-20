import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from 'components/header';
import Footer from 'components/footer';
import '../public/profile.css';


export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal-info');

    // Function to fetch user data
    async function fetchUserData() {
        let storedUser = null;
        try {
            if (typeof window !== 'undefined') {
                const userString = localStorage.getItem('currentUser');
                storedUser = userString ? JSON.parse(userString) : null;
            }
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
        }
        return storedUser;
    }

    // Function to handle logout
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('currentUser');
            router.push('/login');
        }
    };

    useEffect(() => {
        (async () => {
            const user = await fetchUserData();
            if (!user) {
                router.replace('/login');
                return;
            }
            setUserData(user);
            setLoading(false);
        })();
    }, [router]);

    // Loading state
    if (loading) {
        return (
            <div className="loading-indicator" role="status" aria-live="polite">
                <progress aria-label="Loading user data" />
                <p>Loading your profile...</p>
            </div>
        );
    }

    // If not authenticated (userData still null), do not render content
    if (!userData) {
        return null;
    }

    // Extract first name for greeting
    const firstName = userData.name ? userData.name.split(' ')[0] : '';

    return (
        <>
            <Head>
                <title>AutoNation | Profile</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
                />
            </Head>

            {/* Header */}
            <Header />

            {/* Profile Section */}
            <section className="profile-section">
                <div className="container">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <img src={userData.avatar || "/images/3_avatar-512.webp"} alt="Profile" />
                            <button className="edit-avatar-btn" onClick={() => setActiveTab('settings')}>
                                <i className="fa fa-camera"></i>
                            </button>
                        </div>
                        <div className="profile-info">
                            <h1>{firstName || 'Хэрэглэгч'}</h1>
                            <p><i className="fa fa-map-marker"></i> {userData.address || 'Улаанбаатар, Монгол'}</p>
                            <div className="profile-stats">
                                <div className="stat-item"><span className="stat-number">12</span><span className="stat-label">Хадгалсан</span></div>
                                <div className="stat-item"><span className="stat-number">5</span><span className="stat-label">Зар</span></div>
                                <div className="stat-item"><span className="stat-number">3</span><span className="stat-label">Хэлэлцүүлэг</span></div>
                            </div>
                        </div>
                        <button 
                            className="edit-profile-btn"
                            onClick={() => setActiveTab('personal-info')}
                        >
                            <i className="fa fa-pencil"></i> Профайл засах
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="profile-tabs">
                        <button 
                            onClick={() => setActiveTab('personal-info')} 
                            className={`tab-btn ${activeTab === 'personal-info' ? 'active' : ''}`}
                        >
                            Хувийн мэдээлэл
                        </button>
                        <button 
                            onClick={() => setActiveTab('saved-cars')} 
                            className={`tab-btn ${activeTab === 'saved-cars' ? 'active' : ''}`}
                        >
                            Хадгалсан
                        </button>
                        <button 
                            onClick={() => setActiveTab('my-listings')} 
                            className={`tab-btn ${activeTab === 'my-listings' ? 'active' : ''}`}
                        >
                            Миний зарууд
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')} 
                            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        >
                            Тохиргоо
                        </button>
                    </div>

                    <div className="tab-contents">
                        {/* PERSONAL INFO */}
                        {activeTab === 'personal-info' && (
                            <div className="tab-content active">
                                <h2><i className="fa fa-user"></i> Хувийн мэдээлэл</h2>
                                <ul>
                                    <li><strong>Овог:</strong> {userData.name ? userData.name.split(' ')[0] : '-'}</li>
                                    <li><strong>Нэр:</strong> {userData.name ? userData.name.split(' ').slice(1).join(' ') : '-'}</li>
                                    <li><strong>Имэйл:</strong> {userData.email || '-'}</li>
                                    <li><strong>Утас:</strong> {userData.phone || '-'}</li>
                                    <li><strong>Байршил:</strong> {userData.address || '-'}</li>
                                </ul>
                            </div>
                        )}

                        {/* SAVED CARS */}
                        {activeTab === 'saved-cars' && (
                            <div className="tab-content active">
                                <h2><i className="fa fa-heart"></i> Хадгалсан автомашинууд</h2>
                                <div className="car-grid">
                                    <div className="car-card">
                                        <img src="/images/car1.jpg" alt="Car 1" />
                                        <h3>Toyota Prius 30</h3>
                                        <p>2013 | 180,000 км | 18 сая ₮</p>
                                    </div>
                                    <div className="car-card">
                                        <img src="/images/car2.jpg" alt="Car 2" />
                                        <h3>Honda Fit</h3>
                                        <p>2012 | 150,000 км | 14 сая ₮</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MY LISTINGS */}
                        {activeTab === 'my-listings' && (
                            <div className="tab-content active">
                                <h2><i className="fa fa-car"></i> Миний зарууд</h2>
                                <div className="listing-item">
                                    <h3>Toyota Land Cruiser 200</h3>
                                    <p>2016 | 95,000 км | 120 сая ₮</p>
                                    <button>Зар засах</button>
                                    <button>Устгах</button>
                                </div>
                                <div className="listing-item">
                                    <h3>Nissan X-Trail</h3>
                                    <p>2014 | 110,000 км | 45 сая ₮</p>
                                    <button>Зар засах</button>
                                    <button>Устгах</button>
                                </div>
                            </div>
                        )}

                        {/* SETTINGS */}
                        {activeTab === 'settings' && (
                            <div className="tab-content active">
                                <h2><i className="fa fa-cog"></i> Тохиргоо</h2>
                                <form 
                                    className="settings-form"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        localStorage.setItem('currentUser', JSON.stringify(userData));
                                        alert('Profile updated successfully!');
                                    }}
                                >
                                    <label>
                                        Нэр:
                                        <input 
                                            type="text" 
                                            value={userData.name || ''}
                                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                                        />
                                    </label>
                                    <label>
                                        Имэйл:
                                        <input 
                                            type="email" 
                                            value={userData.email || ''}
                                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                                        />
                                    </label>
                                    <label>
                                        Утас:
                                        <input 
                                            type="tel" 
                                            value={userData.phone || ''}
                                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                        />
                                    </label>
                                    <label>
                                        Байршил:
                                        <input 
                                            type="text" 
                                            value={userData.address || ''}
                                            onChange={(e) => setUserData({...userData, address: e.target.value})}
                                        />
                                    </label>
                                    <label>
                                        Avatar URL:
                                        <input 
                                            type="url" 
                                            value={userData.avatar || ''}
                                            onChange={(e) => setUserData({...userData, avatar: e.target.value})}
                                        />
                                    </label>
                                    <label>
                                        Нууц үг:
                                        <input 
                                            type="password" 
                                            placeholder="Шинэ нууц үг"
                                        />
                                    </label>
                                    <div className="form-actions">
                                        <button type="submit">Хадгалах</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Logout Button - Added at the bottom */}
                   
                </div>
                 <div className="logout-section">
                        <button 
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            <i className="fa fa-sign-out"></i> Гарах
                        </button>
                    </div>
            </section>
            

            {/* Footer */}
            <Footer />
            
        </>
    );
}