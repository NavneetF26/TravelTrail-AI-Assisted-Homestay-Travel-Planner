import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Modal, Button, Toast } from "../components/ui";

const API = "http://127.0.0.1:8000/api";

function Dashboard() {
  const navigate = useNavigate();

  const [savedHomestays, setSavedHomestays] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [deleting, setDeleting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (message, variant = "success") =>
    setToast({
      show: true,
      message,
      variant,
    });

  const fetchSavedHomestays = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoadingSaved(true);

      const res = await fetch(`${API}/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to load saved homestays.");
      }

      setSavedHomestays(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load saved homestays", "error");
    } finally {
      setLoadingSaved(false);
    }
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoadingBookings(true);

      const res = await fetch(`${API}/bookings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        let detail = "";

        try {
          const errBody = await res.json();
          detail = errBody.detail || JSON.stringify(errBody);
        } catch {
          detail = "(no JSON body)";
        }

        console.error("401 from /bookings/. Backend said:", detail);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to load bookings.");
      }

      setBookings(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load bookings", "error");
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    // Avoid calling setState synchronously in the effect body by
    // invoking the fetch functions from an async callback.
    const load = async () => {
      await fetchSavedHomestays();
      await fetchBookings();
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteBooking = async () => {
    const token = localStorage.getItem("token");

    try {
      setDeleting(true);

      const res = await fetch(`${API}/bookings/${selectedBooking.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Delete failed.");
      }

      showToast("Booking cancelled");

      setSelectedBooking(null);

      fetchBookings();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-teal-800 dark:text-teal-300">
            Dashboard
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your saved homestays and bookings.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Saved Homestays — LEFT */}

          <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-5">
              Saved Homestays
            </h2>

            {loadingSaved ? (
              <Loader text="Loading saved homestays..." />
            ) : savedHomestays.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300">
                No saved homestays yet.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
                {savedHomestays.map((home) => (
                  <div
                    key={home.id}
                    className="border rounded-xl overflow-hidden"
                  >
                    <img
                      src={home.images[0]}
                      alt={home.name}
                      className="h-52 w-full object-cover"
                    />

                    <div className="p-4">
                      <h3 className="text-xl font-semibold">{home.name}</h3>

                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        📍 {home.location}
                      </p>

                      <p className="text-yellow-600 mt-1">⭐ {home.rating}</p>

                      <Button
                        size="sm"
                        className="mt-4"
                        onClick={() => navigate(`/homestay/${home.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Bookings — RIGHT */}

          <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-5">
              My Bookings
            </h2>

            {loadingBookings ? (
              <Loader text="Loading bookings..." />
            ) : bookings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300">
                No bookings yet.
              </p>
            ) : (
              <div className="space-y-5">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-xl p-5 flex justify-between gap-5 flex-wrap"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-300">
                        {booking.homestay_name}
                      </h2>

                      <p className="text-teal-800 dark:text-teal-300">
                        {booking.room_type}
                      </p>

                      <p className="mt-2">📍 {booking.location}</p>

                      <p>
                        📅 {booking.check_in} → {booking.check_out}
                      </p>

                      <p>
                        👥 {booking.guests} Guest
                        {booking.guests > 1 ? "s" : ""}
                      </p>

                      <p>👤 {booking.full_name}</p>
                      <p>📧 {booking.email}</p>
                      <p>📞 {booking.phone}</p>

                      <div className="flex gap-3 mt-5">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            navigate(`/booking/edit/${booking.id}`)
                          }
                        >
                          Update
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    <span
                      className={`h-fit rounded px-3 py-2 text-sm font-medium ${
                        booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Delete Booking"
      >
        <p className="mb-5">Are you sure you want to cancel this booking?</p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            disabled={deleting}
            onClick={() => setSelectedBooking(null)}
          >
            No
          </Button>

          <Button
            variant="secondary"
            disabled={deleting}
            onClick={deleteBooking}
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </Modal>

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
    </>
  );
}

export default Dashboard;
