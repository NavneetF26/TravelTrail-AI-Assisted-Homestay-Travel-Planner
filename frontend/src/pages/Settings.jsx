import { useState } from "react";
import { Input, Button, Toast } from "../components/ui";
import ThemeToggle from "../components/ThemeToggle";

function Settings() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("+91 9876543210");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const saveProfile = () => {
    setToast({
      show: true,
      message: "Profile updated successfully!",
      variant: "success",
    });
  };

  const changePassword = () => {
    setToast({
      show: true,
      message: "Password feature coming soon.",
      variant: "info",
    });
  };

  const logout = () => {
    setToast({
      show: true,
      message: "Logged out successfully.",
      variant: "warning",
    });
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-teal-800 dark:text-teal-300">
            Settings
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your account and preferences.
          </p>
        </div>

        <div className="space-y-8">

          {/* Profile */}

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-teal-800 dark:text-teal-300 mb-6">
              Profile Information
            </h2>

            <div className="space-y-5">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="flex justify-end">
                <Button onClick={saveProfile}>
                  Save Changes
                </Button>
              </div>
            </div>
          </section>

          {/* Appearance */}

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-teal-800 dark:text-teal-300">
                  Appearance
                </h2>

                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Switch between Light and Dark mode.
                </p>
              </div>

              <ThemeToggle />
            </div>
          </section>

          {/* Security */}

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-teal-800 dark:text-teal-300">
              Security
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Change your account password.
            </p>

            <div className="mt-5">
              <Button variant="secondary" onClick={changePassword}>
                Change Password
              </Button>
            </div>
          </section>

          {/* Logout */}

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-red-600">
              Account
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Logout from your TravelTrail account.
            </p>

            <div className="mt-5">
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </section>

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
    </>
  );
}

export default Settings;