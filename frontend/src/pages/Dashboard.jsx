import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Modal, Button, Toast } from "../components/ui";

const API = `${import.meta.env.VITE_API_URL}/api`;
const STATUS_CLASS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [saved, setSaved] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState({ saved: true, bookings: true });
  const [selBooking, setSelBooking] = useState(null);
  const [selHomestay, setSelHomestay] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (message, variant = "success") =>
    setToast({ message, variant });
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  async function authedFetch(url, options = {}) {
    if (!token) return navigate("/login");
    const res = await fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) return logout();
    return res;
  }

  async function load(url, setter, key) {
    try {
      key && setLoading((p) => ({ ...p, [key]: true }));
      const res = await authedFetch(url);
      if (res) setter(await res.json());
    } catch {
      key && showToast(`Failed to load ${key}`, "error");
    } finally {
      key && setLoading((p) => ({ ...p, [key]: false }));
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(`${API}/saved/`, setSaved, "saved");
    load(`${API}/bookings/`, setBookings, "bookings");
    load(`${API}/homestays/my`, setHomestays);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function deleteHomestay() {
    setDeleting(true);
    const res = await authedFetch(`${API}/homestays/${selHomestay.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res) return;
    setHomestays((p) => p.filter((h) => h.id !== selHomestay.id));
    setSelHomestay(null);
    showToast("Homestay deleted");
  }

  async function deleteBooking() {
    setDeleting(true);
    const res = await authedFetch(`${API}/bookings/${selBooking.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res) return;
    setSelBooking(null);
    load(`${API}/bookings/`, setBookings, "bookings");
    showToast("Booking cancelled");
  }

  const Card = ({ h, actions }) => (
    <div className="border rounded-xl overflow-hidden flex flex-col">
      <img
        src={h.images?.[0]}
        alt={h.name}
        className="h-52 w-full object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-xl font-semibold">{h.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">
          📍 {h.location}
        </p>
        {actions}
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-teal-800 dark:text-teal-300">
          Dashboard
        </h1>
        <p className="mt-2 mb-10 text-gray-600 dark:text-gray-300">
          Manage your homestays, saved homestays and bookings.
        </p>
        <section className="mb-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300">
              My Homestays
            </h2>
            <Button onClick={() => navigate("/manage-homestay")}>
              + Add Homestay
            </Button>
          </div>
          {homestays.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">
              You haven't added any homestays yet.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {homestays.map((h) => (
                <Card
                  key={h.id}
                  h={h}
                  actions={
                    <>
                      <p className="font-semibold text-teal-700 dark:text-teal-300 -mt-2 mb-2">
                        ₹{h.price}/night
                      </p>
                      <div className="flex gap-3 mt-auto">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/homestay/${h.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/manage-homestay/${h.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setSelHomestay(h)}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </section>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-5">
              Saved Homestays
            </h2>
            {loading.saved ? (
              <Loader text="Loading saved homestays..." />
            ) : saved.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300">
                No saved homestays yet.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {saved.map((h) => (
                  <Card
                    key={h.id}
                    h={h}
                    actions={
                      <Button
                        size="sm"
                        className="mt-auto w-full"
                        onClick={() => navigate(`/homestay/${h.id}`)}
                      >
                        View Details
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </section>
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-5">
              My Bookings
            </h2>
            {loading.bookings ? (
              <Loader text="Loading bookings..." />
            ) : bookings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300">
                No bookings yet.
              </p>
            ) : (
              <div className="space-y-5">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="border rounded-xl p-5 flex justify-between gap-5 flex-wrap"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-300">
                        {b.homestay_name}
                      </h2>
                      <p className="text-teal-800 dark:text-teal-300">
                        {b.room_type}
                      </p>
                      <p className="mt-2">📍 {b.location}</p>
                      <p>
                        📅 {b.check_in} → {b.check_out}
                      </p>
                      <p>
                        👥 {b.guests} Guest{b.guests > 1 ? "s" : ""}
                      </p>
                      <p>👤 {b.full_name}</p>
                      <p>📧 {b.email}</p>
                      <p>📞 {b.phone}</p>
                      <div className="flex gap-3 mt-5">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/booking/edit/${b.id}`)}
                        >
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelBooking(b)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <span
                      className={`h-fit rounded px-3 py-2 text-sm font-medium ${STATUS_CLASS[b.status] || "bg-green-100 text-green-700"}`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Modal
        isOpen={!!selBooking}
        onClose={() => setSelBooking(null)}
        title="Delete Booking"
      >
        <p className="mb-5">Are you sure you want to cancel this booking?</p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            disabled={deleting}
            onClick={() => setSelBooking(null)}
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
      <Modal
        isOpen={!!selHomestay}
        onClose={() => setSelHomestay(null)}
        title="Delete Homestay"
      >
        <p className="mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{selHomestay?.name}</span>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            disabled={deleting}
            onClick={() => setSelHomestay(null)}
          >
            No
          </Button>
          <Button variant="danger" disabled={deleting} onClick={deleteHomestay}>
            {deleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </Modal>
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
