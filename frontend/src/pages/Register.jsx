import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Toast } from "../components/ui";

const API_URL = "http://127.0.0.1:8000";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const navigate = useNavigate();

  const setField = (key, setter) => (e) => {
    setter(e.target.value);
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validateForm = () => {
    const e = { name: "", email: "", password: "" };
    if (!name.trim()) e.name = "Name is required.";
    else if (name.trim().length < 2)
      e.name = "Name must be at least 2 characters.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim()))
      e.email = "Please enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (!PASSWORD_RE.test(password))
      e.password =
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";
    setErrors(e);
    return !e.name && !e.email && !e.password;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed.");
      setToast({
        show: true,
        type: "success",
        message: "Registration successful! Please login.",
      });
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setToast({ show: true, type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-teal-800 dark:text-teal-400">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mt-3 mb-8 dark:text-gray-300">
          Register to start booking homestays.
        </p>

        <div className="space-y-5">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            error={errors.name}
            onChange={setField("name", setName)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            error={errors.email}
            onChange={setField("email", setEmail)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            error={errors.password}
            onChange={setField("password", setPassword)}
          />
          <Button size="lg" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </Button>
        </div>

        <p className="text-center text-gray-600 mt-6 dark:text-gray-300">
          Already have an account?
          <Link
            to="/login"
            className="text-teal-700 dark:text-teal-300 font-semibold"
          >
            {" "}
            Login
          </Link>
        </p>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          variant={toast.type}
          onClose={() => setToast((p) => ({ ...p, show: false }))}
        />
      )}
    </div>
  );
}

export default Register;
