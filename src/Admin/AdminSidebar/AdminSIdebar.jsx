import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Users, 
  HelpCircle, 
  CreditCard,
  Puzzle
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'add-module', label: 'Add Module', icon: BookOpen, path: '/admin/add-module' },
    { id: 'add-lesson', label: 'Add Lesson', icon: GraduationCap, path: '/admin/add-lesson' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, path: '/admin/quiz' },
    { id: 'wordfinder', label: 'WordFinder', icon: Puzzle, path: '/admin/WordFinder' },
    { id: 'quiztable', label: 'QuizTable', icon: HelpCircle, path: '/admin/quiz' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r h-full">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      
      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
