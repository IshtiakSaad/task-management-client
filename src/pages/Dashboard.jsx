import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = "http://localhost:3000/api/tasks"; // Adjust for deployment

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // ✅ Redirect if user is not logged in
  if (!user) {
    return <p className="text-center mt-10 text-white">Please log in to access your tasks.</p>;
  }

  // ✅ Fetch tasks for the logged-in user
  useEffect(() => {
    axios
      .get(`${API_URL}/${user.uid}`)
      .then((response) => {
        const formattedTasks = { todo: [], inProgress: [], done: [] };
        response.data.forEach((task) => {
          formattedTasks[task.category].push(task);
        });
        setTasks(formattedTasks);
      })
      .catch((error) => console.error("Failed to fetch tasks:", error));
  }, [user]);

  // ✅ Add a new task
  const addTask = async () => {
    if (newTask.title.trim() !== "") {
      try {
        const response = await axios.post(API_URL, {
          title: newTask.title,
          description: newTask.description,
          category: "todo",
          userId: user.uid,
        });
        setTasks((prev) => ({ ...prev, todo: [...prev.todo, response.data] }));
        setNewTask({ title: "", description: "" });
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
  };

  // ✅ Delete a task
  const deleteTask = async (id, category) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prev) => ({
        ...prev,
        [category]: prev[category].filter((task) => task._id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // ✅ Edit task
  const startEditing = (task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description });
    setIsModalOpen(true);
  };

  const updateTask = async () => {
    if (newTask.title.trim() !== "" && editingTask) {
      try {
        const response = await axios.put(`${API_URL}/${editingTask._id}`, {
          title: newTask.title,
          description: newTask.description,
          category: editingTask.category,
        });

        setTasks((prev) => {
          const updatedTasks = { ...prev };
          updatedTasks[editingTask.category] = updatedTasks[editingTask.category].map((task) =>
            task._id === editingTask._id ? response.data : task
          );
          return updatedTasks;
        });

        setNewTask({ title: "", description: "" });
        setEditingTask(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    }
  };

  // ✅ Drag-and-drop functionality (Reorder & Update Backend)
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Prevent direct state mutation by creating deep copies
    const newTasks = { ...tasks, 
      [source.droppableId]: [...tasks[source.droppableId]], 
      [destination.droppableId]: [...tasks[destination.droppableId]] 
    };

    // Remove the dragged task from the source list
    const [movedTask] = newTasks[source.droppableId].splice(source.index, 1);

    // Assign new category only if it's moved to a different category
    if (source.droppableId !== destination.droppableId) {
      movedTask.category = destination.droppableId;
    }

    // Insert the task in the destination list at the new position
    newTasks[destination.droppableId].splice(destination.index, 0, movedTask);

    // Update state to reflect changes
    setTasks(newTasks);

    // Update backend only if category actually changed
    if (source.droppableId !== destination.droppableId) {
      try {
        await axios.put(`${API_URL}/${movedTask._id}`, {
          title: movedTask.title,
          description: movedTask.description,
          category: movedTask.category,
        });
      } catch (error) {
        console.error("Failed to move task:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-bold mb-6">Task Management</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700 transition"
      >
        + Add Task
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {["todo", "inProgress", "done"].map((category) => (
            <Droppable droppableId={category} key={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg min-h-[300px]"
                >
                  <h3 className="text-lg font-semibold mb-4">{category === "todo" ? "To Do" : category === "inProgress" ? "In Progress" : "Done"}</h3>
                  {tasks[category].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-700 text-white p-3 rounded-md shadow-md mb-3 flex flex-col hover:bg-gray-600 transition"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{task.title}</span>
                            <div>
                              <button
                                onClick={() => startEditing(task)}
                                className="bg-yellow-500 text-white px-2 py-1 text-xs rounded-md mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteTask(task._id, category)}
                                className="bg-red-500 text-white px-2 py-1 text-xs rounded-md"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          {task.description && <p className="text-sm">{task.description}</p>}
                          <p className="text-xs text-gray-400">
                            Created: {new Date(task.createdAt).toLocaleString()}
                          </p>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-bold">{editingTask ? "Edit Task" : "Add Task"}</h3>
            <input
              type="text"
              className="border bg-gray-600 text-white p-2 w-full mt-2 rounded-md"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              className="border bg-gray-600 text-white p-2 w-full mt-2 rounded-md"
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <button onClick={() => (editingTask ? updateTask() : addTask())} className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-700 transition">
              {editingTask ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
