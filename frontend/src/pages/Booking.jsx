import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Toast } from "../components/ui";

function Booking() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  const [errors, setErrors] = useState({});

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const handleSubmit = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!checkIn) newErrors.checkIn = "Select check-in date.";
    if (!checkOut) newErrors.checkOut = "Select check-out date.";
    if (!guests) newErrors.guests = "Enter number of guests.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setToast({
      show: true,
      message: "Booking request submitted successfully!",
      variant: "success",
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  const handleCancel = () => {
    setToast({
      show: true,
      message: "Booking request cancelled.",
      variant: "warning",
    });

    setTimeout(() => {
      navigate(-1);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-800 dark:text-teal-300">
          Booking Request
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Complete the form below to submit your booking request.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        {/* Homestay Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 h-fit">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
            alt="Homestay"
            className="w-full h-48 object-cover rounded-xl"
          />

          <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-300 mt-5">
            Mountain View Cottage
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mt-2">Deluxe Room</p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Max Guests: 4</p>
          <p className="text-green-700 dark:text-green-400 font-bold text-lg mt-4">
            ₹2500 / night
          </p>

          <div className="border-t mt-5 pt-5">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enjoy scenic mountain views, cozy rooms, home-cooked meals, and a
              peaceful stay.
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white dark:bg-slate-700 rounded-2xl shadow p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-teal-800 dark:text-teal-300 mb-6">
            Guest Details
          </h2>

          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
            />

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Check-in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                error={errors.checkIn}
              />

              <Input
                label="Check-out"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                error={errors.checkOut}
              />
            </div>

            <Input
              label="Number of Guests"
              type="number"
              placeholder="2"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              error={errors.guests}
            />

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>

              <Button onClick={handleSubmit}>Submit Request</Button>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />
      )}
    </div>
  );
}

export default Booking;
