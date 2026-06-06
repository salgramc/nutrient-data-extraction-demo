import { uploadPdf } from "../api";

export default function PDFUploader({ onUpload }) {
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
      const result = await uploadPdf(file);

      console.log("Upload finished");
      console.log("Request ID:", result.requestId);
      console.log("Full response:", result);

      if (onUpload) {
        console.log("Calling onUpload...");
        onUpload(result);
      } else {
        console.log("onUpload is undefined");
      }
    } catch (error) {
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