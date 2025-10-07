import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { toastErrorNotify } from "../helpers/ToastNotify";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = localStorage.getItem("role");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) navigate("/login");
    else {
      setAuthToken(token);
      fetchProjects();
    }
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      toastErrorNotify("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <div className="text-gray-700 dark:text-gray-200">
            Welcome, {user.firstName || user.email} ({role})
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Projects
            </h2>
            {(role === "Admin" || role === "Manager") && (
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() => toastErrorNotify("Create Project modal here")}
              >
                + New Project
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-gray-700 dark:text-gray-300">Loading projects...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="p-4 rounded shadow bg-white dark:bg-gray-800"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {project.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Team: {project.teamName || "N/A"}
                  </p>
                  <div className="flex justify-end gap-2">
                    {(role === "Admin" || role === "Manager") && (
                      <button className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
                        Edit
                      </button>
                    )}
                    {role === "Admin" && (
                      <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Chat Preview */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Team Chat
            </h2>
            <Link
              to="/messages"
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Open Chat
            </Link>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Click "Open Chat" to view team messages in real-time.
          </p>
        </div>

        {/* Team Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Team Overview
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Members, roles, and activity logs will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
