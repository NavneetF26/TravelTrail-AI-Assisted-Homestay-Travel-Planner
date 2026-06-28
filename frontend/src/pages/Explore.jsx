import { useEffect, useState } from "react";
import Card from "../components/Card";
import { Input, Button, Loader } from "../components/ui";
import { Search, ChevronDown, Check } from "lucide-react";

function CustomSelect({ label, placeholder, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectOption = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white dark:bg-slate-700 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
      >
        <span
          className={
            value
              ? "text-gray-800 dark:text-gray-300"
              : "text-gray-500 dark:text-gray-300"
          }
        >
          {value || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white dark:bg-slate-700 py-1 shadow-lg">
          {["", ...options].map((option) => (
            <button
              key={option || "placeholder"}
              type="button"
              onClick={() => selectOption(option)}
              className="flex w-full items-center justify-between px-3 py-2 hover:bg-teal-50 dark:hover:bg-slate-600"
            >
              {option || placeholder}
              {value === option && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Explore() {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  const fetchHomestays = async (search = "", loc = "", bud = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (loc) params.append("location", loc);
      if (bud) params.append("budget", bud);

      const url = params.toString()
        ? `http://127.0.0.1:8000/api/homestays/search?${params}`
        : "http://127.0.0.1:8000/api/homestays/";

      const data = await (await fetch(url)).json();
      setHomestays(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchHomestays(), 0);
    return () => clearTimeout(t);
  }, []);

  const applyFilters = () => fetchHomestays(searchText, location, budget);

  const clearFilters = () => {
    setSearchText("");
    setLocation("");
    setBudget("");
    fetchHomestays();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teal-900 dark:text-teal-300 md:text-4xl">
          Explore Homestays
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Find the perfect stay based on your preferences.
        </p>
      </div>

      <div className="relative mb-8">
        <Input
          placeholder="Search homestays, locations..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          onClick={applyFilters}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600"
        >
          <Search size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-xl bg-white dark:bg-slate-800 p-5 shadow">
          <h2 className="mb-5 text-lg font-bold text-teal-800 dark:text-teal-200">
            Filters
          </h2>

          <div className="space-y-4">
            <CustomSelect
              label="Location"
              placeholder="Select Location"
              value={location}
              onChange={setLocation}
              options={["Mussoorie", "Rishikesh", "Dehradun"]}
            />
            <CustomSelect
              label="Budget"
              placeholder="Select Budget"
              value={budget}
              onChange={setBudget}
              options={["₹1000 - ₹2000", "₹2000 - ₹3000", "₹3000 - ₹5000"]}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex justify-between">
            <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-300">
              Available Homestays
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {homestays.length} Results Found
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader text="Loading homestays..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {homestays.map((home) => (
                <Card
                  key={home.id}
                  id={home.id}
                  image={home.images[0]}
                  name={home.name}
                  location={home.location}
                  rating={home.rating}
                  price={home.price}
                  buttonText="View Details"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Explore;
