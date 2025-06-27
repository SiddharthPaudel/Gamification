import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Student", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Instructor", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Student", status: "Inactive" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "Admin", status: "Active" },
    { id: 5, name: "Tom Brown", email: "tom@example.com", role: "Student", status: "Active" },
    { id: 6, name: "Lisa Davis", email: "lisa@example.com", role: "Instructor", status: "Active" }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
    alert(`Edit user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleAddUser = () => {
    console.log('Add new user');
    alert('Add new user functionality');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Users Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>
          <button 
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'Instructor' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-3">
                  <button 
                    onClick={() => handleEdit(user.id)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;