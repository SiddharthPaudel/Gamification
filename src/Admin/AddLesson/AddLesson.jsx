import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddLesson = () => {
  const [modules, setModules] = useState([]);
  const [lessonData, setLessonData] = useState({
    title: '',
    order: '',
    moduleId: '',
    sections: [{ title: '', content: '' }]
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/modules/get-all-module');
        const fetchedModules = res.data.modules || [];
        setModules(fetchedModules);
        if (fetchedModules.length > 0) {
          setLessonData(prev => ({ ...prev, moduleId: fetchedModules[0]._id }));
        }
      } catch (error) {
        console.error('Failed to fetch modules:', error);
        toast.error('Failed to load modules');
      }
    };

    fetchModules();
  }, []);

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSections = [...lessonData.sections];
    updatedSections[index][name] = value;
    setLessonData(prev => ({ ...prev, sections: updatedSections }));
  };

  const addSection = () => {
    setLessonData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '' }]
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/lessons/${lessonData.moduleId}`,
        {
          title: lessonData.title,
          order: parseInt(lessonData.order),
          sections: lessonData.sections
        }
      );
      toast.success('Lesson created successfully!');
      setLessonData({
        title: '',
        order: '',
        moduleId: modules[0]?._id || '',
        sections: [{ title: '', content: '' }]
      });
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Failed to create lesson.');
    }
  };

  return (
    <>
     
      <div className="bg-white p-6 rounded-lg shadow border max-w-3xl mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-6">Add New Lesson</h2>

        <div className="space-y-4">
          <input
            name="title"
            value={lessonData.title}
            onChange={handleLessonChange}
            className="w-full p-3 border rounded"
            placeholder="Lesson Title"
          />
          <input
            name="order"
            type="number"
            value={lessonData.order}
            onChange={handleLessonChange}
            className="w-full p-3 border rounded"
            placeholder="Lesson Order (e.g. 1)"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Module</label>
            <select
              name="moduleId"
              value={lessonData.moduleId}
              onChange={handleLessonChange}
              className="w-full p-3 border border-gray-300 rounded"
            >
              {Array.isArray(modules) && modules.length > 0 ? (
                modules.map((mod) => (
                  <option key={mod._id} value={mod._id}>
                    {mod.title}
                  </option>
                ))
              ) : (
                <option value="">No modules available</option>
              )}
            </select>
          </div>

          <h3 className="text-lg font-medium mt-4">Sections</h3>
          {lessonData.sections.map((section, idx) => (
            <div key={idx} className="p-4 border rounded space-y-2">
              <input
                name="title"
                value={section.title}
                onChange={(e) => handleSectionChange(idx, e)}
                className="w-full p-2 border rounded"
                placeholder={`Section ${idx + 1} Title`}
              />
              <textarea
                name="content"
                value={section.content}
                onChange={(e) => handleSectionChange(idx, e)}
                className="w-full p-2 border rounded"
                placeholder="Section Content"
                rows="4"
              ></textarea>
            </div>
          ))}

          <button
            onClick={addSection}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Add Another Section
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Create Lesson
          </button>
        </div>
      </div>
    </>
  );
};

export default AddLesson;
  