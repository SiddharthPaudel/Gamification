import React, { useEffect, useState } from 'react';
import { ChevronRight, BookOpen, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import OwlMascot from '../OwlMascot/OwlMascot';
const ModuleCard = ({ module, onGoToModule }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-gray-100 ${
        isHovered ? 'ring-2 ring-blue-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          {module.category || 'General'}
        </span>
      </div>

      {/* Header */}
      <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">{module.category || 'General'}</span>
          </div>
        </div>

        <div
          className={`absolute inset-0 opacity-20 transition-transform duration-700 pointer-events-none ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        >
          <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-white rounded-full translate-x-8 translate-y-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{module.title}</h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{module.description}</p>

        {module.status === 'in-progress' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{module.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${module.progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          onClick={() => onGoToModule(module)}
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group ${
            isHovered ? 'shadow-lg' : ''
          }`}
        >
          <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>
            {module.status === 'completed'
              ? 'Review Module'
              : module.status === 'in-progress'
              ? 'Continue Learning'
              : 'Start Module'}
          </span>
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
          />
        </button>
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
    </div>
  );
};

export default function ModuleSection() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/modules/get-all-module', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch modules');

        setModules(data.modules || []);
      } catch (err) {
        toast.error(err.message);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleGoToModule = (module) => {
    navigate(`/lesson/${module._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 ">
            <OwlMascot
  message="Explore modules and boost your knowledge!🚀"
  position="absolute"
  positionProps={{ top: 100, left: 30 }}
  
/>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Modules</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive collection of interactive learning modules designed to
            enhance your skills and advance your career.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading modules...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.length > 0 ? (
              modules.map((module) => (
                <ModuleCard key={module._id} module={module} onGoToModule={handleGoToModule} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600">
                No modules available. Add some modules first.
              </div>
            )}
          </div>
        )}
      </div>
    

    </div>
  );
}
