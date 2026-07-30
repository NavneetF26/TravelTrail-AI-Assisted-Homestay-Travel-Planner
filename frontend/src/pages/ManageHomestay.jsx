import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UploadImage from "../components/UploadImage";
import { Input, Button, Toast, Loader } from "../components/ui";

const API = `${import.meta.env.VITE_API_URL}/api`;
const AMENITIES = [
  "WiFi",
  "Parking",
  "Mountain View",
  "River View",
  "Garden",
  "Bonfire",
  "Balcony",
  "Pet Friendly",
];
const BASIC = [
  { k: "name", l: "Homestay Name" },
  { k: "location", l: "Location" },
  { k: "price", l: "Starting Price", t: "number" },
];
const ROOM_F = [
  { k: "name", l: "Room Name" },
  { k: "price", l: "Room Price", t: "number" },
  { k: "capacity", l: "Capacity", t: "number" },
  { k: "beds", l: "Beds" },
  { k: "size", l: "Room Size (e.g. 250)", t: "number" },
];
const ATTR_F = [
  { k: "name", l: "Attraction Name" },
  { k: "distance", l: "Distance" },
];
const EMPTY_ROOM = {
  name: "",
  price: "",
  capacity: "",
  beds: "",
  size: "",
  image: "",
  features: "",
};
const EMPTY_ATTR = { name: "", distance: "", image: "" };
const EMPTY_FORM = {
  name: "",
  location: "",
  price: "",
  description: "",
  images: ["", "", ""],
  amenities: [],
  nearby_attractions: [EMPTY_ATTR],
  rooms: [{ id: 1, ...EMPTY_ROOM }],
};
const sqFt = (v, add) => {
  const num = String(v || "")
    .replace(/\s*sq\.?\s*ft\.?$/i, "")
    .trim();
  return add ? (num ? `${num} sq.ft` : num) : num;
};

