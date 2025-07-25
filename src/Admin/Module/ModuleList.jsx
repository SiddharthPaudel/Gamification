import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ModuleList = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModules = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/modules/get-all-module');
      console.log("Modules API response:", res.data);
      const modulesData = Array.isArray(res.data) ? res.data : (res.data.modules || []);
      setModules(modulesData);
    } catch (err) {
      setError('Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this module?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/modules/delete-module/${id}`);

      setModules(modules.filter((mod) => mod._id !== id));
    } catch (err) {
      alert('Failed to delete module');
    }
  };

  if (loading) return <p className="p-4 text-center">Loading modules...</p>;
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modules</h1>
      {modules.length === 0 ? (
        <p>No modules found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-md overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b text-left">Title</th>
              <th className="p-3 border-b text-left">Category</th>
              <th className="p-3 border-b text-left">Difficulty</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mod, index) => (
              <tr
                key={mod._id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
              >
                <td className="p-3 border-b">{mod.title}</td>
                <td className="p-3 border-b">{mod.category}</td>
                <td className="p-3 border-b">{mod.difficulty}</td>
                <td className="p-3 border-b text-center">
                  <button
                    onClick={() => handleDelete(mod._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    title="Delete Module"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
       
  
    </div>
  );
};

export default ModuleList;
