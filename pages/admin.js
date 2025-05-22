// pages/admin.js
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// Assuming your admin.css is in public/. This import should typically work
// if you have 'css-loader' and 'postcss-loader' configured in next.config.js for CSS.
// If you are using module CSS (e.g., admin.module.css), the import syntax changes.
import '../public/admin.css'; // Verify this path and how you handle CSS in Next.js

export default function AdminPage() {
  const router = useRouter();

  // State variables
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [pendingListings, setPendingListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success messages

  // Console logs for debugging render state
  console.log('--- Current Render State ---');
  console.log('User:', user);
  console.log('Auth Loading:', authLoading);
  console.log('Data Loading:', dataLoading);
  console.log('Error:', error);
  console.log('Message:', message);
  console.log('Pending Listings Count:', pendingListings.length);
  console.log('All Listings Count:', allListings.length);
  console.log('Users Count:', users.length);
  console.log('Selected Status:', selectedStatus);
  console.log('Current Page:', currentPage);
  console.log('Total Pages:', totalPages);
  console.log('----------------------------');

  // Authentication Check
  const checkCustomAuth = useCallback(async () => {
    console.log('checkCustomAuth initiated...');
    setAuthLoading(true);
    setError(null);
    setMessage(null); // Clear messages on new auth check

    try {
      const res = await fetch('/api/auth/validate-token', {
        credentials: 'include',
      });

      console.log('validate-token response status:', res.status);
      const data = await res.json();
      console.log('validate-token response data:', data);

      if (!res.ok || !data.success) {
        console.log('Auth validation failed. Response:', data.message || 'Unknown error');
        setError(data.message || 'Authentication failed.');
        setUser(null);
        if (res.status === 401 || res.status === 403) {
          router.replace('/login');
        }
        return;
      }

      if (data.user?.role === 'admin') {
        setUser(data.user);
        setError(null);
        setMessage('Амжилттай нэвтэрлээ.'); // Success message
        console.log('Auth successful! User set:', data.user.email);
      } else {
        console.log(`User ${data.user?.email} is not an admin (${data.user?.role || 'no role'}).`);
        setError('Эрхгүй хандалт: Та админы эрхгүй байна.'); // Mongolian for "Unauthorized access"
        setUser(null);
        router.replace('/login');
      }
    } catch (err) {
      console.error('Auth error (in checkCustomAuth):', err);
      setError('Нэвтрэх үед алдаа гарлаа: ' + err.message); // Mongolian for "Authentication error"
      setUser(null);
      router.replace('/login');
    } finally {
      setAuthLoading(false);
      console.log('Auth process finished. authLoading set to false.');
    }
  }, [router]);

  useEffect(() => {
    if (router.isReady) {
      console.log('Router is ready. Initiating authentication check...');
      checkCustomAuth();
    }
  }, [router.isReady, checkCustomAuth]);

  // Data Fetching
  const fetchData = useCallback(async () => {
    if (!user || dataLoading) {
      console.log('fetchData skipped: user or dataLoading status:', user, dataLoading);
      return;
    }

    try {
      setDataLoading(true);
      setError(null);
      setMessage(null); // Clear messages on new data fetch
      console.log('Starting data fetch...');

      const [listingsRes, usersRes, allListingsRes] = await Promise.all([
        fetch(`/api/admin/listings?status=${selectedStatus}&page=${currentPage}&limit=10`, {
          credentials: 'include',
        }),
        fetch('/api/admin/users', {
          credentials: 'include',
        }),
        fetch('/api/listings?limit=20', {
          credentials: 'include',
        }),
      ]);

      if (!listingsRes.ok) throw new Error(`Зар ачаалахад алдаа гарлаа: ${listingsRes.status} ${listingsRes.statusText}`); // Mongolian: "Failed to load listings"
      if (!usersRes.ok) throw new Error(`Хэрэглэгч ачаалахад алдаа гарлаа: ${usersRes.status} ${usersRes.statusText}`); // Mongolian: "Failed to load users"
      if (!allListingsRes.ok) throw new Error(`Бүх зар ачаалахад алдаа гарлаа: ${allListingsRes.status} ${allListingsRes.statusText}`); // Mongolian: "Failed to load all listings"

      const [listingsData, usersData, allListingsData] = await Promise.all([
        listingsRes.json(),
        usersRes.json(),
        allListingsRes.json(),
      ]);

      setPendingListings(listingsData.listings || []);
      setTotalPages(listingsData.totalPages || 1);
      setUsers(usersData || []);
      setAllListings([
        ...(allListingsData.newCars || []),
        ...(allListingsData.electricCars || []),
        ...(allListingsData.SUVCars || []),
      ]);

      console.log('Data fetch successful!');
      console.log('Fetched Pending Listings (count):', listingsData.listings?.length);
      console.log('Fetched All Listings (count):', (allListingsData.newCars?.length || 0) + (allListingsData.electricCars?.length || 0) + (allListingsData.SUVCars?.length || 0));
      console.log('Fetched Users (count):', usersData?.length);
      setMessage('Мэдээллийг амжилттай татлаа.'); // Mongolian: "Data fetched successfully."

    } catch (err) {
      console.error('Fetch error in fetchData:', err);
      setError(err.message);
    } finally {
      setDataLoading(false);
      console.log('Data fetch process finished. dataLoading set to false.');
    }
  }, [user, selectedStatus, currentPage]);

  useEffect(() => {
    if (user && !authLoading) {
      console.log('User is authenticated, authLoading is false. Calling fetchData...');
      fetchData();
    } else {
      console.log('fetchData not called yet. Current state -> User:', user, 'AuthLoading:', authLoading);
    }
  }, [user, authLoading, fetchData]);

  // Listing Actions
  const handleListingAction = async (id, status) => {
    try {
      setDataLoading(true); // Indicate action is in progress
      setError(null);
      setMessage(null);

      const res = await fetch(`/api/admin/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Үйлдлийг гүйцэтгэхэд алдаа гарлаа.'); // Mongolian: "Action failed"
      }

      // Optimistic UI update: Remove from pendingListings, update status in allListings
      setPendingListings(prev => prev.filter(l => l._id !== id));
      setAllListings(prev => prev.map(l =>
        l._id === id ? { ...l, status } : l
      ));

      setMessage(`Зар амжилттай ${status === 'approved' ? 'зөвшөөрөгдлөө' : 'татгалзлаа'}.`); // Mongolian: "Listing successfully approved/declined."
      // Optionally re-fetch data to ensure consistency, especially if not all listings are in `allListings`
      // fetchData(); // Uncomment if you want to re-fetch all data after action
    } catch (err) {
      console.error('Listing action error:', err);
      setError(err.message);
    } finally {
      setDataLoading(false);
    }
  };

  // User Deletion
  const handleDeleteUser = async (userId) => {
    if (!confirm('Энэ хэрэглэгчийг устгахыг баталгаажуулах уу? Энэ нь тэдний бүх зарыг устгана.')) return; // Mongolian: "Confirm user deletion? This will delete all their listings."

    try {
      setDataLoading(true);
      setError(null);
      setMessage(null);

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Хэрэглэгч устгахад алдаа гарлаа.'); // Mongolian: "Failed to delete user"
      }

      setUsers(prev => prev.filter(u => u._id !== userId));
      setAllListings(prev => prev.filter(l => l.owner?._id !== userId)); // Filter listings by owner ID
      setPendingListings(prev => prev.filter(l => l.owner?._id !== userId)); // Filter pending listings too

      setMessage('Хэрэглэгчийг амжилттай устгалаа.'); // Mongolian: "User deleted successfully."
    } catch (err) {
      console.error('User deletion error:', err);
      setError(err.message);
    } finally {
      setDataLoading(false);
    }
  };

  // Listing Deletion
  const handleDeleteListing = async (listingId) => {
    if (!confirm('Энэ зарыг устгахыг баталгаажуулах уу?')) return; // Mongolian: "Confirm listing deletion?"

    try {
      setDataLoading(true);
      setError(null);
      setMessage(null);

      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Зар устгахад алдаа гарлаа.'); // Mongolian: "Failed to delete listing"
      }

      setAllListings(prev => prev.filter(l => l._id !== listingId));
      setPendingListings(prev => prev.filter(l => l._id !== listingId));

      setMessage('Зарыг амжилттай устгалаа.'); // Mongolian: "Listing deleted successfully."
    } catch (err) {
      console.error('Listing deletion error:', err);
      setError(err.message);
    } finally {
      setDataLoading(false);
    }
  };

  // --- Render based on loading/error states ---
  if (authLoading) {
    return <div className="loading">Нэвтрэлт шалгаж байна...</div>; // Mongolian: "Checking authentication..."
  }
  if (!user) {
    return <div className="error">Та нэвтрэх эрхгүй байна.</div>; // Mongolian: "Not authorized"
  }
  // No separate dataLoading return here, let it be handled inside the main render
  // and display messages there. This allows partial content to show if some data is loaded.
  // if (dataLoading) { return <div className="loading">Мэдээлэл ачаалж байна...</div>; }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Админ Хяналтын Самбар</h1>
        <nav>
          <Link href="/" className="nav-link">Нүүр</Link>
          <button
            onClick={async () => {
              try {
                console.log('Attempting to log out...');
                await fetch('/api/auth/logout', { method: 'POST' });
                setUser(null);
                setError(null);
                setMessage(null);
                setAuthLoading(true);
                console.log('Logout successful. Redirecting to /login.');
                router.replace('/login');
              } catch (err) {
                console.error('Logout error:', err);
                alert('Гарахад алдаа гарлаа.');
              }
            }}
            className="logout-btn"
          >
            Гарах
          </button>
        </nav>
      </header>

      <main className="admin-main">
        {/* Global loading/error/message display */}
        {dataLoading && <div className="loading-overlay">Мэдээлэл ачаалж байна...</div>} {/* Overlay for ongoing data fetches */}
        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        <section className="admin-section">
          <h2>Хүлээгдэж буй зар</h2>
          <div className="status-filter">
            <button
              className={`filter-btn ${selectedStatus === 'pending' ? 'active' : ''}`}
              onClick={() => { setCurrentPage(1); setSelectedStatus('pending'); }}
            >
              Хүлээгдэж буй
            </button>
            <button
              className={`filter-btn ${selectedStatus === 'approved' ? 'active' : ''}`}
              onClick={() => { setCurrentPage(1); setSelectedStatus('approved'); }}
            >
              Зөвшөөрөгдсөн
            </button>
            <button
              className={`filter-btn ${selectedStatus === 'declined' ? 'active' : ''}`}
              onClick={() => { setCurrentPage(1); setSelectedStatus('declined'); }}
            >
              Татгалзсан
            </button>
          </div>

          {pendingListings.length === 0 ? (
            <p className="no-data">Ямар ч зар олдсонгүй</p>
          ) : (
            <div className="listings-grid">
              {pendingListings.map(listing => (
                <div key={listing._id} className="listing-card">
                  {listing.images && listing.images.length > 0 && (
                    <img src={listing.images[0]} alt={listing.title} className="listing-image" />
                  )}
                  <div className="listing-info">
                    <h3>{listing.title}</h3>
                    <p>Үнэ: {listing.price?.toLocaleString()}₮</p>
                    <p>Явсан км: {listing.km?.toLocaleString()}</p>
                    <p>Төрөл: {listing.type}</p>
                    <p>Статус: <span className={`status-badge status-${listing.status}`}>{listing.status}</span></p>
                    <p>Эзэмшигч: {listing.owner?.email || 'Мэдээлэлгүй'}</p>
                  </div>
                  <div className="listing-actions">
                    {listing.status === 'pending' && (
                      <>
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleListingAction(listing._id, 'approved')}
                          disabled={dataLoading} // Disable during action
                        >
                          Зөвшөөрөх
                        </button>
                        <button
                          className="action-btn reject-btn"
                          onClick={() => handleListingAction(listing._id, 'declined')}
                          disabled={dataLoading} // Disable during action
                        >
                          Татгалзах
                        </button>
                      </>
                    )}
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteListing(listing._id)}
                      disabled={dataLoading} // Disable during action
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || dataLoading}
                className="pagination-btn"
              >
                Өмнөх
              </button>
              <span>Хуудас {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || dataLoading}
                className="pagination-btn"
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
            <p className="no-data">Хэрэглэгч олдсонгүй</p>
          ) : (
            <div className="users-grid">
              {users.map(userItem => (
                <div key={userItem._id} className="user-card">
                  <div className="user-info">
                    <h3>{userItem.email}</h3>
                    <p>Эрх: <span className={`role-badge role-${userItem.role}`}>{userItem.role}</span></p>
                    <p>Бүртгүүлсэн: {new Date(userItem.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteUser(userItem._id)}
                    disabled={dataLoading || userItem.role === 'admin'} // Prevent deleting self or other admins
                  >
                    Устгах
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Listings Section */}
        <section className="admin-section">
          <h2>Бүх зар</h2>
          {allListings.length === 0 ? (
            <p className="no-data">Ямар ч зар олдсонгүй</p>
          ) : (
            <div className="listings-grid">
              {allListings.map(listing => (
                <div key={listing._id} className="listing-card">
                  {listing.images && listing.images.length > 0 && (
                    <img src={listing.images[0]} alt={listing.title} className="listing-image" />
                  )}
                  <div className="listing-info">
                    <h3>{listing.title}</h3>
                    <p>Статус: <span className={`status-badge status-${listing.status}`}>{listing.status}</span></p>
                    <p>Үнэ: {listing.price?.toLocaleString()}₮</p>
                    <p>Эзэмшигч: {listing.owner?.email || 'Мэдээлэлгүй'}</p>
                  </div>
                  <div className="listing-actions">
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteListing(listing._id)}
                      disabled={dataLoading}
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}