function ListEditor({
  items,
  fields,
  errors = [],
  onChange,
  max,
  label,
  wide,
  notify,
}) {
  const upd = (i, k, v) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const add = () =>
    items.length < max &&
    onChange([
      ...items,
      { id: Date.now(), ...(wide ? EMPTY_ROOM : EMPTY_ATTR) },
    ]);
  const rm = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-300">
          {label}
        </h2>
        {items.length < max && (
          <Button size="sm" onClick={add}>
            + Add
          </Button>
        )}
      </div>
      <div className="space-y-5">
        {items.map((it, i) => (
          <div
            key={it.id ?? i}
            className="space-y-4 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-800 p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <Input
                  key={f.k}
                  type={f.t}
                  placeholder={f.l}
                  value={f.k === "size" ? sqFt(it[f.k]) : it[f.k]}
                  error={errors[i]?.[f.k]}
                  onChange={(e) => upd(i, f.k, e.target.value)}
                />
              ))}
            </div>
            <UploadImage
              onUpload={(url) => upd(i, "image", url)}
              onError={(m) => notify(m, "error")}
            />
            {it.image && (
              <img
                src={it.image}
                alt=""
                className={`w-full rounded-lg object-cover ${wide ? "h-40" : "h-32"}`}
              />
            )}
            {errors[i]?.image && (
              <p className="text-sm text-red-700 dark:text-red-400">
                {errors[i].image}
              </p>
            )}
            {wide && (
              <Input
                placeholder="Features (WiFi, TV, Balcony)"
                value={it.features}
                onChange={(e) => upd(i, "features", e.target.value)}
              />
            )}
            {items.length > 1 && (
              <Button variant="danger" size="sm" onClick={() => rm(i)}>
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ManageHomestay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const notify = (message, variant = "success") =>
    setToast({ message, variant });
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API}/homestays/${id}`);
        if (!res.ok) throw new Error("Homestay not found");
        const data = await res.json();
        setForm({
          ...EMPTY_FORM,
          ...data,
          rooms: (data.rooms || []).map((r) => ({
            ...r,
            features: (r.features || []).join(", "),
          })),
        });
      } catch (err) {
        notify(err.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);
  const change = (f) => (e) => set({ [f]: e.target.value });
  const updImg = (i, url) =>
    set({ images: form.images.map((im, idx) => (idx === i ? url : im)) });
  const toggleAmenity = (a) =>
    set({
      amenities: form.amenities.includes(a)
        ? form.amenities.filter((x) => x !== a)
        : [...form.amenities, a],
    });
  function validate() {
    const listErrors = (items, fields) =>
      items.map((it) => {
        const e = {};
        fields.forEach((f) => {
          if (!String(it[f.k]).trim()) e[f.k] = "Required";
        });
        if (!it.image) e.image = "Image required";
        return e;
      });
    const basicMissing =
      !form.name.trim() ||
      !form.location.trim() ||
      !form.price ||
      !form.description.trim() ||
      !form.images.some(Boolean) ||
      !form.amenities.length;
    const rooms = listErrors(form.rooms, ROOM_F);
    const attractions = listErrors(form.nearby_attractions, ATTR_F);
    const bad =
      basicMissing ||
      rooms.some((r) => Object.keys(r).length) ||
      attractions.some((a) => Object.keys(a).length);
    const err = {
      name: !form.name.trim() && "Required",
      location: !form.location.trim() && "Required",
      price: !form.price && "Required",
      description: !form.description.trim() && "Required",
      images: !form.images.some(Boolean) && "Add at least one image",
      amenities: !form.amenities.length && "Select at least one amenity",
      rooms,
      attractions,
    };
    return { err, bad };
  }

  async function handleSubmit() {
    if (!id) {
      const { err, bad } = validate();
      setErrors(err);
      if (bad) return notify("Please fill all required fields.", "error");
    }
    try {
      setSaving(true);
      const body = {
        ...form,
        price: Number(form.price),
        images: form.images.filter(Boolean),
        rooms: form.rooms.map((r) => ({
          ...r,
          price: Number(r.price),
          capacity: Number(r.capacity),
          size: sqFt(r.size, true),
          features: r.features
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
        })),
      };
      const res = await fetch(
        id ? `${API}/homestays/${id}` : `${API}/homestays/`,
        {
          method: id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Something went wrong.");
      notify(id ? "Homestay updated!" : "Homestay created!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader text="Loading..." />;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 px-6 text-3xl font-bold text-teal-800 dark:text-teal-300 md:px-10">
        {id ? "Edit Homestay" : "Add Homestay"}
      </h1>
      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow p-6 md:p-10 space-y-10">
        <div className="space-y-4 rounded-lg border bg- border-gray-300 p-5 dark:border-slate-600  dark:bg-slate-800">
          <div className="grid gap-5 md:grid-cols-3">
            {BASIC.map((f) => (
              <Input
                key={f.k}
                type={f.t}
                placeholder={f.l}
                value={form[f.k]}
                error={errors[f.k]}
                onChange={change(f.k)}
              />
            ))}
          </div>
          <div>
            <textarea
              rows="5"
              placeholder="Description"
              value={form.description}
              onChange={change("description")}
              className="w-full rounded-lg border border-gray-400 bg-white p-3 text-gray-900 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300"
            />
            {errors.description && (
              <p className="text-sm text-red-700 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold text-teal-800 dark:text-teal-300">
            Homestay Images
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {form.images.map((img, i) => (
              <div key={i} className="min-w-0 space-y-2">
                <UploadImage
                  onUpload={(url) => updImg(i, url)}
                  onError={(m) => notify(m, "error")}
                />
                {img && (
                  <img
                    src={img}
                    alt=""
                    className="h-36 w-full rounded-lg object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          {errors.images && (
            <p className="text-sm text-red-700 dark:text-red-400 mt-2">
              {errors.images}
            </p>
          )}
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold text-teal-800 dark:text-teal-300">
            Amenities
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {AMENITIES.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 text-gray-800 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 accent-teal-600"
                  checked={form.amenities.includes(item)}
                  onChange={() => toggleAmenity(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          {errors.amenities && (
            <p className="text-sm text-red-700 dark:text-red-400 mt-2">
              {errors.amenities}
            </p>
          )}
        </div>
        <ListEditor
          items={form.nearby_attractions}
          fields={ATTR_F}
          errors={errors.attractions}
          max={3}
          label="Nearby Attractions"
          notify={notify}
          onChange={(nearby_attractions) => set({ nearby_attractions })}
        />
        <ListEditor
          items={form.rooms}
          fields={ROOM_F}
          errors={errors.rooms}
          max={5}
          label="Rooms"
          wide
          notify={notify}
          onChange={(rooms) => set({ rooms })}
        />
        <Button
          disabled={saving}
          onClick={handleSubmit}
          className="w-full md:w-auto"
        >
          {saving ? "Saving..." : id ? "Update Homestay" : "Create Homestay"}
        </Button>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
