import React, { useState } from 'react';
import { ChevronRight, BookOpen, Clock, Users, Star, Play } from 'lucide-react';

const ModuleCard = ({ module, onGoToModule }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-gray-100 ${isHovered ? 'ring-2 ring-blue-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          module.status === 'completed' ? 'bg-green-100 text-green-800' :
          module.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {module.status === 'completed' ? 'Completed' :
           module.status === 'in-progress' ? 'In Progress' : 'Not Started'}
        </span>
      </div>

      {/* Header with gradient background */}
      <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">{module.category}</span>
          </div>
        </div>
        
        {/* Animated background pattern */}
        <div className={`absolute inset-0 opacity-20 transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-white rounded-full translate-x-8 translate-y-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {module.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {module.description}
        </p>

        {/* Module Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{module.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{module.enrolled} enrolled</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{module.rating}</span>
          </div>
        </div>

        {/* Progress Bar (if in progress) */}
        {module.status === 'in-progress' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{module.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Go to Module Button */}
        <button
          onClick={() => onGoToModule(module)}
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group ${isHovered ? 'shadow-lg' : ''}`}
        >
          <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>
            {module.status === 'completed' ? 'Review Module' :
             module.status === 'in-progress' ? 'Continue Learning' : 'Start Module'}
          </span>
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
        </button>
      </div>

      {/* Hover overlay effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

export default function ModuleSection() {
  const [modules] = useState([
    {
      id: 1,
      title: "Introduction to React Fundamentals",
      description: "Learn the core concepts of React including components, JSX, props, and state management. Perfect for beginners starting their React journey.",
      category: "Frontend Development",
      duration: "4 weeks",
      enrolled: 1250,
      rating: 4.8,
      status: "not-started",
      progress: 0
    },
    {
      id: 2,
      title: "Advanced JavaScript Patterns",
      description: "Master advanced JavaScript concepts including closures, prototypes, async/await, and modern ES6+ features for professional development.",
      category: "Programming",
      duration: "6 weeks",
      enrolled: 890,
      rating: 4.9,
      status: "in-progress",
      progress: 65
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      description: "Discover the fundamentals of user interface and user experience design, including color theory, typography, and user research methods.",
      category: "Design",
      duration: "3 weeks",
      enrolled: 2100,
      rating: 4.7,
      status: "completed",
      progress: 100
    },
    {
      id: 4,
      title: "Node.js Backend Development",
      description: "Build scalable backend applications with Node.js, Express, and MongoDB. Learn API development and database integration.",
      category: "Backend Development",
      duration: "8 weeks",
      enrolled: 675,
      rating: 4.6,
      status: "not-started",
      progress: 0
    },
    {
      id: 5,
      title: "Data Structures & Algorithms",
      description: "Master essential computer science concepts including arrays, linked lists, trees, graphs, and algorithmic problem-solving techniques.",
      category: "Computer Science",
      duration: "10 weeks",
      enrolled: 1450,
      rating: 4.8,
      status: "in-progress",
      progress: 30
    },
    {
      id: 6,
      title: "Mobile App Development with React Native",
      description: "Create cross-platform mobile applications using React Native. Learn navigation, state management, and native device integration.",
      category: "Mobile Development",
      duration: "7 weeks",
      enrolled: 820,
      rating: 4.5,
      status: "not-started",
      progress: 0
    }
  ]);

  const handleGoToModule = (module) => {
    console.log('Navigating to module:', module.title);
    // Add your navigation logic here
    alert(`Opening module: ${module.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learning Modules
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive collection of interactive learning modules designed to enhance your skills and advance your career.
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              onGoToModule={handleGoToModule}
            />
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-12">
          <button className="bg-white text-gray-700 font-semibold py-3 px-8 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Load More Modules
          </button>
        </div>
      </div>
    </div>
  );
}

