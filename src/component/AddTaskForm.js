import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AddTaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = () => {
    if (!title.trim() || !description.trim()) {
      alert("Both Title and Description are required!");
      return;
    }

    onAddTask(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Add New Task</h5>
      </div>
      <div className="card-body">
        <form>
          <div className="mb-3">
            <label htmlFor="taskTitle" className="form-label">
              Task Title
            </label>
            <input
              type="text"
              id="taskTitle"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="taskDescription" className="form-label">
              Task Description
            </label>
            <textarea
              id="taskDescription"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            ></textarea>
          </div>
          <button
            type="button"
            className="btn btn-success w-30"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
