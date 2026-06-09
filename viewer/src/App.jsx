import { useState } from "react";

import PDFUploader from "./components/PDFUploader";
import StudentCard from "./components/StudentCard";
import UniversityCard from "./components/UniversityCard";
import CoursesTable from "./components/CoursesTable";
import GPACard from "./components/GPACard";

import parseTranscript from "./utils/parseTranscript";

export default function App() {
  // Store the most recently uploaded Nutrient response.
  // When the app first loads, no transcript has been uploaded yet.

  const [documentData, setDocumentData] = useState(null);

  // Show only the uploader until a transcript is available.

  if (!documentData) {
    return (
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "2rem",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>Academic Transcript Analyzer</h1>

        <PDFUploader
          onUpload={(result) => {
            // Helpful during debugging to confirm
            // a new Nutrient response was received.

            console.log(
              "App received:",
              result.requestId
            );

            // Save the uploaded transcript so the UI
            // can render the extracted information.

            setDocumentData(result);
          }}
        />
      </div>
    );
  }

  // I used this log extensively while debugging.
  // It helped confirm whether React was receiving
  // fresh document data after each upload.

  console.log("Current document:", documentData);

  // Convert the raw Nutrient response into a simpler
  // object that the UI components can consume.

  const {
    university,
    faculty,
    studentName,
    studentId,
    average,
    courses,
  } = parseTranscript(documentData);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Academic Transcript Analyzer</h1>

      <PDFUploader
        onUpload={(result) => {
          // Allow users to upload another transcript
          // without refreshing the page.

          console.log(
            "App received:",
            result.requestId
          );

          setDocumentData(result);
        }}
      />

      {/* Student information extracted from the transcript */}

      <StudentCard
        studentName={studentName}
        studentId={studentId}
      />

      {/* University and faculty information */}

      <UniversityCard
        university={university}
        faculty={faculty}
      />

      {/* GPA calculated from extracted course grades */}

      <GPACard average={average} />

      {/* Course history extracted from the transcript table */}

      <CoursesTable courses={courses} />
    </div>
  );
}