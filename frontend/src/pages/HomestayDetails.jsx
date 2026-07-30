import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RoomCard from "../components/RoomCard";

const API = `${import.meta.env.VITE_API_URL}/api`;

function HomestayDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  const [saving, setSaving] = useState(false);
  const [homestay, setHomestay] = useState(null);
  const [heroImage, setHeroImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/homestays/${id}`);
        if (!res.ok) throw new Error("Failed to fetch homestay");
        setHomestay(await res.json());
        setHeroImage(0);
        if (isAuthenticated) {
          const savedRes = await fetch(`${API}/saved/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (savedRes.ok) setSaved((await savedRes.json()).saved);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isAuthenticated, token]);

  const changeImage = (dir) =>
    setHeroImage(
      (prev) => (prev + dir + homestay.images.length) % homestay.images.length,
    );

  const toggleSaved = async () => {
    if (!isAuthenticated) return navigate("/login");
    try {
      setSaving(true);
      const res = await fetch(`${API}/saved/${id}`, {
        method: saved ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return navigate("/login");
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setSaved(!saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  if (error || !homestay)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Homestay not found"}
      </div>
    );

  return (
    <div className="min-h-screen">
      <section className="relative h-112.5 overflow-hidden">
        <img
          src={homestay.images[heroImage]}
          alt={homestay.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <Link
          to="/explore"
          className="absolute left-5 top-5 rounded-lg border border-white/60 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          ← Back to Explore
        </Link>
        <button
          onClick={() => changeImage(-1)}
          className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white"
        >
          ‹
        </button>
        <button
          onClick={() => changeImage(1)}
          className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white"
        >
          ›
        </button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {homestay.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroImage(index)}
              className={`w-3 h-3 rounded-full ${heroImage === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-bold text-teal-800 dark:text-teal-300">
              {homestay.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              📍 {homestay.location}
            </p>
          </div>
          <button
            onClick={toggleSaved}
            disabled={saving}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition ${saved ? "border-red-200 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-900 dark:text-red-400" : "border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
            {saving ? "Saving..." : saved ? "Saved" : "Save"}
          </button>
        </div>
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">
            About
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {homestay.description}
          </p>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">
            Amenities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {homestay.amenities?.map((name, index) => (
              <div key={index} className="p-4 border rounded-xl">
                <p>{name}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">
            Available Rooms
          </h2>
          <div className="space-y-6 mt-6">
            {homestay.rooms?.map((room) => (
              <RoomCard key={room.id} room={room} homestayId={homestay.id} />
            ))}
          </div>
        </section>
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">
            Nearby Attractions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {homestay.nearby_attractions?.map((p, index) => (
              <div key={index} className="border rounded-xl overflow-hidden">
                <img
                  src={p.image}
                  className="h-40 w-full object-cover"
                  alt={p.name}
                />
                <div className="p-3">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    📍 {p.distance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomestayDetails;
