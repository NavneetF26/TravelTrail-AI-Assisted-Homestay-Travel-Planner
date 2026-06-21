import hero from "../assets/hero.png";
import { Link } from "react-router-dom";
import { Button } from "../components/ui";

function Hero() {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden mt-6">
      <img
        src={hero}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
        <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight">
          Discover Beautiful Homestays with AI Travel Planning
        </h1>

        <p className="text-gray-200 mt-5 text-base md:text-lg max-w-2xl">
          Explore unique stays, compare amenities, send booking requests, and
          receive personalized travel itineraries powered by AI.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link to="/explore">
            <Button variant="primary" size="lg">
              Explore Homestays
            </Button>
          </Link>

          <Link to="/travelplanner">
            <Button variant="secondary" size="lg">
              Plan My Trip
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
