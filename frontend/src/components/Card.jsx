function Card({ title, description, buttonText }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm hover:scale-105 transition">
      <h2 className="text-2xl font-semibold text-amber-800 ">{title}</h2>

      <p className="text-grey-600 mt-4">{description}</p>

      <button className="mt-6 bg-amber-700 text-white hover:bg-green-800 px-4 py-2 rounded-lg">
        {buttonText}
      </button>
    </div>
  );
}

export default Card;
