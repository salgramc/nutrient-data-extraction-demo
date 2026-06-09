import { uploadPdf } from "../api";

export default function PDFUploader({ onUpload }) {
  // These logs were helpful while debugging the upload flow.
  // I wanted to verify the component was rendering and
  // that events were firing when expected.

  console.log("PDFUploader rendered");

  async function handleFileChange(event) {
    console.log("File selected");

    const file = event.target.files[0];

    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("Uploading:", file.name);

    try {
      // Send the selected PDF to the backend.
      // The backend is responsible for calling
      // the Nutrient Data Extraction API.

      const result = await uploadPdf(file);

      console.log("Upload finished");

      // Request IDs were useful when debugging.
      // They helped confirm Nutrient was returning
      // a new response for each upload.

      console.log("Request ID:", result.requestId);

      // During development I logged the entire response
      // so I could inspect the structure and understand
      // where student data and table data were located.

      console.log("Full response:", result);

      if (onUpload) {
        console.log("Calling onUpload...");

        // Pass the extracted document back to App.jsx.
        // App.jsx becomes the source of truth for
        // the currently loaded transcript.

        onUpload(result);
      } else {
        console.log("onUpload is undefined");
      }
    } catch (error) {
      // If something breaks, this helps determine
      // whether the issue occurred before reaching
      // the backend or after the API call.

      console.error("UPLOAD ERROR:", error);
    }
  }

  return (
    <div
      style={{
        border: "2px dashed #ccc",
        borderRadius: "12px",
        padding: "30px",
        marginBottom: "20px",
        textAlign: "center",
      }}
    >
      <h3>Upload Transcript PDF</h3>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />
    </div>
  );
}