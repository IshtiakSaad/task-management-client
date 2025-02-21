import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../context/AuthContext";

const initialTasks = {
  todo: [
    { id: "1", title: "Sample Task 1" },
    { id: "2", title: "Sample Task 2" },
  ],
  inProgress: [],
  done: [],
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  if (!user) {
    return <p className="text-center mt-10">Please log in to access your tasks.</p>;
  }

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = [...tasks[source.droppableId]];
    const destList = [...tasks[destination.droppableId]];

    const [movedTask] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, movedTask);

    setTasks({ ...tasks, [source.droppableId]: sourceList, [destination.droppableId]: destList });
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTaskObject = {
        id: Date.now().toString(),
        title: newTask,
      };
      setTasks({ ...tasks, todo: [...tasks.todo, newTaskObject] });
      setNewTask("");
      setIsModalOpen(false);
    }
  };

  const deleteTask = (taskId, category) => {
    const updatedTasks = tasks[category].filter((task) => task.id !== taskId);
    setTasks({ ...tasks, [category]: updatedTasks });
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setNewTask(task.title);
    setIsModalOpen(true);
  };

  const updateTask = () => {
    if (newTask.trim() !== "") {
      const updatedTasks = tasks;
      Object.keys(updatedTasks).forEach((category) => {
        updatedTasks[category] = updatedTasks[category].map((task) =>
          task.id === editingTask.id ? { ...task, title: newTask } : task
        );
      });

      setTasks({ ...updatedTasks });
      setNewTask("");
      setEditingTask(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Task Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
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
                    className="bg-white p-4 rounded-lg shadow-md min-h-[300px]"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">
                      {category === "todo"
                        ? "To Do"
                        : category === "inProgress"
                        ? "In Progress"
                        : "Done"}
                    </h3>
                    {tasks[category].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-blue-100 text-blue-900 p-3 rounded-md shadow-md mb-3 flex justify-between items-center"
                          >
                            <span>{task.title}</span>
                            <div>
                              <button
                                onClick={() => startEditing(task)}
                                className="bg-yellow-500 text-white px-2 py-1 text-xs rounded-md mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteTask(task.id, category)}
                                className="bg-red-500 text-white px-2 py-1 text-xs rounded-md"
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold">{editingTask ? "Edit Task" : "Add Task"}</h3>
            <input
              type="text"
              className="border p-2 w-full mt-2"
              placeholder="Task title..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500">
                Cancel
              </button>
              {editingTask ? (
                <button
                  onClick={updateTask}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={addTask}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
