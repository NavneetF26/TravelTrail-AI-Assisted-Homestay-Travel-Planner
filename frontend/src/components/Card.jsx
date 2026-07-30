import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui";

const API = `${import.meta.env.VITE_API_URL}/api`;

function Card({ id, image, name, location, price, buttonText }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (!isAuthenticated) return;
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API}/saved/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setSaved(data.saved);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSavedStatus();
  }, [id, isAuthenticated]);

  const toggleSaved = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      setSaving(true);
      const res = await fetch(`${API}/saved/${id}`, {
        method: saved ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail);
      }
      setSaved(!saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden w-full max-w-sm hover:-translate-y-2 hover:shadow-xl transition duration-300">
      <button
        onClick={toggleSaved}
        disabled={saving}
        className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow ${
          saved
            ? "bg-red-500 text-white"
            : "bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300"
        }`}
      >
        <Heart size={18} fill={saved ? "currentColor" : "none"} />
      </button>
      <img src={image} alt={name} className="w-full h-56 object-cover" />
      <div className="p-5">
        <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200">
          {name}
        </h2>
        <p className="text-gray-500 dark:text-gray-200 mt-1">📍 {location}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-green-700 dark:text-green-300">
            ₹{price}/night
          </span>
        </div>
        <div className="mt-6">
          <Link to={`/homestay/${id}`}>
            <Button size="md">{buttonText}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
