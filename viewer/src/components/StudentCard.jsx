export default function StudentCard({
  studentName,
  studentId,
}) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h2>{studentName}</h2>
      <p>ID: {studentId}</p>
    </div>
  );
}