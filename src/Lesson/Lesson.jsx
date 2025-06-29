import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, BookOpen, Clock, Award, Play, Pause, RotateCcw, CheckCircle, ArrowRight, Lightbulb
} from 'lucide-react';

const Lesson = () => {
   const { moduleId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!moduleId) return;

    const fetchLessons = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/lessons/${moduleId}`);
        setLessons(res.data);
        setCurrentLessonIndex(0);
        setCurrentSection(0);
        setCompletedSections(new Set());
        setLoading(false);
      } catch (err) {
        setError('Failed to load lessons.');
        setLoading(false);
      }
    };

    fetchLessons();
  }, [moduleId]);

  useEffect(() => {
    if (isPlaying && progress < 100) {
      const timer = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.5, 100));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isPlaying, progress]);

  if (loading) return <div className="p-6 text-center">Loading lessons...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (lessons.length === 0) return <div className="p-6 text-center">No lessons available for this module.</div>;

  const lessonData = lessons[currentLessonIndex];

  if (!lessonData) return null;

  // Assume lessonData.sections is an array; if not, default empty array
  const sections = lessonData.sections || [];

  const currentSectionData = sections[currentSection] || {};

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCompletedSections(prev => new Set([...prev, currentSection]));
      setCurrentSection(prev => prev + 1);
    } else {
      setCompletedSections(prev => new Set([...prev, currentSection]));
      // Optionally go to next lesson
      if (currentLessonIndex < lessons.length - 1) {
        setCurrentLessonIndex(prev => prev + 1);
        setCurrentSection(0);
        setCompletedSections(new Set());
        setProgress(0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSectionClick = (index) => {
    setCurrentSection(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                <span className="text-sm font-medium text-gray-600">{lessonData.moduleTitle || 'Module'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <h1 className="text-xl font-bold text-gray-900">{lessonData.title}</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{lessonData.duration || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>{lessonData.difficulty || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Progress</h3>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round((completedSections.size / sections.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Section List */}
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => handleSectionClick(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      currentSection === index
                        ? 'bg-indigo-100 border-2 border-indigo-300 text-indigo-900'
                        : completedSections.has(index)
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {completedSections.has(index) ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            currentSection === index ? 'border-indigo-500 bg-indigo-100' : 'border-gray-300'
                          }`} />
                        )}
                        <div>
                          <div className="font-medium text-sm">{section.heading}</div>
                          <div className="text-xs opacity-70 capitalize">{section.type || ''}</div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Content Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{currentSectionData.heading || 'No section'}</h2>
                    <div className="flex items-center space-x-4 text-indigo-100">
                      <span className="text-sm capitalize bg-white/20 px-3 py-1 rounded-full">
                        {currentSectionData.type || ''}
                      </span>
                      <span className="text-sm">
                        Section {currentSection + 1} of {sections.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setProgress(0)}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Reading Progress */}
                <div className="mt-4">
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-white h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8">
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {currentSectionData.content || 'No content available.'}
                  </p>

                  {currentSectionData.codeExample && (
                    <div className="bg-gray-900 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-400">Code Example</span>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                        <code>{currentSectionData.codeExample}</code>
                      </pre>
                    </div>
                  )}

                  {/* Key Points */}
                  {currentSectionData.keyPoints && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                      <div className="flex items-center mb-3">
                        <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="text-lg font-semibold text-blue-900">Key Points</h4>
                      </div>
                      <ul className="space-y-2">
                        {currentSectionData.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start space-x-2 text-blue-800">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-gray-50 px-8 py-6 flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-2">
                  {sections.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentSection ? 'bg-indigo-500' :
                        completedSections.has(index) ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentSection === sections.length - 1 && completedSections.has(currentSection)}
                  className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span>{currentSection === sections.length - 1 ? 'Complete' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
