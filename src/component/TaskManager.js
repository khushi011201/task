import React, { useState, useEffect } from "react";
import { ReactTabulator } from "react-tabulator";
import AddTaskForm from "./AddTaskForm";
import "react-tabulator/lib/styles.css";
import "react-tabulator/css/tabulator_bootstrap5.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        const mappedTasks = data.slice(0, 20).map((task) => ({
          id: task.id,
          title: task.title,
          description: `Task Description ${task.id}`,
          status: task.completed ? "Done" : "To Do",
        }));
        setTasks(mappedTasks);
      });
  }, []);

  const addTask = (title, description) => {
    const newTask = {
      id: tasks.length + 1,
      title,
      description,
      status: "To Do",
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully!");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    toast.success("Task status updated!");
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterStatus ? task.status === filterStatus : true) &&
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const taskCounts = {
    total: tasks.length,
    toDo: tasks.filter((task) => task.status === "To Do").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    done: tasks.filter((task) => task.status === "Done").length,
  };

  const columns = [
    { title: "Task ID", field: "id", width: 70, headerSort: false, hozAlign: "center" },
    { title: "Title", field: "title", editor: "input", widthGrow: 2 },
    { title: "Description", field: "description", editor: "input", widthGrow: 3 },
    {
      title: "Status",
      field: "status",
      editor: "select",
      editorParams: { values: ["To Do", "In Progress", "Done"] },
      width: 150,
      hozAlign: "center",
    },
    {
      title: "Actions",
      formatter: () => `<button class="btn btn-danger btn-sm">Delete</button>`,
      cellClick: (e, cell) => deleteTask(cell.getRow().getData().id),
      hozAlign: "center",
      width: 120,
    },
  ];

  const handleCellEdited = (cell) => {
    const newStatus = cell.getValue();
    const taskId = cell.getRow().getData().id;
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#343a40" }}>
        <div className="container">
          <a className="navbar-brand">
            Task Manager
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#tasks">
                  Tasks
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#statistics">
                  Statistics
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-8">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-4">
              <AddTaskForm onAddTask={addTask} />
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow-sm mb-8">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0" id="statistics">Task Statistics</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-4">
                    <p><strong>Total Tasks:</strong> {taskCounts.total}</p>
                  </div>
                  <div className="col-md-4">
                    <p><strong>To Do:</strong> {taskCounts.toDo}</p>
                  </div>
                  <div className="col-md-4">
                    <p><strong>Done:</strong> {taskCounts.done}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="">All</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Search tasks"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0" id="tasks">Task List</h5>
          </div>
          <div className="card-body">
            <ReactTabulator
              data={filteredTasks}
              columns={columns}
              layout={"fitColumns"}
              className="table table-striped"
              cellEdited={handleCellEdited}
            />
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default TaskManager;
