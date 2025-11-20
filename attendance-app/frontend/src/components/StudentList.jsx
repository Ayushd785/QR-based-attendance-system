import { useState, useEffect } from "react";
import api from "../services/api";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    course: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students");
      setStudents(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/students/add", formData);
      setStudents([...students, response.data]);
      setFormData({ studentId: "", name: "", email: "", course: "" });
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add student");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete student");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading students...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Roster
          </p>
          <h2 className="text-3xl font-semibold">Student management</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white font-medium shadow-lg shadow-indigo-900/40 hover:opacity-90 transition"
        >
          {showAddForm ? "Cancel" : "+ Add student"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-inner shadow-slate-950/40">
          <h3 className="text-xl font-semibold mb-4">Add new student</h3>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: "studentId",
                  label: "Student ID *",
                  type: "text",
                  required: true,
                },
                { key: "name", label: "Name *", type: "text", required: true },
                {
                  key: "email",
                  label: "Email",
                  type: "email",
                  required: false,
                },
                {
                  key: "course",
                  label: "Course",
                  type: "text",
                  required: false,
                },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-sm text-slate-400">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.key]}
                    required={field.required}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold shadow-lg shadow-emerald-900/40 hover:opacity-95 transition"
            >
              Add student
            </button>
          </form>
        </div>
      )}

      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 overflow-hidden shadow-inner shadow-slate-950/40">
        <div className="px-6 py-4 border-b border-slate-800/70 flex items-center justify-between">
          <h3 className="text-lg font-semibold">All students</h3>
          <span className="text-xs text-slate-400">
            Total: {students.length}
          </span>
        </div>
        {students.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No students yet. Create your first entry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900/80">
                <tr>
                  {["Student ID", "Name", "Email", "Course", "Actions"].map(
                    (label) => (
                      <th
                        key={label}
                        className={`px-6 py-3 text-left font-medium uppercase tracking-wide text-slate-400 ${
                          label === "Actions" ? "text-right" : ""
                        }`}
                      >
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-800/50 transition"
                  >
                    <td className="px-6 py-3 font-semibold text-white">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-3 text-slate-200">{student.name}</td>
                    <td className="px-6 py-3 text-slate-400">
                      {student.email || "-"}
                    </td>
                    <td className="px-6 py-3 text-slate-400">
                      {student.course || "-"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="text-sm font-medium text-rose-400 hover:text-rose-300 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
