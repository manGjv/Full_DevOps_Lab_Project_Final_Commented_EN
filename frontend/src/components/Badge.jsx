import "../styles/badge.css";

export default function Badge({ badge }) {
  // Handle both old format (string) and new format (object)
  const badgeName = typeof badge === 'string' ? badge : badge?.quizTitle;
  const earnedDate = badge?.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : null;
  
  return (
    <div className="badge">
      <div className="badge-icon">🏆</div>
      <div className="badge-content">
        <h4 className="badge-title">{badgeName}</h4>
        {earnedDate && <p className="badge-date">Earned: {earnedDate}</p>}
      </div>
    </div>
  );
}
