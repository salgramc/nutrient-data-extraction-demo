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

// Allow the React frontend to call the backend locally.

app.use(cors());

// Store uploaded files temporarily before sending
// them to the Nutrient API.

const upload = multer({
  dest: "uploads/",
});

app.post(
  "/api/extract",
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("=================================");
      console.log(
        "Received file:",
        req.file?.originalname
      );

      const formData = new FormData();

      // These extraction settings came from
      // experimenting with the API and reviewing
      // the returned document structure.
      //
      // Spatial output preserves layout information,
      // which makes it easier to find tables and
      // other document elements later.

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

      // Read the uploaded PDF and attach it
      // to the request sent to Nutrient.

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

            // API key stored in .env
            // instead of hardcoding it.

            Authorization: `Bearer ${process.env.NUTRIENT_API_KEY}`,
          },

          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      console.log(
        "Received Nutrient response"
      );

      console.log(
        "Request ID:",
        response.data.requestId
      );

      // Remove the temporary uploaded file.
      // Once Nutrient returns the response,
      // we no longer need the local copy.

      fs.unlinkSync(req.file.path);

      console.log(
        "Returning full Nutrient response"
      );

      // This was useful while debugging.
      // At one point I wanted to verify that
      // the backend was actually returning
      // the complete response and not just
      // part of the payload.

      console.log(
        "Response size:",
        JSON.stringify(response.data)
          .length
      );

      console.log("=================================");

      // Forward the Nutrient response directly
      // to the React frontend.

      res.json(response.data);
    } catch (error) {
      console.log("=================================");
      console.error("SERVER ERROR");

      // Helpful when troubleshooting API issues.
      // Distinguish between a Nutrient API error
      // and an application-level error.

      if (error.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Data:",
          error.response.data
        );
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