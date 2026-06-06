require("dotenv").config();

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

const upload = multer({
  dest: "uploads/",
});

app.post(
  "/api/extract",
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("=================================");
      console.log("Received file:", req.file?.originalname);

      const formData = new FormData();

      formData.append(
        "instructions",
        JSON.stringify({
          mode: "understand",
          output: {
            format: "spatial",
            includeWords: true,
          },
          options: {
            language: "english",
          },
        })
      );

      formData.append(
        "file",
        fs.createReadStream(req.file.path)
      );

      console.log("Sending to Nutrient...");

      const response = await axios.post(
        "https://api.nutrient.io/extraction/parse",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${process.env.NUTRIENT_API_KEY}`,
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      console.log("Received Nutrient response");
      console.log("Request ID:", response.data.requestId);

      fs.unlinkSync(req.file.path);

      console.log("Returning full Nutrient response");
      console.log(
        "Response size:",
        JSON.stringify(response.data).length
      );
      console.log("=================================");

      res.json(response.data);
    } catch (error) {
      console.log("=================================");
      console.error("SERVER ERROR");

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      } else {
        console.error(error);
      }

      console.log("=================================");

      res.status(500).json({
        error: "Extraction failed",
      });
    }
  }
);

app.listen(3001, () => {
  console.log(
    "Server running on http://localhost:3001"
  );
});