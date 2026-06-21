import { Link } from "react-router-dom";
import { Button } from "./ui";

function Card({ id, image, name, location, price, rating, buttonText }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden w-full max-w-sm hover:-translate-y-2 hover:shadow-xl transition duration-300">
      <img src={image} alt={name} className="w-full h-56 object-cover" />

      <div className="p-5">
        <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200">
          {name}
        </h2>

        <p className="text-gray-500 dark:text-gray-200 mt-1">📍 {location}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-amber-600 dark:text-amber-400 font-semibold">
            ⭐ {rating}
          </span>

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
