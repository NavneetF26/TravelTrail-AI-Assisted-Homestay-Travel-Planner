import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input, Button, Toast } from "../components/ui";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setToastType("error");
      setToastMessage("Please fill all fields.");
      setShowToast(true);
      return;
    }

    setToastType("success");
    setToastMessage("Login successful!");
    setShowToast(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
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
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button size="lg" onClick={handleLogin}>
            Login
          </Button>
        </div>

        <p className="text-center text-gray-600 mt-6 dark:text-gray-300">
          Don't have an account?
          <span className="text-teal-700 dark:text-teal-300 font-semibold cursor-pointer">
            {" "}
            Sign Up
          </span>
        </p>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          variant={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default Login;
