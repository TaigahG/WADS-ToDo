import "./ToDo/App.css";
import Todo from "./ToDo/Dashboard.jsx";
import Login from "./ToDo/Login.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./ToDo/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} exact />
        <Route path="/ToDo" element={<Todo />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
