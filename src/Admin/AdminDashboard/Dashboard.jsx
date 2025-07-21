import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, BookOpen, HelpCircle, FileText } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="text-center py-8">Loading dashboard stats...</p>;

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Total Modules",
      value: stats.totalModules,
      icon: <BookOpen className="w-8 h-8 text-green-500" />,
      color: "from-green-400 to-green-600",
    },
    {
      label: "Total Quizzes",
      value: stats.totalQuizzes,
      icon: <HelpCircle className="w-8 h-8 text-purple-500" />,
      color: "from-purple-400 to-purple-600",
    },
    {
      label: "Total Flashcards",
      value: stats.totalFlashcards,
      icon: <FileText className="w-8 h-8 text-pink-500" />,
      color: "from-pink-400 to-pink-600",
    },
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition flex flex-col items-center justify-center text-center"
        >
          <div className="mb-4">{card.icon}</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{card.label}</h3>
          <p
            className={`text-4xl font-extrabold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
