import { useState } from "react";
import { Button, Modal, Toast } from "../components/ui";
import { Link } from "react-router-dom";

function Dashboard() {
  const [logoutModal, setLogoutModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "info",
  });

  const showInfoToast = () => {
    setToast({
      show: true,
      message: "This feature will be available soon.",
      variant: "info",
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-800 dark:text-teal-300">
            Welcome, User 👋
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your bookings, saved homestays and travel plans.
          </p>
        </div>

        {/* 2x2 GRID */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* BOOKING REQUESTS (TOP RIGHT) */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-300">
                My Booking Requests
              </h2>

              <Button variant="outline" onClick={showInfoToast}>
                View All
              </Button>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>

                  <div>
                    <h3 className="font-semibold">Mountain View Cottage</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Check-in - Check-out
                    </p>
                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100">
                  Pending
                </span>
              </div>

              <div className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>

                  <div>
                    <h3 className="font-semibold">Riverside Retreat</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Check-in - Check-out
                    </p>
                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100">
                  Confirmed
                </span>
              </div>
            </div>
          </section>

          {/* SAVED HOMESTAYS (BOTTOM LEFT) */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-300">
                Saved Homestays
              </h2>

              <Button variant="outline" onClick={showInfoToast}>
                View All
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-3">
                <div className="w-full h-14 bg-gray-200 dark:bg-slate-500 rounded mb-2"></div>
                <h3 className="text-sm font-semibold">Mountain View</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mussoorie
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <div className="w-full h-14 bg-gray-200 dark:bg-slate-500 rounded mb-2"></div>
                <h3 className="text-sm font-semibold">Riverside</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rishikesh
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <div className="w-full h-14 bg-gray-200 dark:bg-slate-500 rounded mb-2"></div>
                <h3 className="text-sm font-semibold">Forest Escape</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dehradun
                </p>
              </div>
            </div>
          </section>

          {/* AI PLANS (BOTTOM RIGHT) */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-300">
                Previous AI Plans
              </h2>

              <Button variant="outline" onClick={showInfoToast}>
                View All
              </Button>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Trip to Manali</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    4 Days • ₹5000
                  </p>
                </div>

                <Link to="/travelplanner">
                  <Button size="sm" variant="secondary">
                    View Plan
                  </Button>
                </Link>
              </div>

              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Trip to Mussoorie</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    3 Days • ₹3000
                  </p>
                </div>

                <Link to="/travelplanner">
                  <Button size="sm" variant="secondary">
                    View Plan
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* TOAST */}
      {toast.show && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      {/* MODAL */}
      <Modal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        title="Logout"
      >
        <p className="mb-5">Are you sure you want to logout?</p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setLogoutModal(false)}>
            Cancel
          </Button>

          <Button variant="secondary" onClick={() => setLogoutModal(false)}>
            Logout
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Dashboard;
