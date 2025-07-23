import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

interface Unit {
  serialNumber: string;
  conditionOk: boolean;
  notes: string;
  photo: string;
  checkedBy: string;
}

export default function Level2Form() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const [units, setUnits] = useState<Unit[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddUnit = () => {
    setUnits([
      ...units,
      {
        serialNumber: "",
        conditionOk: true,
        notes: "",
        photo: "",
        checkedBy: "",
      },
    ]);
  };

  const handleFileChange = async (file: File, index: number) => {
    const base64 = await convertToBase64(file);
    const updated = [...units];
    updated[index].photo = base64;
    setUnits(updated);
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleChange = (
    index: number,
    field: keyof Unit,
    value: string | boolean
  ) => {
    const updated = [...units];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setUnits(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipmentId) return;
    setSubmitting(true);
    try {
      for (const unit of units) {
        const payload = {
          unitCode: unit.serialNumber,
          qcStatus: unit.conditionOk ? "pass" : "fail",
          issueNotes: unit.notes,
          photo: unit.photo,
          checkedBy: unit.checkedBy,
        };
        await api.post(`/qc/level2/${shipmentId}`, payload);
      }
      navigate("/");
    } catch (err) {
      console.error("Failed to submit Level 2 QC", err);
      alert("Failed to submit one or more units. Please check your input and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-2">
      <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Level 2 QC - Shipment #{shipmentId}</h2>
        <button
          onClick={handleAddUnit}
          className="mb-6 rounded-lg bg-blue-600 px-5 py-2 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          + Add Unit
        </button>
        <form onSubmit={handleSubmit} className="space-y-8">
          {units.map((unit, index) => (
            <div key={index} className="border rounded-xl p-6 space-y-4 bg-blue-50/40 shadow-sm">
              <div>
                <label className="block text-sm font-semibold mb-1">Serial Number</label>
                <input
                  type="text"
                  value={unit.serialNumber}
                  onChange={(e) => handleChange(index, "serialNumber", e.target.value)}
                  className="w-full rounded-lg border border-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  placeholder="Serial number"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={unit.conditionOk}
                  onChange={(e) => handleChange(index, "conditionOk", e.target.checked)}
                  className="accent-blue-600 w-5 h-5 rounded focus:ring-2 focus:ring-blue-300"
                />
                <span className="text-base font-medium">Condition OK</span>
              </label>

              <div>
                <label className="block text-sm font-semibold mb-1">Notes</label>
                <textarea
                  value={unit.notes}
                  onChange={(e) => handleChange(index, "notes", e.target.value)}
                  className="w-full rounded-lg border border-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  placeholder="Notes (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file, index);
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {unit.photo && <p className="text-xs text-green-600 mt-1">✓ Photo uploaded</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Checked By</label>
                <input
                  type="text"
                  value={unit.checkedBy}
                  onChange={(e) => handleChange(index, "checkedBy", e.target.value)}
                  className="w-full rounded-lg border border-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  placeholder="Your name"
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-500 py-2 text-white font-semibold shadow hover:from-green-700 hover:to-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit All Units"}
          </button>
        </form>
      </div>
    </main>
  );
}
