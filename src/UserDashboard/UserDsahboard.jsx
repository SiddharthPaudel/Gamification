import DashboardHeader from '../DashboardHeader/DashboardHeader';
import StatsAndProgress from '../StatsAndProgress/StatsAndProgress';
import BadgesAndMotivation from '../BadgesAndMotivation/BadgesAndMotivation.jsx';
const UserDashboard = () => {
  const userData = {
    name: "Alex Johnson",
    email: "alex@example.com",
    xp: 2450,
    level: 8,
    badges: ["First Quiz", "Speed Learner", "Code Master", "Flashcard Pro", "Problem Solver"],
    gameProgress: {
      quiz: { totalPlayed: 45, totalCorrect: 38, highScore: 95 },
      flashcards: { totalPlayed: 120, totalCorrect: 98 },
      codePuzzles: { totalCompleted: 23, correctFirstTry: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader userData={userData} />
        <StatsAndProgress userData={userData} />
        <BadgesAndMotivation badges={userData.badges} />
      </div>
    </div>
  );
};

export default UserDashboard;