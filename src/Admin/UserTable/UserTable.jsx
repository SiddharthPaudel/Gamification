import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/get-all-users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4 border-b font-semibold text-gray-700">Name</th>
              <th className="p-4 border-b font-semibold text-gray-700">Email</th>
              <th className="p-4 border-b font-semibold text-gray-700">Level</th>
              <th className="p-4 border-b font-semibold text-gray-700">XP</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`hover:bg-gray-100 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-4 border-b">{user.name}</td>
                <td className="p-4 border-b">{user.email}</td>
                <td className="p-4 border-b">{user.level}</td>
                <td className="p-4 border-b">{user.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
