import { useState } from "react";
import Card from "../components/Card";
import { Input, Button } from "../components/ui";
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
          className={`text-teal-700 dark:text-teal-300 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white dark:bg-slate-700 py-1 shadow-lg">
          <button
            type="button"
            onClick={() => selectOption("")}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-600 hover:bg-teal-50 dark:text-gray-300 dark:hover:bg-slate-600"
          >
            {placeholder}
            {!value && (
              <Check size={16} className="text-teal-700 dark:text-teal-300" />
            )}
          </button>

          {options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => selectOption(option)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-teal-50 dark:text-gray-300 dark:hover:bg-slate-600"
            >
              {option}
              {value === option && (
                <Check size={16} className="text-teal-700 dark:text-teal-300" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Explore() {
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [guests, setGuests] = useState("");

  const clearFilters = () => {
    setSearchText("");
    setLocation("");
    setBudget("");
    setGuests("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teal-900 dark:text-teal-300 md:text-4xl">
          Explore Homestays
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Find the perfect stay based on your preferences.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Input
          placeholder="Search homestays, locations..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <button
          type="button"
          aria-label="Search homestays"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600 dark:text-teal-200 hover:text-teal-800 dark:hover:text-teal-100"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Filters */}
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

            <CustomSelect
              label="Guests"
              placeholder="Select Guests"
              value={guests}
              onChange={setGuests}
              options={["1 Guest", "2 Guests", "3 Guests", "4+ Guests"]}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={() =>
                console.log({ searchText, location, budget, guests })
              }
            >
              Apply Filters
            </Button>

            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </aside>

        {/* Results */}
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-300">
              Available Homestays
            </h2>

            <span className="text-sm text-gray-500 dark:text-gray-300">
              3 Results Found
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Card
              id={1}
              image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
              name="Mountain View Cottage"
              location="Mussoorie"
              rating="4.8"
              price="2500"
              buttonText="View Details"
            />

            <Card
              id={2}
              image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
              name="Riverside Retreat"
              location="Rishikesh"
              rating="4.7"
              price="2200"
              buttonText="View Details"
            />

            <Card
              id={3}
              image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80"
              name="Village Heritage Stay"
              location="Dehradun"
              rating="4.9"
              price="2800"
              buttonText="View Details"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Explore;
