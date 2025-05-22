import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '../public/admin.css';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [pendingListings, setPendingListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Authentication Check
  useEffect(() => {
    const checkCustomAuth = async () => {
      try {
        setAuthLoading(true);
        const res = await fetch('/api/auth/validate-token', {
          credentials: 'include'
        });

        if (!res.ok) {
          router.replace('/login');
          return;
        }

        const data = await res.json();
        if (data.user?.role === 'admin') {
          setUser(data.user);
          setError(null);
        } else {
          router.replace('/login');
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication error');
        router.replace('/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkCustomAuth();
  }, [router]);

  // Data Fetching
  const fetchData = useCallback(async () => {
    if (!user || dataLoading) return;

    try {
      setDataLoading(true);
      setError(null);

      const [listingsRes, usersRes, allListingsRes] = await Promise.all([
        fetch(`/api/admin/listings?status=${selectedStatus}&page=${currentPage}&limit=10`, {
          credentials: 'include'
        }),
        fetch('/api/admin/users', {
          credentials: 'include'
        }),
        fetch('/api/listings?limit=20', {
          credentials: 'include'
        })
      ]);

      // Error handling for each response
      if (!listingsRes.ok) throw new Error('Failed to load listings');
      if (!usersRes.ok) throw new Error('Failed to load users');
      if (!allListingsRes.ok) throw new Error('Failed to load all listings');

      const [listingsData, usersData, allListingsData] = await Promise.all([
        listingsRes.json(),
        usersRes.json(),
        allListingsRes.json()
      ]);

      setPendingListings(listingsData.listings || []);
      setTotalPages(listingsData.totalPages || 1);
      setUsers(usersData || []);
      setAllListings(allListingsData || []);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setDataLoading(false);
    }
  }, [user, selectedStatus, currentPage, dataLoading]);

  useEffect(() => {
    if (user && !authLoading) fetchData();
  }, [user, selectedStatus, currentPage, authLoading, fetchData]);

  // Listing Actions
  const handleListingAction = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Action failed');

      setPendingListings(prev => prev.filter(l => l._id !== id));
      setAllListings(prev => prev.map(l => 
        l._id === id ? { ...l, status } : l
      ));
      alert('Action successful!');
    } catch (err) {
      alert(err.message);
    }
  };

  // User Deletion
  const handleDeleteUser = async (userId) => {
    if (!confirm('Confirm user deletion?')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Deletion failed');

      setUsers(prev => prev.filter(u => u._id !== userId));
      setAllListings(prev => prev.filter(l => l.owner._id !== userId));
      alert('User deleted!');
    } catch (err) {
      alert(err.message);
    }
  };

  // Listing Deletion
  const handleDeleteListing = async (listingId) => {
    if (!confirm('Confirm listing deletion?')) return;

    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Deletion failed');

      setAllListings(prev => prev.filter(l => l._id !== listingId));
      setPendingListings(prev => prev.filter(l => l._id !== listingId));
      alert('Listing deleted!');
    } catch (err) {
      alert(err.message);
    }
  };

  // Loading and Error States
  if (authLoading) return <div className="loading">Checking authentication...</div>;
  if (!user) return <div className="error">Not authorized</div>;
  if (dataLoading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Админ Хяналтын Самбар</h1>
        <nav>
          <Link href="/">Нүүр</Link>
          <button onClick={async () => {
            try {
              await fetch('/api/auth/logout', { method: 'POST' }); 
              setUser(null);
              router.replace('/login');
            } catch (err) {
              console.error('Logout error:', err);
              alert('Гарахад алдаа гарлаа.');
            }
          }}>Гарах</button>
        </nav>
      </header>

      <div className="admin-content">
        <section className="admin-section">
          <h2>Хүлээгдэж буй зар</h2>
          <div className="status-filter">
            <button
              className={selectedStatus === 'pending' ? 'active' : ''}
              onClick={() => { setCurrentPage(1); setSelectedStatus('pending'); }}
            >
              Хүлээгдэж буй
            </button>
            <button
              className={selectedStatus === 'approved' ? 'active' : ''}
              onClick={() => { setCurrentPage(1); setSelectedStatus('approved'); }}
            >
              Зөвшөөрөгдсөн
            </button>
            <button
              className={selectedStatus === 'declined' ? 'active' : ''}
              onClick={() => { setCurrentPage(1); setSelectedStatus('declined'); }}
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
                  <p>Үнэ: {listing.price?.toLocaleString()}₮</p>
                  <p>Явсан км: {listing.km?.toLocaleString()}</p>
                  <p>Төрөл: {listing.type}</p>
                  <p>Статус: {listing.status}</p>
                  <p>Эзэмшигч: {listing.owner?.email || 'Мэдээлэлгүй'}</p>
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
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Өмнөх
              </button>
              <span>Хуудас {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Дараах
              </button>
            </div>
          )}
        </section>

        {/* Users Section */}
        <section className="admin-section">
          <h2>Хэрэглэгчид</h2>
          {users.length === 0 ? (
            <p>Хэрэглэгч олдсонгүй</p>
          ) : (
            users.map(userItem => (
              <div key={userItem._id} className="user-card">
                <div className="user-info">
                  <h3>{userItem.email}</h3>
                  <p>Эрх: {userItem.role}</p>
                  <p>Бүртгүүлсэн: {new Date(userItem.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(userItem._id)}
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
                  <p>Үнэ: {listing.price?.toLocaleString()}₮</p>
                  <p>Эзэмшигч: {listing.owner?.email || 'Мэдээлэлгүй'}</p>
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