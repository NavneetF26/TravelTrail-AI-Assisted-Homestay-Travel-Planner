import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Toast } from "../components/ui";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const setField = (key, setter) => (e) => {
    setter(e.target.value);
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validateForm = () => {
    const e = { email: "", password: "" };
    if (!email.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim()))
      e.email = "Please enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed.");
      login(data.user, data.access_token);
      setToast({ show: true, type: "success", message: "Login successful!" });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      setToast({ show: true, type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/api/auth/google/login`;
  };

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-teal-800 dark:text-teal-400">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mt-3 mb-8 dark:text-gray-300">
          Login to manage bookings and AI travel plans.
        </p>
        <div className="space-y-5">
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
          <Button size="lg" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-slate-800 px-3 text-gray-500">
                OR
              </span>
            </div>
          </div>
          <Button variant="outline" size="lg" onClick={loginWithGoogle}>
            Continue with Google
          </Button>
        </div>
        <p className="text-center text-gray-600 mt-6 dark:text-gray-300">
          Don't have an account?
          <Link
            to="/register"
            className="text-teal-700 dark:text-teal-300 font-semibold"
          >
            {" "}
            Sign Up
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

export default Login;
