import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle, Trash2, Upload } from "lucide-react";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("login");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [currentUser, setCurrentUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [notif, setNotif] = useState("");

  // 🔔 Notification system
  useEffect(() => {
    if (notif) {
      const timer = setTimeout(() => setNotif(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  // ✅ Email + Password validation
  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (!emailRegex.test(form.email)) return "Invalid email format!";
    if (!passRegex.test(form.password))
      return "Password must contain letters, numbers & a special symbol (min 6 chars)";
    return "";
  };

  const handleSignup = () => {
    const error = validateForm();
    if (error) return setNotif(error);
    if (users.find((u) => u.email === form.email))
      return setNotif("User already exists!");
    setUsers([...users, form]);
    setNotif("Signup successful! Please login.");
    setForm({ name: "", email: "", password: "", role: "student" });
    setPage("login");
  };

  const handleLogin = () => {
    const found = users.find(
      (u) => u.email === form.email && u.password === form.password
    );
    if (!found) return setNotif("Invalid email or password!");
    setCurrentUser(found);
    setNotif(`Welcome, ${found.name}!`);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("login");
    setNotif("Logged out successfully!");
  };

  const handleAdd = (data) => {
    setAchievements([...achievements, { ...data, id: Date.now(), verified: false }]);
    setNotif("Achievement added!");
  };

  const handleVerify = (id) => {
    setAchievements(
      achievements.map((a) => (a.id === id ? { ...a, verified: true } : a))
    );
    setNotif("Achievement verified!");
  };

  const handleDelete = (id) => {
    setAchievements(achievements.filter((a) => a.id !== id));
    setNotif("Deleted successfully!");
  };

  const handleExport = () => {
    const csv = achievements
      .map((a) =>
        [a.id, a.studentName, a.studentId, a.category, a.title, a.awardType, a.verified].join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "achievements.csv";
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="bg-red-600 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wide">STUTRACK</div>
          <nav className="hidden md:flex gap-6 text-sm uppercase font-medium">
            <button onClick={() => setPage("dashboard")} className="hover:text-yellow-300">
              Dashboard
            </button>
            <button onClick={() => setPage("login")} className="hover:text-yellow-300">
              Login
            </button>
            <button onClick={() => setPage("signup")} className="hover:text-yellow-300">
              Signup
            </button>
            {currentUser && (
              <button onClick={handleLogout} className="hover:text-yellow-300">
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* NOTIFICATION */}
      <AnimatePresence>
        {notif && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50"
          >
            {notif}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {page === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Login</h2>
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 mb-3 rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 mb-3 rounded"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                onClick={handleLogin}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium"
              >
                Login
              </button>
              <p className="text-center text-sm mt-3 text-gray-600">
                No account?{" "}
                <button onClick={() => setPage("signup")} className="text-red-600 font-semibold">
                  Sign up
                </button>
              </p>
            </motion.div>
          )}

          {page === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Sign Up</h2>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-2 mb-3 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 mb-3 rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 mb-3 rounded"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <select
                className="w-full border p-2 mb-3 rounded"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleSignup}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium"
              >
                Create Account
              </button>
              <p className="text-center text-sm mt-3 text-gray-600">
                Already have an account?{" "}
                <button onClick={() => setPage("login")} className="text-red-600 font-semibold">
                  Login
                </button>
              </p>
            </motion.div>
          )}

          {page === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentUser.role === "admin" ? "Admin Dashboard" : "Student Dashboard"}
                </h2>
                <button
                  onClick={handleExport}
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-3 py-2 rounded-md text-sm"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>

              {currentUser.role === "student" ? (
                <StudentSection onAdd={handleAdd} />
              ) : (
                <AdminSection
                  achievements={achievements}
                  handleVerify={handleVerify}
                  handleDelete={handleDelete}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-gray-200 text-gray-700 text-sm text-center py-3">
        © 2025 StuTrack. Designed with ❤️ using React + Tailwind.
      </footer>
    </div>
  );
}

// Student Section
function StudentSection({ onAdd }) {
  const [data, setData] = useState({
    studentName: "",
    studentId: "",
    category: "",
    title: "",
    awardType: "",
  });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) alert(`File "${file.name}" uploaded successfully!`);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 text-gray-700">Submit Achievement</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Student Name"
          value={data.studentName}
          onChange={(e) => setData({ ...data, studentName: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Student ID"
          value={data.studentId}
          onChange={(e) => setData({ ...data, studentId: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Category"
          value={data.category}
          onChange={(e) => setData({ ...data, category: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Award Type"
          value={data.awardType}
          onChange={(e) => setData({ ...data, awardType: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="border p-2 rounded"
        />
      </div>
      <button
        onClick={() => onAdd(data)}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
      >
        <Upload size={16} /> Submit Achievement
      </button>
    </div>
  );
}

// Admin Section
function AdminSection({ achievements, handleVerify, handleDelete }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 text-gray-700">All Submissions</h3>
      {achievements.length === 0 ? (
        <p className="text-sm text-gray-500">No submissions yet.</p>
      ) : (
        achievements.map((a) => (
          <div
            key={a.id}
            className="border-b py-3 flex justify-between items-center text-sm"
          >
            <div>
              <div className="font-medium text-gray-800">{a.title}</div>
              <div className="text-gray-500">
                {a.studentName} ({a.studentId}) • {a.category} • {a.awardType}
              </div>
            </div>
            <div className="flex gap-2">
              {!a.verified && (
                <button
                  onClick={() => handleVerify(a.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <CheckCircle size={14} /> Verify
                </button>
              )}
              <button
                onClick={() => handleDelete(a.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
