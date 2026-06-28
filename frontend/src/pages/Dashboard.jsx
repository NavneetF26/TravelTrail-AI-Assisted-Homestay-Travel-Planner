import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Modal, Button, Toast } from "../components/ui";

function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (message, variant = "success") =>
    setToast({ show: true, message, variant });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await (
        await fetch("http://127.0.0.1:8000/api/bookings/")
      ).json();
      setBookings(data);
    } catch {
      showToast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteBooking = async () => {
    try {
      setDeleting(true);
      const res = await fetch(
        `http://127.0.0.1:8000/api/bookings/${selectedBooking.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();
      showToast("Booking cancelled");
      setSelectedBooking(null);
      fetchBookings();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-teal-800 dark:text-teal-300">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage your bookings.
          </p>
        </div>

        <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          {loading ? (
            <Loader text="Loading bookings..." />
          ) : bookings.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">No bookings yet.</p>
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
                      👥 {booking.guests} Guest{booking.guests > 1 ? "s" : ""}
                    </p>
                    <p>👤 {booking.full_name}</p>
                    <p>📧 {booking.email}</p>
                    <p>📞 {booking.phone}</p>

                    <div className="flex gap-3 mt-5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/booking/edit/${booking.id}`)}
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
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
}

export default Dashboard;
