import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    // Function to fetch user data (mocked for now, replace with real API call later)
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

    useEffect(() => {
        (async () => {
            const user = await fetchUserData();
            if (!user) {
                // If user is not found in localStorage, redirect to login
                // (For development, you could assign a mock user here instead of redirect)
                router.replace('/login');
                return;
            }
            setUserData(user);
            setLoading(false);
        })();
    }, [router]);

    // Compute profile completeness percentage
    const computeCompletion = () => {
        if (!userData) return 0;
        const fields = ['name', 'email', 'phone', 'address', 'avatar'];
        let filled = 0;
        fields.forEach(field => {
            if (userData[field]) {
                filled++;
            }
        });
        return Math.round((filled / fields.length) * 100);
    };

    const progressPercent = computeCompletion();
    const tabs = ['Profile', 'Edit'];

    // Handle keyboard navigation for tabs (left/right arrow, Home/End keys)
    const handleKeyDown = (event, index) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            setActiveTab((index + 1) % tabs.length);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            setActiveTab((index - 1 + tabs.length) % tabs.length);
        } else if (event.key === 'Home') {
            event.preventDefault();
            setActiveTab(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            setActiveTab(tabs.length - 1);
        }
    };

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
        <div className="profile-page container">
            <header className="profile-header">
                <div className="completion-bar">
                    <span id="profile-complete-label">Profile Completion:</span>
                    <progress
                        id="profile-complete"
                        value={progressPercent}
                        max="100"
                        aria-labelledby="profile-complete-label"
                    />
                    <span>{progressPercent}% Complete</span>
                </div>
                <h1>Сайн байна уу, {firstName || 'Хэрэглэгч'}!</h1>
            </header>

            <nav role="tablist" aria-label="Profile Tabs">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        role="tab"
                        aria-selected={activeTab === index}
                        aria-controls={`tabpanel-${index}`}
                        id={`tab-${index}`}
                        tabIndex={activeTab === index ? 0 : -1}
                        onClick={() => setActiveTab(index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`tab-button ${activeTab === index ? 'active' : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            {tabs.map((tab, index) => (
                <div
                    key={index}
                    role="tabpanel"
                    id={`tabpanel-${index}`}
                    aria-labelledby={`tab-${index}`}
                    hidden={activeTab !== index}
                    className="tab-panel"
                >
                    {index === 0 && (
                        <section aria-label="Profile information">
                            <div className="profile-info">
                                {userData.avatar && (
                                    <img
                                        src={userData.avatar}
                                        alt={`${userData.name || 'User'}'s avatar`}
                                        className="avatar"
                                    />
                                )}
                                <div className="profile-details">
                                    <p><strong>Name:</strong> {userData.name}</p>
                                    <p><strong>Email:</strong> {userData.email}</p>
                                    <p><strong>Phone:</strong> {userData.phone || '-'}</p>
                                    <p><strong>Address:</strong> {userData.address || '-'}</p>
                                </div>
                            </div>
                        </section>
                    )}
                    {index === 1 && (
                        <section aria-label="Edit profile information">
                            <h2>Edit Profile</h2>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                // Save changes to localStorage (future: API call)
                                localStorage.setItem('currentUser', JSON.stringify(userData));
                                alert('Profile updated (localStorage updated).');
                            }}>
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone:</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={userData.phone}
                                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address:</label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={userData.address}
                                        onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="avatar">Avatar URL:</label>
                                    <input
                                        id="avatar"
                                        type="url"
                                        value={userData.avatar}
                                        onChange={(e) => setUserData({ ...userData, avatar: e.target.value })}
                                        aria-describedby="avatar-desc"
                                    />
                                    <small id="avatar-desc">Link to your profile picture</small>
                                </div>
                                <button type="submit" className="btn">Save Changes</button>
                            </form>
                        </section>
                    )}
                </div>
            ))}
        </div>
    );
}