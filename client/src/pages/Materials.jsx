import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { MaterialCard } from "../components/MaterialCard";
import { Button } from "../components/Button";
import api from "../api/axios";

export const Materials = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, [subjectId]);

  const fetchMaterials = async () => {
    try {
      const [materialsRes, subjectRes] = await Promise.all([
        api.get(`/materials/${subjectId}`),
        api.get(`/subjects/${subjectId}`),
      ]);
      setMaterials(materialsRes.data);
      setSubject(subjectRes.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading materials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 pb-8 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              size="sm"
            >
              ← Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-5xl">{subject?.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                {subject?.name}
              </h1>
              <p className="text-[var(--text-secondary)]">
                Learning Materials & Resources
              </p>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {materials.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-[var(--border-color)]">
            <span className="text-4xl block mb-4">📚</span>
            <h3 className="text-xl font-bold text-[var(--text-secondary)]">
              No materials yet
            </h3>
            <p className="text-[var(--text-muted)]">
              Check back later for new resources.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <MaterialCard key={material._id} material={material} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
