import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, BookOpen, HelpCircle, FileText } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Users",
      value: stats?.totalUsers || 0,
      icon: <Users className="w-5 h-5" />,
      change: "+12%",
    },
    {
      label: "Modules",
      value: stats?.totalModules || 0,
      icon: <BookOpen className="w-5 h-5" />,
      change: "+8%",
    },
    {
      label: "Quizzes",
      value: stats?.totalQuizzes || 0,
      icon: <HelpCircle className="w-5 h-5" />,
      change: "+15%",
    },
    {
      label: "Flashcards",
      value: stats?.totalFlashcards || 0,
      icon: <FileText className="w-5 h-5" />,
      change: "+23%",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your platform metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.label}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {card.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default AdminDashboard;