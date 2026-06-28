import { Link } from "react-router-dom";
import { Button } from "./ui";

function RoomCard({ room, homestayId }) {
  return (
    <div className="border rounded-2xl overflow-hidden grid md:grid-cols-[300px_1fr]">
      <img
        src={room.image}
        alt={room.name}
        className="h-64 w-full object-cover"
      />

      <div className="p-6 flex flex-col">
        <h3 className="text-2xl font-semibold">{room.name}</h3>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          👥 {room.capacity} guests • 🛏 {room.beds} • 📐 {room.size}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {room.features.map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 text-sm border rounded-full dark:border-slate-500 dark:bg-slate-700 dark:text-slate-300"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6 flex justify-between items-center">
          <span className="text-xl font-bold text-teal-700 dark:text-teal-300">
            ₹{room.price}
          </span>

          <Link to={`/booking/${homestayId}`} state={{ roomId: room.id }}>
            <Button>Book Room</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
