export default function GPACard({ average }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        textAlign: "center",
      }}
    >
      <h2>Average Grade</h2>
      <h1>{average}</h1>
    </div>
  );
}