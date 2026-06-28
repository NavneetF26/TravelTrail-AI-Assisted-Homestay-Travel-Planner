import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import RoomCard from "../components/RoomCard";

function HomestayDetails() {
  const { id } = useParams();

  const [homestay, setHomestay] = useState(null);
  const [heroImage, setHeroImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomestay = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/api/homestays/${id}`);
        if (!res.ok) throw new Error("Failed to fetch homestay");
        const data = await res.json();
        setHomestay(data);
        setHeroImage(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomestay();
  }, [id]);

  const changeImage = (dir) =>
    setHeroImage((prev) => {
      const total = homestay.images.length;
      return (prev + dir + total) % total;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (error || !homestay) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Homestay not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
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

        {/* dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {homestay.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroImage(index)}
              className={`w-3 h-3 rounded-full ${
                heroImage === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-bold text-teal-800 dark:text-teal-300">
              {homestay.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              📍 {homestay.location}
            </p>
            <p className="mt-2 text-yellow-600">⭐ {homestay.rating}</p>
          </div>
        </div>

        {/* Description */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">
            About
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {homestay.description}
          </p>
        </section>

        {/* Amenities */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">
            Amenities
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {homestay.amenities?.map((a, index) => (
              <div key={index} className="p-4 border rounded-xl">
                <span className="text-2xl">{a.icon}</span>
                <p className="mt-2">{a.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms */}
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

        {/* Nearby */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">
            Nearby Attractions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {homestay.nearbyAttractions?.map((p, index) => (
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
