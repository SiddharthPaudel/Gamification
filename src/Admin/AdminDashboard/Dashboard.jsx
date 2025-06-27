import React from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award,
  User
} from 'lucide-react';

const Dashboard = () => {
  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value="2,847" 
          change="+12%" 
          icon={Users} 
          color="blue"
        />
        <StatCard 
          title="Active Modules" 
          value="24" 
          change="+3%" 
          icon={BookOpen} 
          color="green"
        />
        <StatCard 
          title="Completed Lessons" 
          value="1,429" 
          change="+8%" 
          icon={GraduationCap} 
          color="purple"
        />
        <StatCard 
          title="Quiz Attempts" 
          value="5,293" 
          change="+15%" 
          icon={Award} 
          color="orange"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { user: "John Doe", action: "completed lesson", item: "React Basics" },
              { user: "Jane Smith", action: "started quiz", item: "JavaScript Fundamentals" },
              { user: "Mike Johnson", action: "created flashcard", item: "CSS Properties" },
              { user: "Sarah Wilson", action: "joined module", item: "Advanced React" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium text-blue-600">{activity.item}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Module Completion Rate</span>
                <span>87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Quiz Success Rate</span>
                <span>73%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '73%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>User Engagement</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;