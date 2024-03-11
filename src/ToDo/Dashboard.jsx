import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./App.css";
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

function App() {
  const [todos, setTodos] = useState([]);
  const [newItem, setItem] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || "User");
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

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
      await updateDoc(doc(db, "todos", editingId), {
        title: editText,
        timestamp: serverTimestamp(),
      });
      setEditingId(null);
      setEditText("");
    } else {
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

  const handleEditProfile = () => {
    navigate("/profile");
  };

  const filteredTodos = todos.filter((todo) => todo.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="app-container">
      <button onClick={handleEditProfile} className="btn">
        Edit Profile
      </button>

      <header className="header">
        <h1>ToDo List</h1>
        <input type="text" className="search-input" placeholder="Search todos..." value={searchQuery} onChange={handleSearchChange} />
        <div className="user-info">Welcome, {displayName}</div>
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
