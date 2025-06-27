import React, { useState } from 'react';

const AddModule = () => {
  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    difficulty: 'Beginner'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModuleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Module data:', moduleData);
    // Here you would typically send the data to your backend
    alert('Module created successfully!');
    setModuleData({
      title: '',
      description: '',
      category: 'Programming',
      difficulty: 'Beginner'
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-6">Add New Module</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
          <input 
            type="text" 
            name="title"
            value={moduleData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Enter module title" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            name="description"
            value={moduleData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            rows="4" 
            placeholder="Enter module description"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select 
            name="category"
            value={moduleData.category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Business">Business</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
          <select 
            name="difficulty"
            value={moduleData.difficulty}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Module
        </button>
      </div>
    </div>
  );
};

export default AddModule;