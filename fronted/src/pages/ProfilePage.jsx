import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Badge from "../components/Badge";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [badges, setBadges] = useState([]);
  const [progress, setProgress] = useState({ points: 0, hoursSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const resProgress = await api.get(`/users/${user.id}/progress`);
        setProgress(resProgress.data);

        const resBadges = await api.get(`/users/${user.id}/badges`);
        setBadges(resBadges.data.badges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExtras();
  }, [user.id]);

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

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

        <div className="badges-section">
          <h3>Earned Badges</h3>
          <div className="badges-container">
            {badges.length > 0 ? badges.map((b, i) => <Badge key={i} name={b} />) : <p>No badges earned yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
