import axios from "axios";

export async function uploadPdf(file) {
  const formData = new FormData();

  formData.append("file", file);

  console.log("Sending request to backend...");

  try {
    const response = await axios.post(
      "http://localhost:3001/api/extract",
      formData
    );

    console.log("Backend responded");
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("========== AXIOS ERROR ==========");
    console.error(error);

    console.error("MESSAGE:");
    console.error(error.message);

    if (error.response) {
      console.error("RESPONSE:");
      console.error(error.response);
    }

    throw error;
  }
}