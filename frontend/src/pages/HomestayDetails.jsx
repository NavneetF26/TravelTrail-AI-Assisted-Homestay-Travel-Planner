import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui";

const homestay = {
  name: "Mountain View Cottage",
  location: "Mussoorie, Uttarakhand",
  rating: 4.8,

  description:
    "Escape into the peaceful hills of Mussoorie and enjoy breathtaking mountain views, cozy interiors, delicious home-cooked meals, and warm local hospitality. Perfect for couples, families, and nature lovers seeking a relaxing getaway.",

  images: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
  ],

  amenities: [
    { icon: "📶", name: "Free WiFi" },
    { icon: "🚗", name: "Free Parking" },
    { icon: "🍽️", name: "Meals Included" },
    { icon: "🌄", name: "Mountain View" },
    { icon: "🔥", name: "Hot Water" },
    { icon: "👨‍👩‍👧‍👦", name: "Family Rooms" },
    { icon: "⚡", name: "Power Backup" },
    { icon: "🐶", name: "Pet Friendly" },
  ],

  nearbyAttractions: [
    {
      name: "Mall Road",
      distance: "3 km",
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Kempty Falls",
      distance: "15 km",
      image:
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "George Everest Peak",
      distance: "18 km",
      image:
        "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=300&q=80",
    },
  ],

  rooms: [
    {
      id: 1,
      name: "Deluxe Room",
      price: "₹2500",
      capacity: 4,
      beds: "1 King Bed",
      size: "250 sq.ft",
      image:
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=700&q=80",
      features: ["WiFi", "TV", "Mountain View", "Hot Water"],
    },
    {
      id: 2,
      name: "Family Suite",
      price: "₹4000",
      capacity: 6,
      beds: "2 Queen Beds",
      size: "400 sq.ft",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=700&q=80",
      features: ["Balcony", "WiFi", "TV", "Mountain View"],
    },
  ],
};

function HomestayDetails() {
  const [heroImage, setHeroImage] = useState(0);
  const [saved, setSaved] = useState(false);

  const nextImage = () => {
    setHeroImage((prev) => (prev + 1) % homestay.images.length);
  };

  const previousImage = () => {
    setHeroImage((prev) =>
      prev === 0 ? homestay.images.length - 1 : prev - 1,
    );
  };

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
          className="absolute left-5 top-5 rounded-lg border border-white/60 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/50 md:left-9 md:top-7"
        >
          ← Back to Explore
        </Link>

        <button
          onClick={previousImage}
          className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white"
        >
          ‹
        </button>

        <button
          onClick={nextImage}
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

          <button
            onClick={() => setSaved(!saved)}
            className={`h-8 rounded-lg border px-4 text-sm font-medium transition ${
              saved
                ? "border-red-200 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-900 dark:text-red-400"
                : "border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {saved ? "♥ Saved" : "♡ Save"}
          </button>
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
          <h2 className="text-2xl font-bold text-teal-800">Amenities</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {homestay.amenities.map((a) => (
              <div key={a.name} className="p-4 border rounded-xl">
                <span className="text-2xl">{a.icon}</span>
                <p className="mt-2">{a.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-teal-800">Available Rooms</h2>

          <div className="space-y-6 mt-6">
            {homestay.rooms.map((room) => (
              <div
                key={room.id}
                className="border rounded-2xl overflow-hidden grid md:grid-cols-[300px_1fr]"
              >
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6 flex flex-col">
                  <h3 className="text-2xl font-semibold">{room.name}</h3>

                  <p className="mt-2 text-gray-600">
                    👥 {room.capacity} guests • 🛏 {room.beds} • 📐 {room.size}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {room.features.map((f) => (
                      <span
                        key={f}
                        className="px-3 py-1 text-sm border rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 flex justify-between items-center">
                    <span className="text-xl font-bold text-teal-700">
                      {room.price}
                    </span>

                    <Link to="/booking">
                      <Button>Book Room</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-teal-800">
            Nearby Attractions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {homestay.nearbyAttractions.map((p) => (
              <div key={p.name} className="border rounded-xl overflow-hidden">
                <img src={p.image} className="h-40 w-full object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-gray-600">📍 {p.distance}</p>
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
