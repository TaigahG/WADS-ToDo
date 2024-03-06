import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newItem, setItem] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (editItem) {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === editItem) {
          return { ...todo, title: editText };
        }
        return todo;
      });
      setTodos(updatedTodos);
      setEditItem(null);
      setEditText("");
    } else {
      if (!newItem.trim()) return;
      setTodos([...todos, { id: crypto.randomUUID(), title: newItem, completed: false }]);
      setItem("");
    }
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function toggleTodo(id) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  }

  function startEdit(id) {
    const todo = todos.find((todo) => todo.id === id);
    setEditItem(id);
    setEditText(todo.title);
  }

  function sortTodos() {
    const sortedTodos = [...todos].sort((a, b) => b.completed - a.completed);
    setTodos(sortedTodos);
  }

  const filteredTodos = todos.filter((todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <div className="header">
        <h1>ToDo List</h1>
        <input type="text" placeholder="Search todos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
      </div>
      <div className="actions">
        <button className="btn" onClick={sortTodos}>
          Sort by Completion
        </button>
        <form className="new-item-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Add new item..." value={editItem ? editText : newItem} onChange={(e) => (editItem ? setEditText(e.target.value) : setItem(e.target.value))} />
          <button className="btn" type="submit">
            {editItem ? "Update" : "Add"}
          </button>
        </form>
      </div>
      <div className="todo-grid">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="todo-card" style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
            <span>{todo.title}</span>
            <div className="todo-actions">
              <button className="btn" onClick={() => startEdit(todo.id)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
