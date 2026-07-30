import { useState, useEffect } from "react";
import { Input, Button, Loader, Toast } from "../components/ui";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const Required = () => (
  <span className="text-violet-800 dark:text-violet-500">*</span>
);

function TravelPlanner() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [interests, setInterests] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [plan, setPlan] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const notify = (message, variant = "success") =>
    setToast({ show: true, message, variant });

  const fields = [
    {
      label: "Destination",
      value: destination,
      set: setDestination,
      placeholder: "e.g. Mussoorie",
    },
    {
      label: "Budget (₹)",
      value: budget,
      set: setBudget,
      placeholder: "5000",
      type: "number",
    },
    {
      label: "Trip Duration",
      value: duration,
      set: setDuration,
      placeholder: "3 Days",
    },
    {
      label: "Interests",
      value: interests,
      set: setInterests,
      placeholder: "Nature, Food, Adventure...",
    },
  ];

  const generatePlan = async () => {
    if (
      !destination.trim() ||
      !budget.trim() ||
      !duration.trim() ||
      !interests.trim()
    )
      return notify("Please fill all required fields.", "error");
    try {
      setLoading(true);
      setGenerated(false);
      const res = await fetch(`${API_URL}/api/ai/travel-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          destination,
          budget,
          duration,
          interests,
          preferences,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Unable to generate plan.");
      setPlan(data.days || []);
      setGenerated(true);
      notify("Travel plan generated successfully!");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setDestination("");
    setBudget("");
    setDuration("");
    setInterests("");
    setPreferences("");
    setPlan([]);
    setGenerated(false);
  };

  const activityText = (a) =>
    typeof a === "object" && a
      ? a.time
        ? `${a.time} - ${a.activity}`
        : a.activity
      : a;

  const buildPlanText = () =>
    plan
      .map((day) => {
        const header = day.title ? `${day.day}: ${day.title}` : day.day;
        const activities = (day.activities || []).map(activityText).join("\n");
        return `${header}\n${activities}${day.notes ? `\nTip: ${day.notes}` : ""}`;
      })
      .join("\n\n");

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(buildPlanText());
      notify("Plan copied to clipboard!");
    } catch {
      notify("Could not copy plan.", "error");
    }
  };

  const savePlan = () => {
    try {
      const text = `Travel Plan: ${destination}\nDuration: ${duration} | Budget: ₹${budget} | Interests: ${interests}\n\n${buildPlanText()}`;
      const url = URL.createObjectURL(
        new Blob([text], { type: "text/plain;charset=utf-8" }),
      );
      const safeName =
        destination
          .trim()
          .replace(/[^a-z0-9]+/gi, "-")
          .toLowerCase() || "trip";
      const link = document.createElement("a");
      link.href = url;
      link.download = `travel-plan-${safeName}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      notify("Plan downloaded!");
    } catch {
      notify("Could not save plan.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-violet-800 dark:text-violet-400">
          ✨ AI Travel Planner
        </h1>
        <p className="text-gray-600 mt-2 dark:text-gray-300">
          Let AI create a personalized itinerary for your trip.
        </p>
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700 p-6 space-y-5 [&_label]:text-violet-800! dark:[&_label]:text-violet-400!">
          {fields.map((f) => (
            <Input
              key={f.label}
              label={
                <>
                  {f.label} <Required />
                </>
              }
              type={f.type}
              placeholder={f.placeholder}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
            />
          ))}
          <div>
            <label className="font-medium">
              Additional Preferences (Optional)
            </label>
            <textarea
              rows={4}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && e.ctrlKey && generatePlan()
              }
              placeholder="Family trip, vegetarian food, avoid trekking... (Ctrl+Enter to generate)"
              className="w-full mt-1 rounded-lg border border-gray-400 bg-white dark:bg-slate-700 dark:text-gray-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={generatePlan}
              disabled={loading}
            >
              {loading ? "Generating..." : "✨ Generate Plan"}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow border border-transparent dark:border-slate-700 p-6 min-h-130">
          <h2 className="text-xl font-semibold text-violet-800 mb-4 dark:text-violet-400">
            Your Travel Plan
          </h2>
          {loading && (
            <div className="flex justify-center items-center h-80">
              <Loader text="Generating your plan..." />
            </div>
          )}
          {!loading && generated && (
            <div className="space-y-5">
              {plan.map((day, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-violet-50 dark:bg-violet-950/50 border border-violet-100 dark:border-violet-800/60 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-violet-800 dark:text-violet-300">
                      📅 {day.day}
                    </h3>
                    {day.title && (
                      <span className="rounded-full bg-violet-200 dark:bg-violet-900/70 px-3 py-1 font-semibold text-violet-700 dark:text-violet-200">
                        {day.title}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {(day.activities || []).map((activity, i) => {
                      const isObj =
                        typeof activity === "object" && activity !== null;
                      const time = isObj ? activity.time : "";
                      const text = isObj ? activity.activity : activity;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          {time ? (
                            <span className="w-24 shrink-0 font-semibold text-violet-700 dark:text-violet-300">
                              {time}
                            </span>
                          ) : (
                            <span className="text-lg">📍</span>
                          )}
                          <p className="text-gray-700 dark:text-gray-300">
                            {text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {day.notes && (
                    <div className="mt-5 rounded-lg bg-violet-100 dark:bg-violet-900/50 p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        💡 <strong>Tip:</strong> {day.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <Button variant="outline" onClick={copyPlan}>
                  📋 Copy Plan
                </Button>
                <Button variant="outline" onClick={savePlan}>
                  💾 Download Plan (.txt)
                </Button>
                <Button variant="secondary" onClick={clearForm}>
                  🔄 Generate Another Plan
                </Button>
              </div>
            </div>
          )}
          {!loading && !generated && (
            <div className="flex h-80 items-center justify-center text-center text-gray-400 dark:text-gray-300">
              <div>
                <p className="text-lg font-medium">
                  Your AI-generated itinerary will appear here.
                </p>
                <p className="text-sm mt-2">
                  Fill in your trip details and click{" "}
                  <span className="font-semibold text-violet-700 dark:text-violet-300">
                    Generate Plan
                  </span>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {toast.show && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default TravelPlanner;
