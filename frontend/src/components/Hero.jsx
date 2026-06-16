import hero from "../assets/hero.png";

function Hero() {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden mt-6">
      <img
        src={hero}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
        {/* MAIN HEADING */}
        <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight">
          TravelTrail: AI-Assisted Homestay & Travel Planner
        </h1>

        {/* SUBHEADING */}
        <p className="text-gray-200 mt-4 text-base md:text-lg max-w-2xl">
          Experience a peaceful stay in the Himalayas. Explore homestay,
          check availability, and plan your perfect mountain escape.
        </p>

        <button className="mt-6 bg-green-400 hover:bg-amber-800 hover:text-white text-black font-bold px-6 py-3 rounded-full transition">
          Book Your Stay
        </button>
      </div>
    </section>
  );
}

export default Hero;
