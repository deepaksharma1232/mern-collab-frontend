import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { toastErrorNotify, toastSuccessNotify } from "../helpers/ToastNotify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Session check
  useEffect(() => {
    if (!token) navigate("/login");
    else setAuthToken(token);
  }, [token]);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // Task statuses (columns)
  const statuses = ["To Do", "In Progress", "Done"];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data); // Array of tasks with fields: _id, title, status, assignee
    } catch (err) {
      console.error(err);
      toastErrorNotify(err.response?.data?.error || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEdit = async () => {
    if (!newTaskTitle.trim()) {
      toastErrorNotify("Task title cannot be empty");
      return;
    }

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, {
          title: newTaskTitle,
          assignee: newTaskAssignee,
        });
        toastSuccessNotify("Task updated successfully");
      } else {
        await api.post("/tasks", {
          title: newTaskTitle,
          assignee: newTaskAssignee,
          status: "To Do",
        });
        toastSuccessNotify("Task created successfully");
      }
      fetchTasks();
      setNewTaskTitle("");
      setNewTaskAssignee("");
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      toastErrorNotify(err.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toastSuccessNotify("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      console.error(err);
      toastErrorNotify(err.response?.data?.error || "Delete failed");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    try {
      await api.put(`/tasks/${task._id}`, { status: destination.droppableId });
      fetchTasks();
    } catch (err) {
      console.error(err);
      toastErrorNotify("Failed to update task status");
    }
  };

  const tasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Tasks Kanban
        </h2>

        {/* Add Task */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
          <input
            type="text"
            placeholder="Assignee"
            value={newTaskAssignee}
            onChange={(e) => setNewTaskAssignee(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
          <button
            onClick={handleAddOrEdit}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {statuses.map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-white dark:bg-gray-800 p-4 rounded shadow min-h-[300px]"
                    >
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        {status}
                      </h3>
                      {tasksByStatus(status).map((task, index) => (
                        <Draggable
                          draggableId={task._id}
                          index={index}
                          key={task._id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-100">
                                  {task.title}
                                </p>
                                <span className="text-sm text-gray-500 dark:text-gray-300">
                                  {task.assignee}
                                </span>
                              </div>
                              <div className="space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingTask(task);
                                    setNewTaskTitle(task.title);
                                    setNewTaskAssignee(task.assignee);
                                  }}
                                  className="text-blue-500 hover:underline text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(task._id)}
                                  className="text-red-500 hover:underline text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default Tasks;
