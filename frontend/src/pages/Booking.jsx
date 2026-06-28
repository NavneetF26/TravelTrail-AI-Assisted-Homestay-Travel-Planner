import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Input, Button, Toast, Loader } from "../components/ui";

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
    // eslint-disable-next-line react-hooks/immutability
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      let homestayId = id;
      let prefill = { room_id: location.state?.roomId };

      if (editMode) {
        const booking = await (
          await fetch(`http://127.0.0.1:8000/api/bookings/${id}`)
        ).json();
        homestayId = booking.homestay_id;
        prefill = booking;
      }

      const home = await (
        await fetch(`http://127.0.0.1:8000/api/homestays/${homestayId}`)
      ).json();
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
  };

  const change = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const err = {};
    for (const k in form) if (!form[k]) err[k] = "Required";
    setErrors(err);
    return !Object.keys(err).length;
  };

  const submit = async () => {
    if (!validate()) return;
    const body = {
      ...form,
      homestay_id: homestay.id,
      room_id: Number(form.room_id),
      guests: Number(form.guests),
    };

    try {
      setSubmitting(true);
      const res = await fetch(
        editMode
          ? `http://127.0.0.1:8000/api/bookings/${id}`
          : "http://127.0.0.1:8000/api/bookings/",
        {
          method: editMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) throw new Error();
      showToast(
        editMode ? "Booking updated successfully" : "Booking submitted",
      );
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch {
      showToast(editMode ? "Update failed" : "Booking failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

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
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={form.full_name}
              onChange={change("full_name")}
              error={errors.full_name}
            />

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={change("email")}
                error={errors.email}
              />
              <Input
                label="Phone"
                placeholder="10-digit phone number"
                value={form.phone}
                onChange={change("phone")}
                error={errors.phone}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Check-in"
                type="date"
                value={form.check_in}
                onChange={change("check_in")}
                error={errors.check_in}
              />
              <Input
                label="Check-out"
                type="date"
                value={form.check_out}
                onChange={change("check_out")}
                error={errors.check_out}
              />
            </div>

            <Input
              label="Guests"
              type="number"
              placeholder="Number of guests"
              value={form.guests}
              onChange={change("guests")}
              error={errors.guests}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                disabled={submitting}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button disabled={submitting} onClick={submit}>
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
