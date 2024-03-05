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
      <form className="new-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input type="text" id="item" value={editItem ? editText : newItem} onChange={(e) => (editItem ? setEditText(e.target.value) : setItem(e.target.value))} />
        </div>
        <button className="btn" type="submit">
          {editItem ? "Update" : "Add"}
        </button>
      </form>

      <button className="btn" onClick={sortTodos}>
        Sort by Completion
      </button>

      <input type="text" placeholder="Search todos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />

      <h1>ToDo List</h1>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
            <span>{todo.title}</span>
            <button className="btn" onClick={() => startEdit(todo.id)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
