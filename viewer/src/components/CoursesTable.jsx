export default function CoursesTable({
  courses,
}) {
  if (!courses?.length) {
    return (
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Courses</h2>
        <p>No courses found.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h2>Courses</h2>

      <table
        width="100%"
        style={{
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th
              align="left"
              style={{
                borderBottom:
                  "1px solid #ddd",
                padding: "8px",
              }}
            >
              Semester
            </th>

            <th
              align="left"
              style={{
                borderBottom:
                  "1px solid #ddd",
                padding: "8px",
              }}
            >
              Code
            </th>

            <th
              align="left"
              style={{
                borderBottom:
                  "1px solid #ddd",
                padding: "8px",
              }}
            >
              Course
            </th>

            <th
              align="right"
              style={{
                borderBottom:
                  "1px solid #ddd",
                padding: "8px",
              }}
            >
              Grade
            </th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr key={course.code}>
              <td
                style={{
                  padding: "8px",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                {course.semester}
              </td>

              <td
                style={{
                  padding: "8px",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                {course.code}
              </td>

              <td
                style={{
                  padding: "8px",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                {course.name}
              </td>

              <td
                align="right"
                style={{
                  padding: "8px",
                  borderBottom:
                    "1px solid #eee",
                  fontWeight: "bold",
                }}
              >
                {course.grade}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}