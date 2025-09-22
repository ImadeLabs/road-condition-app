import { useEffect, useState } from "react";

function App() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    state: "",
    lga: "",
    street: "",
    description: "",
    photo: null, // for file
  });

  // Fetch reports
  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("state", form.state);
    formData.append("lga", form.lga);
    formData.append("street", form.street);
    formData.append("description", form.description);
    if (form.photo) formData.append("photo", form.photo);

    const res = await fetch("http://localhost:5000/api/reports", {
      method: "POST",
      body: formData,
    });

    const newReport = await res.json();
    setReports([newReport, ...reports]); // prepend new report
    setForm({ state: "", lga: "", street: "", description: "", photo: null });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🚧 Road Condition Reports</h1>

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
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          style={{ marginRight: "0.5rem" }}
        />
        <button type="submit">Submit Report</button>
      </form>

      <ul>
        {reports.map((r) => (
          <li key={r.id} style={{ marginBottom: "1rem" }}>
            <strong>{r.street}, {r.lga}, {r.state}</strong>
            <p>{r.description}</p>
            {r.photo && (
              <img src={r.photo} alt="report" style={{ maxWidth: "300px" }} />
            )}
            <small>{new Date(r.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
