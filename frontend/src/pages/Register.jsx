import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Input, Button, Toast } from "../components/ui";

const API_URL = "http://127.0.0.1:8000";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";
    }

    setErrors(newErrors);

    return !newErrors.name && !newErrors.email && !newErrors.password;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed.");
      }

      setToastType("success");
      setToastMessage("Registration successful! Please login.");
      setShowToast(true);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setToastType("error");
      setToastMessage(error.message);
      setShowToast(true);
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
            onChange={(e) => {
              setName(e.target.value);

              if (errors.name) {
                setErrors((prev) => ({
                  ...prev,
                  name: "",
                }));
              }
            }}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            error={errors.email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (errors.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }
            }}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            error={errors.password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (errors.password) {
                setErrors((prev) => ({
                  ...prev,
                  password: "",
                }));
              }
            }}
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

export default Register;
