export default function parseTranscript(documentData) {
  // Nutrient returns a lot of different element types.
  // I found it easier to first grab all text elements
  // and then search for the information I needed.

  const textElements =
    documentData?.output?.elements
      ?.filter((e) => e.text)
      .map((e) => e.text) || [];

  // University name appears as a text element.
  const university =
    textElements.find((t) =>
      t.includes("UNIVERSIDAD")
    ) || "";

  // Faculty name is also returned as text.
  const faculty =
    textElements.find((t) =>
      t.includes("FACULTAD")
    ) || "";

  // Student name and ID are returned together.
  // I use the ID pattern to find the correct line.
  const studentLine =
    textElements.find((t) =>
      /\d{7}-\d/.test(t)
    ) || "";

  const studentIdMatch =
    studentLine.match(/\d{7}-\d/);

  const studentId =
    studentIdMatch?.[0] || "";

  // Remove extra text and the ID to isolate the name.
  const studentName =
    studentLine
      .replace("Alumno: Promedio :", "")
      .replace(studentId, "")
      .trim();

  // Course information wasn't returned as text.
  // After inspecting the response, I found it inside a table.
  const table =
    documentData?.output?.elements?.find(
      (e) => e.type === "table"
    );

  const courses = [];

  if (table) {
    // Skip row 0 because it's the header row.
    for (let row = 1; row < table.rowCount; row++) {
      const codeCell = table.cells.find(
        (c) => c.row === row && c.column === 1
      );

      const nameCell = table.cells.find(
        (c) => c.row === row && c.column === 2
      );

      const gradeCell = table.cells.find(
        (c) => c.row === row && c.column === 3
      );

      if (
        codeCell &&
        nameCell &&
        gradeCell
      ) {
        const code = codeCell.text;

        // Looking at the transcript, I noticed
        // the second digit of the course code
        // matched the semester.
        //
        // 9101 -> Semester 1
        // 9201 -> Semester 2
        // 9301 -> Semester 3

        const semester =
          Number(String(code).charAt(1)) || 0;

        courses.push({
          semester,
          code,
          name: nameCell.text,
          grade: Number(gradeCell.text),
        });
      }
    }
  }

  // Calculate GPA from the extracted grades
  // instead of relying on a GPA field existing.
  const average =
    courses.length > 0
      ? (
          courses.reduce(
            (sum, course) =>
              sum + course.grade,
            0
          ) / courses.length
        ).toFixed(2)
      : "N/A";

  // Find all semesters present in the transcript.
  const semesters = [
    ...new Set(
      courses.map((c) => c.semester)
    ),
  ].sort();

  // Build semester-level statistics.
  const semesterStats =
    semesters.map((semester) => {
      const semesterCourses =
        courses.filter(
          (c) => c.semester === semester
        );

      const semesterGPA =
        (
          semesterCourses.reduce(
            (sum, c) =>
              sum + c.grade,
            0
          ) / semesterCourses.length
        ).toFixed(2);

      return {
        semester,
        courses: semesterCourses.length,
        gpa: semesterGPA,
      };
    });

  // General transcript statistics.
  const highestGrade =
    courses.length > 0
      ? Math.max(
          ...courses.map((c) => c.grade)
        )
      : 0;

  const lowestGrade =
    courses.length > 0
      ? Math.min(
          ...courses.map((c) => c.grade)
        )
      : 0;

  const passedCourses =
    courses.filter(
      (c) => c.grade >= 6
    ).length;

  const failedCourses =
    courses.filter(
      (c) => c.grade < 6
    ).length;

  // School cycle appears as a text element.
  // Example: "Ciclo Escolar: 2024 - 2026"
  const cycleLine =
    textElements.find((t) =>
      t.includes("Ciclo Escolar")
    ) || "";

  const cycleMatch =
    cycleLine.match(
      /\d{4}\s*-\s*\d{4}/
    );

  const schoolCycle =
    cycleMatch?.[0] || "";

  // Return a simplified object so the UI
  // doesn't need to understand the raw API response.
  return {
    university,
    faculty,
    studentName,
    studentId,

    average,
    schoolCycle,

    highestGrade,
    lowestGrade,

    passedCourses,
    failedCourses,

    semestersCompleted:
      semesterStats.length,

    semesterStats,

    courses,
  };
}