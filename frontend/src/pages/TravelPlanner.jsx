import { useState } from "react";
import { Input, Button, Loader, Toast } from "../components/ui";

function TravelPlanner() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const generatePlan = () => {
    setLoading(true);
    setGenerated(false);
    setShowToast(false);

    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      setShowToast(true);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-violet-800 mb-2 dark:text-violet-400">
          AI Travel Planner
        </h1>

        <p className="text-gray-600 mt-2 dark:text-gray-300">
          Let AI create a personalized itinerary for your trip.
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT: FORM */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 space-y-5">
          <Input label="Destination" placeholder="e.g. Mussoorie" />
          <Input label="Budget (₹)" type="number" placeholder="5000" />
          <Input label="Trip Duration" placeholder="3 Days" />
          <Input label="Interests" placeholder="Nature, Food, Adventure..." />

          <div className="flex justify-end pt-2">
            <Button variant="secondary" size="lg" onClick={generatePlan}>
              Generate Plan
            </Button>
          </div>
        </div>

        {/* RIGHT: OUTPUT PANEL */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 min-h-75">
          <h2 className="text-xl font-semibold text-violet-800 mb-4 dark:text-violet-400">
            Your Travel Plan
          </h2>

          {/* LOADER STATE */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <Loader text="Generating your plan..." />
            </div>
          )}

          {/* GENERATED RESULT */}
          {!loading && generated && (
            <div className="space-y-5">
              <div className="bg-violet-50 dark:bg-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-violet-800 dark:text-violet-300">
                  Day 1
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Check in, explore Mall Road, enjoy cafés and sunset.
                </p>
              </div>

              <div className="bg-violet-50 dark:bg-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-violet-800 dark:text-violet-300">
                  Day 2
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Visit waterfalls and nearby viewpoints.
                </p>
              </div>

              <div className="bg-violet-50 dark:bg-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-violet-800 dark:text-violet-300">
                  Day 3
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Shopping and checkout.
                </p>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !generated && (
            <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-300 text-sm">
              Your generated plan will appear here
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      {showToast && (
        <Toast
          message="Travel plan generated successfully!"
          variant="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default TravelPlanner;
