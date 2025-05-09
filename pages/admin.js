import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '../public/admin.css'

export default function AdminPage() {
  const router = useRouter();
  // State for authentication
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Mock current user fetch (authentication)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Simulate API call delay
        await new Promise(res => setTimeout(res, 500));
        // Mock user data - replace with real auth check
        const userData = { role: 'admin', name: 'Admin User' }; 
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, []);
  
  // Redirect based on auth status
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login'); // Redirect to login if not logged in
      } else if (user.role !== 'admin') {
        router.replace('/403'); // Redirect if not an admin
      }
    }
  }, [user, authLoading]);

  // State for pending listings and users
  const [pendingListings, setPendingListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch mock data for listings and users once authenticated
  useEffect(() => {
    if (user && user.role === 'admin') {
      // Mock fetch for pending listings
      const fetchListings = async () => {
        setLoadingListings(true);
        try {
          await new Promise(res => setTimeout(res, 1000)); // Simulate delay
          const mockListings = [
            { id: 1, title: 'Cozy Cottage', description: 'A small cottage by the lake.' },
            { id: 2, title: 'Urban Apartment', description: 'Downtown apartment with city view.' },
          ];
          setPendingListings(mockListings);
        } catch (err) {
          console.error('Error fetching listings:', err);
        } finally {
          setLoadingListings(false);
        }
      };
      // Mock fetch for users
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          await new Promise(res => setTimeout(res, 1000)); // Simulate delay
          const mockUsers = [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          ];
          setUsers(mockUsers);
        } catch (err) {
          console.error('Error fetching users:', err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchListings();
      fetchUsers();
    }
  }, [user]);

  // Handlers for admin actions
  const handleApprove = (id) => {
    // TODO: Integrate API call to approve listing
    setPendingListings(prev => prev.filter(listing => listing.id !== id));
  };
  const handleReject = (id) => {
    // TODO: Integrate API call to reject listing
    setPendingListings(prev => prev.filter(listing => listing.id !== id));
  };
  const handleDeleteUser = (id) => {
    // TODO: Integrate API call to delete user
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Loading or unauthorized state
  if (authLoading) {
    return <div>Loading...</div>;
  }
  if (!user || user.role !== 'admin') {
    return null; // Redirecting...
  }

  return (
    <div className="container mx-auto p-4">
      {/* Page Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        {/* Navigation links (if any) */}
        <nav aria-label="Admin navigation">
          <Link href="/" className="px-3 text-blue-500">Home</Link>
          <Link href="/profile" className="px-3 text-blue-500">Profile</Link>
          <Link href="/logout" className="px-3 text-blue-500">Logout</Link>
        </nav>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Listings Section */}
        <section className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Pending Listings</h2>
          {loadingListings ? (
            <p>Loading listings...</p>
          ) : (
            <>
              {pendingListings.length === 0 ? (
                <p>No pending listings.</p>
              ) : (
                pendingListings.map(listing => (
                  <div key={listing.id} className="mb-4 p-4 border rounded">
                    <h3 className="text-lg font-medium">{listing.title}</h3>
                    <p className="text-gray-700">{listing.description}</p>
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleApprove(listing.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        aria-label={`Approve listing ${listing.title}`}>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(listing.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        aria-label={`Reject listing ${listing.title}`}>
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </section>

        {/* Users Management Section */}
        <section className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Users Management</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <>
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                users.map(u => (
                  <div key={u.id} className="mb-4 p-4 border rounded flex justify-between items-center">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-gray-500 text-sm">{u.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      aria-label={`Delete user ${u.name}`}>Delete
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}