import { useEffect, useState } from "react";

function App() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    state: "",
    lga: "",
    street: "",
    description: "",
    photo: null,
  });

  // Fetch existing reports from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle photo file selection
  const handlePhotoChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("state", form.state);
    formData.append("lga", form.lga);
    formData.append("street", form.street);
    formData.append("description", form.description);
    if (form.photo) formData.append("photo", form.photo);

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData,
      });

      const newReport = await res.json();
      setReports([newReport, ...reports]); // Add new report to top
      setForm({ state: "", lga: "", street: "", description: "", photo: null });
    } catch (err) {
      console.error("Error submitting report:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🚧 Road Condition Reports</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          required
          style={{ marginRight: "0.5rem" }}
        />
        <input
          name="lga"
          value={form.lga}
          onChange={handleChange}
          placeholder="LGA"
          required
          style={{ marginRight: "0.5rem" }}
        />
        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          placeholder="Street"
          required
          style={{ marginRight: "0.5rem" }}
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          style={{ marginRight: "0.5rem" }}
        />
        <input type="file" onChange={handlePhotoChange} style={{ marginRight: "0.5rem" }} />
        <button type="submit">Submit Report</button>
      </form>

      {/* Reports list */}
      <ul>
        {Array.isArray(reports) && reports.map((r) => (
          <li key={r.id} style={{ marginBottom: "1rem" }}>
            <strong>{r.state} - {r.lga} - {r.street}</strong>
            <p>{r.description}</p>
            {r.photo && (
              <img
                src={r.photo}
                alt="report"
                style={{ width: "200px", marginTop: "0.5rem" }}
              />
            )}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
