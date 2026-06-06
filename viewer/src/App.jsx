import { useState } from "react";

import PDFUploader from "./components/PDFUploader";
import StudentCard from "./components/StudentCard";
import UniversityCard from "./components/UniversityCard";
import CoursesTable from "./components/CoursesTable";
import GPACard from "./components/GPACard";

import parseTranscript from "./utils/parseTranscript";

export default function App() {
  const [documentData, setDocumentData] = useState(null);

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
            console.log(
              "App received:",
              result.requestId
            );

            setDocumentData(result);
          }}
        />
      </div>
    );
  }

  console.log("Current document:", documentData);

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
          console.log(
            "App received:",
            result.requestId
          );

          setDocumentData(result);
        }}
      />

      <StudentCard
        studentName={studentName}
        studentId={studentId}
      />

      <UniversityCard
        university={university}
        faculty={faculty}
      />

      <GPACard average={average} />

      <CoursesTable courses={courses} />
    </div>
  );
}