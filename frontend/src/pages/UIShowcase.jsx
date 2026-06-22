/*
UI COMPONENT SHOWCASE

Run the application and visit:
http://localhost:5173/UIShowcase

This page demonstrates:
- Buttons
- Inputs
- Loader
- Toast notifications
- Responsive design
- Light/Dark mode support

Created for Week 3 deliverables.
*/
import { useState } from "react";

import { Button, Input, Modal, Toast, Loader } from "../components/ui";

function UIShowcase() {
  const [openModal, setOpenModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">UI Component Showcase</h1>

      {/* BUTTONS */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>

        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>

          <Button variant="secondary">Secondary</Button>

          <Button variant="outline">Outline</Button>

          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* INPUTS */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Inputs</h2>

        <div className="space-y-4 max-w-md">
          <Input label="Email" placeholder="Enter email" />

          <Input label="Destination" placeholder="Where do you want to go?" />

          <Input
            label="Budget"
            placeholder="Enter budget"
            error="Example error message"
          />
        </div>
      </section>

      {/* MODAL */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Modal</h2>

        <Button onClick={() => setOpenModal(true)}>Open Modal</Button>

        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title="Booking Confirmation"
        >
          <p>This is a sample modal.</p>
        </Modal>
      </section>

      {/* TOAST */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Toast</h2>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => {
              setShowToast("success");
              setTimeout(() => setShowToast(false), 3000);
            }}
          >
            Success Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setShowToast("info");
              setTimeout(() => setShowToast(false), 3000);
            }}
          >
            Info Toast
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setShowToast("warning");
              setTimeout(() => setShowToast(false), 3000);
            }}
          >
            Warning Toast
          </Button>

          <Button
            onClick={() => {
              setShowToast("error");
              setTimeout(() => setShowToast(false), 3000);
            }}
          >
            Error Toast
          </Button>
        </div>

        {showToast && (
          <Toast
            variant={showToast}
            message={
              showToast === "success"
                ? "Booking request submitted!"
                : showToast === "info"
                  ? "New AI features available."
                  : showToast === "warning"
                    ? "Please complete all required fields."
                    : "Something went wrong!"
            }
          />
        )}
      </section>

      {/* LOADER */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Loader</h2>

        <Loader />
      </section>
    </div>
  );
}

export default UIShowcase;
