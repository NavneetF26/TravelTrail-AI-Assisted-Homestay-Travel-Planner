import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Toast, Modal } from "../components/ui";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const API = "http://127.0.0.1:8000/api";

function Settings() {
  const navigate = useNavigate();
  const { logout, updateUser } = useAuth();

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [name, setName] = useState(storedUser.name || "");
  const [email] = useState(storedUser.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [errors, setErrors] = useState({});

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

  const saveProfile = async () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) return;

    try {
      setSavingProfile(true);

      const response = await fetch(`${API}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Unable to update profile.");
      }

      updateUser(data.user);

      showToast("Profile updated successfully!");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;
    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your new password.";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) return;

    try {
      setSavingPassword(true);

      const response = await fetch(`${API}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Unable to update password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showToast("Password updated successfully!");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const deleteAccount = async () => {
    try {
      setDeletingAccount(true);

      const response = await fetch(`${API}/auth/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Some backends return 204 No Content on delete — guard against empty body
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Unable to delete account.");
      }

      setShowDeleteModal(false);
      logout();
      navigate("/");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-teal-800 dark:text-teal-300">
            Settings
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your account and preferences.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-teal-800 dark:text-teal-300 mb-6">
              Profile Information
            </h2>

            <div className="space-y-5">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />

              <Input label="Email" type="email" value={email} disabled />

              <div className="flex justify-end">
                <Button onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </section>

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

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-teal-800 dark:text-teal-300 mb-6">
              Change Password
            </h2>

            <div className="space-y-5">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                error={errors.currentPassword}
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={errors.newPassword}
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />

              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  disabled={savingPassword}
                  onClick={changePassword}
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-teal-800 dark:text-teal-300">
              Account
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Logout from your TravelTrail account.
            </p>

            <div className="mt-5">
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 border border-red-200 dark:border-red-800">
            <h2 className="text-2xl font-semibold text-red-600">
              Delete Account
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Permanently delete your account along with all your bookings and
              saved homestays. This action cannot be undone.
            </p>

            <div className="mt-5">
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        confirmLabel={deletingAccount ? "Deleting..." : "Delete Account"}
        onConfirm={deleteAccount}
        confirmDisabled={deletingAccount}
      >
        <p>
          Are you sure you want to delete your account? This will permanently
          remove your bookings and saved homestays. This action cannot be
          undone.
        </p>
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

export default Settings;
