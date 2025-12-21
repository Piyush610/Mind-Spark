import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { MaterialCard } from "../components/MaterialCard";
import { Button } from "../components/Button";
import api from "../api/axios";

export const TeacherMaterials = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "link",
    content: "",
    description: "",
    assignedTo: [], // Array of student IDs
  });
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchSubjects();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchMaterials(selectedSubject);
    } else {
      setMaterials([]);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get("/subjects");
      setSubjects(data);
      if (data.length > 0) setSelectedSubject(data[0]._id);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/auth/students");
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchMaterials = async (subjectId) => {
    try {
      const { data } = await api.get(`/materials/${subjectId}`);
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/materials", {
        ...formData,
        subjectId: selectedSubject,
      });
      // Reset form (keep assignedTo selection or reset? let's reset)
      setFormData({
        title: "",
        type: "link",
        content: "",
        description: "",
        assignedTo: [],
      });
      fetchMaterials(selectedSubject);
    } catch (error) {
      console.error("Error adding material:", error);
      alert("Failed to add material");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await api.delete(`/materials/${id}`);
        setMaterials(materials.filter((m) => m._id !== id));
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

  const handleStudentToggle = (studentId) => {
    setFormData((prev) => {
      const current = prev.assignedTo;
      if (current.includes(studentId)) {
        return {
          ...prev,
          assignedTo: current.filter((id) => id !== studentId),
        };
      } else {
        return { ...prev, assignedTo: [...current, studentId] };
      }
    });
  };

  const handleSelectAllStudents = () => {
    if (formData.assignedTo.length === students.length) {
      setFormData((prev) => ({ ...prev, assignedTo: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        assignedTo: students.map((s) => s._id),
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Controls & Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                Select Subject
              </h2>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input"
              >
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.icon} {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                Add New Material
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g. Introduction to Algebra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="link">Website Link 🔗</option>
                    <option value="youtube">YouTube Video 🎥</option>
                    <option value="note">Remark / Note 📝</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">
                    {formData.type === "note" ? "Content" : "URL"}
                  </label>
                  {formData.type === "note" ? (
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      className="input min-h-[100px]"
                      placeholder="Enter your remarks here..."
                    />
                  ) : (
                    <input
                      type="url"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder={
                        formData.type === "youtube"
                          ? "https://youtube.com/watch?v=..."
                          : "https://example.com"
                      }
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input min-h-[80px]"
                    placeholder="Brief description for students..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    Assign to Students{" "}
                    <span className="text-[var(--text-muted)] font-normal">
                      (Select at least one)
                    </span>
                  </label>
                  <div className="max-h-[200px] overflow-y-auto p-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-tertiary)]">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--border-color)]">
                      <input
                        type="checkbox"
                        checked={
                          students.length > 0 &&
                          formData.assignedTo.length === students.length
                        }
                        onChange={handleSelectAllStudents}
                        className="w-4 h-4 accent-[var(--duo-green)]"
                      />
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        Select All Students
                      </span>
                    </div>

                    {students.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center gap-2 py-1"
                      >
                        <input
                          type="checkbox"
                          checked={formData.assignedTo.includes(student._id)}
                          onChange={() => handleStudentToggle(student._id)}
                          className="w-4 h-4 accent-[var(--duo-blue)]"
                        />
                        <span className="text-sm text-[var(--text-secondary)]">
                          {student.name} ({student.email})
                        </span>
                      </div>
                    ))}
                    {students.length === 0 && (
                      <p className="text-sm text-[var(--text-muted)]">
                        No students found.
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || formData.assignedTo.length === 0}
                  fullWidth
                  size="lg"
                >
                  {submitting ? "Adding..." : "Add Material"}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
              Materials for{" "}
              {subjects.find((s) => s._id === selectedSubject)?.name}
            </h2>

            {materials.length === 0 ? (
              <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border-2 border-dashed border-[var(--border-color)]">
                <span className="text-4xl block mb-4">📂</span>
                <p className="text-[var(--text-secondary)]">
                  No materials added for this subject yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {materials.map((material) => (
                  <MaterialCard
                    key={material._id}
                    material={material}
                    isTeacher={true}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
