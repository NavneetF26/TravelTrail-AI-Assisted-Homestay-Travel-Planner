import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Input, Button, Toast, Loader } from "../components/ui";

const API = "http://127.0.0.1:8000/api";
const FIELD_GROUPS = [
  [
    {
      name: "full_name",
      label: "Full Name",
      placeholder: "Enter your full name",
    },
  ],
  [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
    },
    { name: "phone", label: "Phone", placeholder: "10-digit phone number" },
  ],
  [
    { name: "check_in", label: "Check-in", type: "date" },
    { name: "check_out", label: "Check-out", type: "date" },
  ],
  [
    {
      name: "guests",
      label: "Guests",
      type: "number",
      placeholder: "Number of guests",
    },
  ],
];

function Booking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const editMode = location.pathname.includes("/edit/");
  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    room_id: "",
    full_name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const showToast = (message, variant = "success") =>
    setToast({ show: true, message, variant });

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadData() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    try {
      setLoading(true);
      let homestayId = id;
      let prefill = {
        room_id: location.state?.roomId,
        full_name: user?.name || "",
        email: user?.email || "",
      };

      if (editMode) {
        const res = await fetch(`${API}/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) return logoutRedirect();
        if (!res.ok) throw new Error("Unable to load booking.");
        prefill = await res.json();
        homestayId = prefill.homestay_id;
      }

      const home = await (await fetch(`${API}/homestays/${homestayId}`)).json();
      setHomestay(home);
      setForm((p) => ({
        ...p,
        room_id: prefill.room_id || home.rooms[0].id,
        full_name: prefill.full_name || "",
        email: prefill.email || "",
        phone: prefill.phone || "",
        check_in: prefill.check_in || "",
        check_out: prefill.check_out || "",
        guests: prefill.guests || "",
      }));
    } catch {
      showToast("Unable to load booking", "error");
    } finally {
      setLoading(false);
    }
  }

  function logoutRedirect() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const change = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  function validate(room) {
    const err = {};
    const today = new Date().toISOString().split("T")[0];
    for (const k in form) if (!form[k]) err[k] = "Required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter a valid email address";
    if (form.phone && !/^\d{10}$/.test(form.phone))
      err.phone = "Phone number must be exactly 10 digits";
    if (form.check_in && form.check_in < today)
      err.check_in = "Check-in cannot be before today";
    if (form.check_in && form.check_out && form.check_out <= form.check_in)
      err.check_out = "Check-out must be after check-in";
    if (room && form.guests && Number(form.guests) > room.capacity)
      err.guests = `Maximum ${room.capacity} guests allowed`;
    setErrors(err);
    if (Object.keys(err).length) {
      showToast(Object.values(err)[0], "error");
      return false;
    }
    return true;
  }

  async function submit(room) {
    if (!validate(room)) return;
    const token = localStorage.getItem("token");
    const body = {
      ...form,
      homestay_id: homestay.id,
      room_id: Number(form.room_id),
      guests: Number(form.guests),
    };
    try {
      setSubmitting(true);
      const res = await fetch(
        editMode ? `${API}/bookings/${id}` : `${API}/bookings/`,
        {
          method: editMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );
      if (res.status === 401) return logoutRedirect();
      const data = await res.json();
      if (!res.ok)
        return showToast(
          Array.isArray(data.detail)
            ? data.detail[0].msg
            : data.detail || "Something went wrong.",
          "error",
        );
      showToast(
        editMode
          ? "Booking updated successfully"
          : "Booking submitted successfully",
      );
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch {
      showToast("Unable to connect to the server.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader text="Loading..." />;
  if (!homestay) return <p className="text-red-500">Homestay not found</p>;
  const room = homestay.rooms.find((r) => r.id === Number(form.room_id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300">
          {editMode ? "Update Booking" : "Booking Request"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {editMode ? "Update your booking details." : "Fill in your details."}
        </p>
      </div>
      <div className="grid lg:grid-cols-[320px_1fr] gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">
          <h2 className="text-xl font-bold text-teal-700 dark:text-teal-300">
            {homestay.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {homestay.location}
          </p>
          <div className="mt-5">
            <p className="font-semibold">{room?.name}</p>
            <p className="text-gray-500 dark:text-gray-400">
              👥 {room?.capacity} Guests
            </p>
            <p className="font-bold text-green-700 dark:text-green-400">
              ₹{room?.price}/night
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-700 rounded-2xl shadow p-8">
          <div className="space-y-5">
            {FIELD_GROUPS.map((group, i) => (
              <div
                key={i}
                className={group.length > 1 ? "grid md:grid-cols-2 gap-5" : ""}
              >
                {group.map((f) => (
                  <Input
                    key={f.name}
                    label={f.label}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={change(f.name)}
                    error={errors[f.name]}
                    disabled={f.name === "full_name" || f.name === "email"}
                  />
                ))}
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                disabled={submitting}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button disabled={submitting} onClick={() => submit(room)}>
                {submitting
                  ? "Saving..."
                  : editMode
                    ? "Update Booking"
                    : "Submit Request"}
              </Button>
            </div>
          </div>
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

export default Booking;
