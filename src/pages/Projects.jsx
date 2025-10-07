import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { toastErrorNotify, toastSuccessNotify } from "../helpers/ToastNotify";
import { Dialog } from "@headlessui/react"; // For modal popup

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [editingProject, setEditingProject] = useState(null);

  const token = localStorage.getItem("token");
  if (token) setAuthToken(token);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      toastErrorNotify(err.response?.data?.error || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEdit = async () => {
    if (!projectName.trim()) {
      toastErrorNotify("Project name cannot be empty");
      return;
    }

    try {
      if (editingProject) {
        // Update project
        const res = await api.put(`/projects/${editingProject._id}`, {
          name: projectName,
        });
        toastSuccessNotify("Project updated successfully");
      } else {
        // Create new project
        const res = await api.post("/projects", { name: projectName });
        toastSuccessNotify("Project created successfully");
      }
      fetchProjects();
      setProjectName("");
      setEditingProject(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toastErrorNotify(err.response?.data?.error || "Operation failed");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      toastSuccessNotify("Project deleted successfully");
      fetchProjects();
    } catch (err) {
      console.error(err);
      toastErrorNotify(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Projects
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            + Add Project
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
              >
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {project.name}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <Dialog.Panel className="bg-white dark:bg-gray-800 rounded p-6 w-96">
            <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              {editingProject ? "Edit Project" : "Add Project"}
            </Dialog.Title>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Project Name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEdit}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                {editingProject ? "Update" : "Add"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Projects;
