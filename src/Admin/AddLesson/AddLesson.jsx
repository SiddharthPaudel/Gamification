import React, { useState } from 'react';

const AddLesson = () => {
  const [lessonData, setLessonData] = useState({
    title: '',
    module: 'React Fundamentals',
    content: '',
    duration: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Lesson data:', lessonData);
    // Here you would typically send the data to your backend
    alert('Lesson created successfully!');
    setLessonData({
      title: '',
      module: 'React Fundamentals',
      content: '',
      duration: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-6">Add New Lesson</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
          <input 
            type="text" 
            name="title"
            value={lessonData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Enter lesson title" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Module</label>
          <select 
            name="module"
            value={lessonData.module}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="React Fundamentals">React Fundamentals</option>
            <option value="JavaScript Basics">JavaScript Basics</option>
            <option value="CSS Styling">CSS Styling</option>
            <option value="Node.js Backend">Node.js Backend</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Content</label>
          <textarea 
            name="content"
            value={lessonData.content}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            rows="6" 
            placeholder="Enter lesson content"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
          <input 
            type="number" 
            name="duration"
            value={lessonData.duration}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="30" 
          />
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Lesson
        </button>
      </div>
    </div>
  );
};

export default AddLesson;