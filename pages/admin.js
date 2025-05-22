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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null); // Keep error state at the end or where you prefer

  // --- Initial Render State Log ---
  console.log('--- Current Render State (Initial) ---');
  console.log('User:', user);
  console.log('Auth Loading:', authLoading);
  console.log('Data Loading:', dataLoading);
  console.log('Error:', error);
  console.log('Pending Listings:', pendingListings.length);
  console.log('All Listings:', allListings.length);
  console.log('Users:', users.length);
  console.log('------------------------------------');

  // Authentication Check (already good, just including for completeness)
  const checkCustomAuth = useCallback(async () => {
    console.log('checkCustomAuth initiated...');
    setAuthLoading(true);
    setError(null);

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
        console.log('Auth successful! User set:', data.user.email);
      } else {
        console.log(`User ${data.user?.email} is not an admin (${data.user?.role || 'no role'}).`);
        setError('Not authorized: You do not have admin privileges.');
        setUser(null);
        router.replace('/login');
      }
    } catch (err) {
      console.error('Auth error (in checkCustomAuth):', err);
      setError('Authentication check failed: ' + err.message);
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
    // Corrected: Removed `dataLoading` from the dependency array, but kept the check inside.
    // The check `if (!user || dataLoading)` correctly prevents re-entry while loading.
    // `dataLoading` doesn't need to be in the dependency array because it's set and reset within this function.
    if (!user || dataLoading) { // Keep this check inside
      console.log('fetchData skipped: user or dataLoading status:', user, dataLoading);
      return;
    }

    try {
      setDataLoading(true); // Set loading true at the start
      setError(null); // Clear any previous data errors
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

      if (!listingsRes.ok) throw new Error(`Failed to load listings: ${listingsRes.status} ${listingsRes.statusText}`);
      if (!usersRes.ok) throw new Error(`Failed to load users: ${usersRes.status} ${usersRes.statusText}`);
      if (!allListingsRes.ok) throw new Error(`Failed to load all listings: ${allListingsRes.status} ${allListingsRes.statusText}`);

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

    } catch (err) {
      console.error('Fetch error in fetchData:', err);
      setError('Failed to load admin data: ' + err.message);
    } finally {
      setDataLoading(false); // Set loading false after fetch completes or errors
      console.log('Data fetch process finished. dataLoading set to false.');
    }
  }, [user, selectedStatus, currentPage]); // <-- REMOVED dataLoading from dependencies

  // Effect to trigger data fetching after user is authenticated
  useEffect(() => {
    if (user && !authLoading) {
      console.log('User is authenticated, authLoading is false. Calling fetchData...');
      fetchData();
    } else {
      console.log('fetchData not called yet. Current state -> User:', user, 'AuthLoading:', authLoading);
    }
  }, [user, authLoading, fetchData]); // Dependencies: user, authLoading, fetchData


  // Render based on loading/error states
  if (authLoading) {
    console.log('Rendering: Checking authentication...');
    return <div className="loading">Checking authentication...</div>;
  }
  if (!user) {
    console.log('Rendering: Not authorized (user is null).');
    return <div className="error">Not authorized. Please log in as an administrator.</div>;
  }
  if (error) {
    console.log('Rendering: Error state:', error);
    return <div className="error">Error: {error}</div>;
  }
  if (dataLoading) {
    console.log('Rendering: Loading data...');
    return <div className="loading">Loading data...</div>;
  }

  // Listing Actions (no changes needed)
  const handleListingAction = async (id, status) => { /* ... */ };
  const handleDeleteUser = async (userId) => { /* ... */ };
  const handleDeleteListing = async (listingId) => { /* ... */ };


  // Main Render (no changes needed)
  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Админ Хяналтын Самбар</h1>
        <nav>
          <Link href="/">Нүүр</Link>
          <button onClick={async () => {
            try {
              console.log('Attempting to log out...');
              await fetch('/api/auth/logout', { method: 'POST' });
              setUser(null);
              setError(null);
              setAuthLoading(true);
              console.log('Logout successful. Redirecting to /login.');
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