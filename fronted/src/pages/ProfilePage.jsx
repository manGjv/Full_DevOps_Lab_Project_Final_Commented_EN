import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import Badge from "../components/Badge";
import Loader from "../components/Loader";
import {
  updateUser,
  getUserBadges,
  getUserProgress,
} from "../api/users.api";

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);

  const [badges, setBadges] = useState([]);
  const [progress, setProgress] = useState({ points: 0, hoursSpent: 0 });
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------
     Fetch badges & progress
  ---------------------------- */
  useEffect(() => {
    if (!user?.id) return;

    const fetchExtras = async () => {
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
  }, [user?.id]);

  /* ---------------------------
     Save profile changes
  ---------------------------- */
  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await updateUser(user.id, {
        name: editName,
        email: editEmail,
      });

      const rawUser = res.data.user ?? res.data;

      // 🔥 Normalisation du user
      const updatedUser = {
        ...user, // conserve token, role, etc.
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
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
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
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
                <button onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        {/* STATS */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Points</h3>
            <p>{progress.points}</p>
          </div>
          <div className="stat-card">
            <h3>Hours Spent</h3>
            <p>{progress.hoursSpent}</p>
          </div>
          <div className="stat-card">
            <h3>Modules Completed</h3>
            <p>{user.modulesCompleted}</p>
          </div>
        </div>

        {/* BADGES */}
        <div className="badges-section">
          <h3>Earned Badges</h3>
          <div className="badges-container">
            {badges.length > 0 ? (
              badges.map((b, i) => <Badge key={i} name={b} />)
            ) : (
              <p>No badges earned yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


