import Hero from "../components/Hero";
import { ShieldCheck, CalendarCheck, Bot, Headset } from "lucide-react";

function Home() {
  return (
    <>
      <Hero />

      {/* Why Choose TravelTrail */}
      <section className="bg-teal-100 py-16 px-6 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-teal-800 dark:text-teal-300">
              Why Choose TravelTrail?
            </h2>

            <p className="text-gray-600 mt-3 max-w-2xl mx-auto dark:text-gray-300">
              Everything you need to discover, book, and plan memorable trips.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-white dark:bg-slate-600 rounded-xl shadow p-8 text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="w-8 h-8 text-teal-600 dark:text-teal-300" />
              </div>

              <h3 className="font-semibold text-lg">Homestay Information</h3>

              <p className="text-gray-600 dark:text-gray-300 mt-3">
                Explore homestay details, amenities, locations, nearby
                attractions, and accommodation information before planning your
                stay.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-600 rounded-xl shadow p-8 text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-teal-100  dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
                <CalendarCheck className="w-8 h-8 text-teal-600 dark:text-teal-300" />
              </div>

              <h3 className="font-semibold text-lg">Direct Communication</h3>

              <p className="text-gray-600 dark:text-gray-300 mt-3">
                Connect directly with homestay owners to ask questions, discuss
                stays, and receive personalized assistance before booking.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-600 rounded-xl shadow p-8 text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-teal-100  dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
                <Bot className="w-8 h-8 text-teal-600 dark:text-teal-300" />
              </div>

              <h3 className="font-semibold text-lg">AI Travel Planner</h3>

              <p className="text-gray-600 dark:text-gray-300 mt-3">
                Get AI-powered travel suggestions based on destination, budget,
                trip duration, and personal interests.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-600 rounded-xl shadow p-8 text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-teal-100  dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
                <Headset className="w-8 h-8 text-teal-600 dark:text-teal-300" />
              </div>

              <h3 className="font-semibold text-lg">Booking Requests</h3>

              <p className="text-gray-600 dark:text-gray-300 mt-3">
                Submit booking requests with travel dates and guest information
                directly through the platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
