import { useState, useEffect } from "react";

function App() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    state: "",
    lga: "",
    street: "",
    description: "",
    photo: null
  });

  const API_URL = "http://localhost:5000/api/reports"; // replace with deployed backend if needed

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("state", form.state);
    formData.append("lga", form.lga);
    formData.append("street", form.street);
    formData.append("description", form.description);
    if (form.photo) formData.append("photo", form.photo);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      const newReport = await res.json();
      setReports([newReport, ...reports]);
      setForm({ state: "", lga: "", street: "", description: "", photo: null });
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🚧 Road Condition Reports</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
        <input name="lga" value={form.lga} onChange={handleChange} placeholder="LGA" required />
        <input name="street" value={form.street} onChange={handleChange} placeholder="Street" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit Report</button>
      </form>

      <ul>
        {Array.isArray(reports) && reports.map(r => (
          <li key={r.id}>
            {r.state} - {r.lga} - {r.street}: {r.description} {r.photo && <img src={r.photo} alt="report" width={100} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
