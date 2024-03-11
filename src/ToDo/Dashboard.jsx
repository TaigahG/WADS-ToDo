import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./App.css"; // Make sure this is the correct path to your CSS file
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

function App() {
  const [todos, setTodos] = useState([]);
  const [newItem, setItem] = useState("");
  const [editingId, setEditingId] = useState(null); // State to track editing
  const [editText, setEditText] = useState(""); // State to hold edit text
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosArray);
    });
    return () => unsubscribe();
  }, []);

  async function handleAddOrUpdateTodo(e) {
    e.preventDefault();
    if (editingId) {
      // Update the todo
      await updateDoc(doc(db, "todos", editingId), {
        title: editText,
        timestamp: serverTimestamp(),
      });
      setEditingId(null);
      setEditText("");
    } else {
      // Add a new todo
      if (!newItem.trim()) return;
      await addDoc(collection(db, "todos"), {
        title: newItem,
        completed: false,
        timestamp: serverTimestamp(),
      });
      setItem("");
    }
  }

  function handleEdit(todo) {
    setEditingId(todo.id);
    setEditText(todo.title);
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, "todos", id));
  }

  const handleInputChange = (e) => {
    if (editingId) {
      setEditText(e.target.value);
    } else {
      setItem(e.target.value);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTodos = todos.filter((todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="app-container">
      <header className="header">
        <h1>ToDo List</h1>
        <input type="text" className="search-input" placeholder="Search todos..." value={searchQuery} onChange={handleSearchChange} />
      </header>
      <div className="actions">
        <form className="new-item-form" onSubmit={handleAddOrUpdateTodo}>
          <input type="text" className="new-todo-input" placeholder={editingId ? "Edit todo..." : "Add new item..."} value={editingId ? editText : newItem} onChange={handleInputChange} />
          <button className="btn" type="submit">
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      </div>
      <div className="todo-grid">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="todo-card">
            <div className="todo-text">{todo.title}</div>
            <input type="checkbox" className="todo-checkbox" checked={todo.completed} onChange={() => handleToggleCompleted(todo.id, todo.completed)} />
            <div className="todo-actions">
              <button className="btn" onClick={() => handleEdit(todo)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(todo.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
