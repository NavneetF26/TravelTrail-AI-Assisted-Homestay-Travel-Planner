import Hero from "../components/Hero";
import Card from "../components/Card";

function Home() {
  return (
    <>
      <Hero />

      <h2 className="text-3xl md:text-4xl font-bold text-center mt-8 text-teal-700">
        What We Offer
      </h2>

      <div className="flex flex-wrap justify-center gap-8 p-10">
        <Card
          title="Homestay Information"
          description="Explore detailed information about our homestay including amenities, location, surroundings, and nearby attractions. Get a clear view of your stay before you book."
          buttonText="Learn More"
        />

        <Card
          title="Room Availability"
          description="Check available rooms, view basic details, and see what fits your stay dates. Find the right accommodation option quickly and easily."
          buttonText="Explore Rooms"
        />

        <Card
          title="AI Travel Planner"
          description="Get personalized travel suggestions based on your destination, budget, trip duration, and interests. Discover nearby places and get recommendations to help you plan your trip with ease."
          buttonText="Plan My Trip"
        />
      </div>
    </>
  );
}

export default Home;
