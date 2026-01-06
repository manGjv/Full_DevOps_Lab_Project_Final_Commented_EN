import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import Badge from "../components/Badge";
import Loader from "../components/Loader";
import {
  updateUser,
  getUserBadges,
  getUserProgress,
  deleteUser,
} from "../api/users.api";

export default function ProfilePage() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [badges, setBadges] = useState([]);
  const [progress, setProgress] = useState({ points: 0, hoursSpent: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch badges & progress (with refresh support)
  useEffect(() => {
    if (!user?.id) return;

    const fetchExtras = async () => {
      setLoading(true);
      try {
        const resProgress = await getUserProgress(user.id);
        setProgress(resProgress.data);

        const resBadges = await getUserBadges(user.id);
        setBadges(resBadges.data.badges || []);
      } catch (err) {
        console.error("Failed to fetch profile extras", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtras();
  }, [user?.id, refreshKey]); // Add refreshKey to dependencies

  // Refresh badges when returning to this page
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Save profile changes
  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await updateUser(user.id, {
        name: editName,
        email: editEmail,
      });

      const rawUser = res.data.user ?? res.data;

      const updatedUser = {
        ...user,
        id: rawUser.id || rawUser._id,
        name: rawUser.name,
        email: rawUser.email,
        points: rawUser.points ?? user.points,
        hoursSpent: rawUser.hoursSpent ?? user.hoursSpent,
        modulesCompleted: rawUser.modulesCompleted ?? user.modulesCompleted,
        badges: rawUser.badges ?? user.badges,
      };

      setUser(updatedUser);
      setIsEditing(false);

      // Refresh badges after profile update
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Do you really want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(user.id);
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  const formatTime = (hours) => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h === 0) {
      return `${m} min`;
    } else if (m === 0) {
      return `${h}h`;
    } else {
      return `${h}h ${m}min`;
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />

      <div className="profile-container">
        {/* HEADER */}
        <div className="profile-header">
          <div className="avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email"
                />
              </>
            ) : (
              <>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </>
            )}
          </div>

          <div className="edit-buttons">
            {isEditing ? (
              <>
                <button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        {/* STATS */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Points</h3>
            <p>{progress.points || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Hours Spent</h3>
            <p>{formatTime(progress.hoursSpent || 0)}</p>
          </div>
          <div className="stat-card">
            <h3>Modules Completed</h3>
            <p>{user.modulesCompleted || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Badges Earned</h3>
            <p>{badges.length}</p>
          </div>
        </div>

        {/* BADGES */}
        <div className="badges-section">
          <h3>🏆 Earned Badges ({badges.length})</h3>
          <div className="badges-container">
            {badges.length > 0 ? (
              badges.map((badge, i) => (
                <Badge key={i} badge={badge} />
              ))
            ) : (
              <div className="no-badges">
                <p>No badges earned yet.</p>
                <p className="hint">
                  Complete quizzes with 100% to earn badges!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DELETE ACCOUNT BUTTON */}
        <div style={{ marginTop: "30px" }}>
          <button
            className="delete-account-btn"
            style={{
              backgroundColor: "#d9363e",
              color: "white",
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={handleDeleteAccount}
          >
            Delete my account
          </button>
        </div>
      </div>
    </div>
  );
}
