import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import '../public/admin.css';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingListings, setPendingListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Authentication check
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const session = await getSession();
      
      // Safe session check with optional chaining
      if (session?.user?.role !== 'admin') {
        router.replace('/login');
        return;
      }
      
      // Only set user if session is valid
      setUser(session.user);
      setAuthLoading(false);
      
    } catch (error) {
      console.error('Session check error:', error);
      router.replace('/login');
    }
  };

  checkAuth();
}, [router]);

  // Fetch data
  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [listingsRes, usersRes, allListingsRes] = await Promise.all([
        fetch(`/api/admin/listings?status=${selectedStatus}&page=${currentPage}&limit=10`),
        fetch('/api/admin/users'),
        fetch('/api/listings?limit=20')
      ]);

      if (!listingsRes.ok || !usersRes.ok || !allListingsRes.ok) {
        throw new Error('Өгөгдөл ачааллахад алдаа гарлаа');
      }

      const [listingsData, usersData, allListingsData] = await Promise.all([
        listingsRes.json(),
        usersRes.json(),
        allListingsRes.json()
      ]);

      setPendingListings(listingsData.listings);
      setTotalPages(listingsData.totalPages);
      setUsers(usersData);
      setAllListings(allListingsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user, selectedStatus, currentPage]);

  // Listing actions
  const handleListingAction = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error('Үйлдэл амжилтгүй боллоо');
      
      setPendingListings(prev => prev.filter(listing => listing._id !== id));
      setAllListings(prev => prev.filter(listing => listing._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // User deletion
  const handleDeleteUser = async (userId) => {
    if (!confirm('Хэрэглэгчийг устгахдаа итгэлтэй байна уу?')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Устгах амжилтгүй');
      
      setUsers(prev => prev.filter(u => u._id !== userId));
      setAllListings(prev => prev.filter(l => l.owner._id !== userId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Listing deletion
 const handleDeleteListing = async (listingId) => {
    if (!confirm('Зарыг устгахдаа итгэлтэй байна уу?')) return;
    
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Устгах амжилтгүй');
      
      setAllListings(prev => prev.filter(l => l._id !== listingId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (authLoading || loading) return <div className="loading">Түр хүлээнэ үү...</div>;
  if (!user) return null;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Админ Хяналтын Самбар</h1>
        <nav>
          <Link href="/">Нүүр</Link>
          <button onClick={() => router.push('/logout')}>Гарах</button>
        </nav>
      </header>

      <div className="admin-content">
        {/* Pending Listings Section */}
        <section className="admin-section">
          <h2>Хүлээгдэж буй зар</h2>
          <div className="status-filter">
            <button 
              className={selectedStatus === 'pending' ? 'active' : ''}
              onClick={() => setSelectedStatus('pending')}
            >
              Хүлээгдэж буй
            </button>
            <button
              className={selectedStatus === 'approved' ? 'active' : ''}
              onClick={() => setSelectedStatus('approved')}
            >
              Зөвшөөрөгдсөн
            </button>
            <button
              className={selectedStatus === 'declined' ? 'active' : ''}
              onClick={() => setSelectedStatus('declined')}
            >
              Татгалзсан
            </button>
          </div>
          
          {pendingListings.length === 0 ? (
            <p>Ямар ч зар олдсонгүй</p>
          ) : (
            pendingListings.map(listing => (
              <div key={listing._id} className="listing-card">
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <p>Үнэ: {listing.price.toLocaleString()}₮</p>
                  <p>Явсан км: {listing.km.toLocaleString()}</p>
                  <p>Төрөл: {listing.type}</p>
                </div>
                <div className="listing-actions">
                  {listing.status === 'pending' && (
                    <>
                      <button 
                        className="approve-btn"
                        onClick={() => handleListingAction(listing._id, 'approved')}
                      >
                        Зөвшөөрөх
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleListingAction(listing._id, 'declined')}
                      >
                        Татгалзах
                      </button>
                    </>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteListing(listing._id)}
                  >
                    Устгах
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Users Section */}
        <section className="admin-section">
          <h2>Хэрэглэгчид</h2>
          {users.length === 0 ? (
            <p>Хэрэглэгч олдсонгүй</p>
          ) : (
            users.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <h3>{user.email}</h3>
                  <p>Эрх: {user.role}</p>
                  <p>Бүртгүүлсэн: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Устгах
                </button>
              </div>
            ))
          )}
        </section>

        {/* All Listings Section */}
        <section className="admin-section">
          <h2>Бүх зар</h2>
          {allListings.length === 0 ? (
            <p>Ямар ч зар олдсонгүй</p>
          ) : (
            allListings.map(listing => (
              <div key={listing._id} className="listing-card">
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <p>Статус: {listing.status}</p>
                  <p>Үнэ: {listing.price.toLocaleString()}₮</p>
                  <p>Эзэмшигч: {listing.owner.email}</p>
                </div>
                <div className="listing-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteListing(listing._id)}
                  >
                    Устгах
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}