import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddShipment() {
  const [supplierName, setSupplierName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || !createdBy) return;

    setLoading(true);
    try {
      await api.post("/shipments", { supplierName, createdBy });
      navigate("/");
    } catch (err) {
      console.error("Error creating shipment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-2">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-8">
        <h2 className="mb-6 text-2xl font-bold text-blue-900 text-center">Add New Shipment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              required
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              required
              placeholder="Your name"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-white font-semibold shadow hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating…" : "Create Shipment"}
          </button>
        </form>
      </div>
    </main>
  );
}
