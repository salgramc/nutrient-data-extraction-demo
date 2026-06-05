import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const formData = new FormData();

formData.append(
  "instructions",
  JSON.stringify({
    mode: "understand",
    output: {
      format: "spatial",
      includeWords: true
    },
    options: {
      language: "english"
    }
  })
);

formData.append(
  "file",
  fs.createReadStream("./sample-documents/test.pdf")
);

try {
  const response = await axios.post(
    "https://api.nutrient.io/extraction/parse",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.NUTRIENT_API_KEY}`
      },
      responseType: "stream"
    }
  );

  const writer = fs.createWriteStream("result.json");

  response.data.pipe(writer);

  writer.on("finish", () => {
    console.log("✅ Extraction complete!");
    console.log("Saved to result.json");
  });
} catch (error) {
  console.error(
    error.response?.data || error.message
  );
}