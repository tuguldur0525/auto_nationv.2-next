import Head from "next/head"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Header from "components/header"
import Footer from "components/footer"
import "../public/profile.css"
import Chatbot from "components/Chatbot"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personal-info")
  const [myAds, setMyAds] = useState([])

  // Function to fetch user data
  async function fetchUserData() {
    let storedUser = null
    try {
      if (typeof window !== "undefined") {
        const userString = localStorage.getItem("currentUser")
        storedUser = userString ? JSON.parse(userString) : null
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error)
    }
    return storedUser
  }

  // Function to handle logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
      router.push("/login")
    }
  }

  useEffect(() => {
    ;(async () => {
      const user = await fetchUserData()
      if (!user) {
        router.replace("/login")
        return
      }
      setUserData(user)
      setLoading(false)

      fetch(`/api/cars?owner=${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          setMyAds(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    })()
  }, [router])

  // Loading state
  if (loading) {
    return (
      <div className="loading-indicator" role="status" aria-live="polite">
        <progress aria-label="Loading user data" />
        <p>Loading your profile...</p>
      </div>
    )
  }

  // If not authenticated (userData still null), do not render content
  if (!userData) {
    return null
  }

  // Extract first name for greeting
  const firstName = userData.name ? userData.name.split(" ")[0] : ""

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
              <img
                src={userData.avatar || "/images/3_avatar-512.webp"}
                alt="Profile"
              />
            </div>
            <div className="profile-info">
              <h1>{firstName || "Хэрэглэгч"}</h1>
              <p>
                <i className="fa fa-map-marker"></i>{" "}
                {userData.address || "Улаанбаатар, Монгол"}
              </p>
            </div>
            <button
              className="edit-profile-btn"
              onClick={() => setActiveTab("personal-info")}
            >
              <i className="fa fa-pencil"></i> Профайл засах
            </button>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button
              onClick={() => setActiveTab("personal-info")}
              className={`tab-btn ${
                activeTab === "personal-info" ? "active" : ""
              }`}
            >
              Хувийн мэдээлэл
            </button>
            <button
              onClick={() => setActiveTab("my-listings")}
              className={`tab-btn ${
                activeTab === "my-listings" ? "active" : ""
              }`}
            >
              Миний зарууд
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            >
              Тохиргоо
            </button>
          </div>

          <div className="tab-contents">
            {/* PERSONAL INFO */}
            {activeTab === "personal-info" && (
              <div className="tab-content active">
                <h2>
                  <i className="fa fa-user"></i> Хувийн мэдээлэл
                </h2>
                <ul>
                  <li>
                    <strong>Овог:</strong>{" "}
                    {userData.name ? userData.name.split(" ")[0] : "-"}
                  </li>
                  <li>
                    <strong>Нэр:</strong>{" "}
                    {userData.name
                      ? userData.name.split(" ").slice(1).join(" ")
                      : "-"}
                  </li>
                  <li>
                    <strong>Имэйл:</strong> {userData.email || "-"}
                  </li>
                  <li>
                    <strong>Утас:</strong> {userData.phone || "-"}
                  </li>
                </ul>
              </div>
            )}

            {/* MY LISTINGS */}
            {activeTab === "my-listings" && (
              <div className="tab-content active">
                <h2>
                  <i className="fa fa-car"></i> Миний зарууд
                </h2>
                {userData && (
                  <div style={{ marginBottom: 24 }}>
                    <strong>Нэр:</strong> {userData.name}
                    <br />
                    <strong>Email:</strong> {userData.email}
                  </div>
                )}
                {myAds.length === 0 ? (
                  <p>Танд оруулсан зар алга байна.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {myAds.map((ad) => (
                      <li
                        key={ad._id}
                        style={{
                          border: "1px solid #eee",
                          borderRadius: 8,
                          marginBottom: 16,
                          padding: 16,
                        }}
                      >
                        <strong>{ad.title}</strong> - {ad.price}₮<br />
                        {ad.images && ad.images.length > 0 && (
                          <img
                            src={ad.images[0]}
                            alt={ad.title}
                            width={180}
                            style={{ marginTop: 8, borderRadius: 8 }}
                          />
                        )}
                        <div style={{ marginTop: 8 }}>
                          <span>Үйлдвэрлэсэн он: {ad.details?.modelYear}</span>
                          <br />
                          <span>Түлш: {ad.fuel}</span> |{" "}
                          <span>Төрөл: {ad.type}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="tab-content active">
                <h2>
                  <i className="fa fa-cog"></i> Тохиргоо
                </h2>
                <form
                  className="settings-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    localStorage.setItem(
                      "currentUser",
                      JSON.stringify(userData)
                    )
                    alert("Profile updated successfully!")
                  }}
                >
                  <label>
                    Нэр:
                    <input
                      type="text"
                      value={userData.name || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Имэйл:
                    <input
                      type="email"
                      value={userData.email || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Утас:
                    <input
                      type="tel"
                      value={userData.phone || ""}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Нууц үг:
                    <input type="password" placeholder="Шинэ нууц үг" />
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
          <button onClick={handleLogout} className="logout-btn">
            <i className="fa fa-sign-out"></i> Гарах
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <Chatbot />
    </>
  )
}
