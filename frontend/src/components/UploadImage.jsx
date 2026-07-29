import { useState } from "react";

function UploadImage({ onUpload, onError }) {
  const [uploading, setUploading] = useState(false);

  async function upload(file) {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "traveltrail");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/zq5i6ier/image/upload",
        { method: "POST", body: formData },
      );
      const data = await res.json();
      if (data.secure_url) onUpload(data.secure_url);
      else onError?.(data.error?.message || "Image upload failed.");
    } catch (err) {
      console.error(err);
      onError?.("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => upload(e.target.files[0])}
      />
      {uploading && <p className="mt-2 text-sm">Uploading...</p>}
    </div>
  );
}

export default UploadImage;
