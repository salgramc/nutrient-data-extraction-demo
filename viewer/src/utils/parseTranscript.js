export default function parseTranscript(documentData) {
  const textElements =
    documentData?.output?.elements
      ?.filter((e) => e.text)
      .map((e) => e.text) || [];

  const university =
    textElements.find((t) =>
      t.includes("UNIVERSIDAD")
    ) || "";

  const faculty =
    textElements.find((t) =>
      t.includes("FACULTAD")
    ) || "";

  const studentLine =
    textElements.find((t) =>
      /\d{7}-\d/.test(t)
    ) || "";

  const studentIdMatch =
    studentLine.match(/\d{7}-\d/);

  const studentId =
    studentIdMatch?.[0] || "";

  const studentName =
    studentLine
      .replace("Alumno: Promedio :", "")
      .replace(studentId, "")
      .trim();

  const table =
    documentData?.output?.elements?.find(
      (e) => e.type === "table"
    );

  const courses = [];

  if (table) {
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

  const semesters = [
    ...new Set(
      courses.map((c) => c.semester)
    ),
  ].sort();

  const semesterStats =
    semesters.map((semester) => {
      const semesterCourses =
        courses.filter(
          (c) =>
            c.semester === semester
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
        courses:
          semesterCourses.length,
        gpa: semesterGPA,
      };
    });

  const highestGrade =
    courses.length > 0
      ? Math.max(
          ...courses.map(
            (c) => c.grade
          )
        )
      : 0;

  const lowestGrade =
    courses.length > 0
      ? Math.min(
          ...courses.map(
            (c) => c.grade
          )
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