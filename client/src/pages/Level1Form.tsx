 
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function Level1Form() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();

  const [packagingOk, setPackagingOk] = useState(false);
  const [sealOk, setSealOk] = useState(false);
  const [unitCountOk, setUnitCountOk] = useState(false);
  const [damageNotes, setDamageNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [doneBy, setDoneBy] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const encodedFiles: string[] = [];

    for (const file of Array.from(files)) {
      const base64 = await convertToBase64(file);
      encodedFiles.push(base64);
    }

    setPhotos(encodedFiles);
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipmentId) return;

    const status = packagingOk && sealOk && unitCountOk ? "pass" : "fail";

    const payload = {
      packagingOk,
      sealOk,
      unitCountOk,
      damageNotes,
      photos,
      doneBy,
      status,
    };

    setLoading(true);
    try {
      await api.post(`/qc/level1/${shipmentId}`, payload);
      navigate("/");
    } catch (err) {
      console.error("Failed to submit QC:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-2">
      <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Level 1 QC - Shipment #{shipmentId}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={packagingOk} onChange={() => setPackagingOk(!packagingOk)} className="accent-blue-600 w-5 h-5 rounded focus:ring-2 focus:ring-blue-300" />
              <span className="text-base font-medium">Packaging OK</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={sealOk} onChange={() => setSealOk(!sealOk)} className="accent-blue-600 w-5 h-5 rounded focus:ring-2 focus:ring-blue-300" />
              <span className="text-base font-medium">Seal OK</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={unitCountOk} onChange={() => setUnitCountOk(!unitCountOk)} className="accent-blue-600 w-5 h-5 rounded focus:ring-2 focus:ring-blue-300" />
              <span className="text-base font-medium">Unit Count OK</span>
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Damage Notes</label>
            <textarea
              className="w-full rounded-lg border border-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
              rows={3}
              placeholder="Describe any damage (optional)"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Upload Photos</label>
            <input type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <p className="text-xs text-gray-500 mt-1">Base64 will be stored</p>
            {photos.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {photos.map((photo, idx) => (
                  <img key={idx} src={photo} alt={`upload-${idx}`} className="h-16 w-16 object-cover rounded border shadow" />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Done By</label>
            <input
              type="text"
              value={doneBy}
              onChange={(e) => setDoneBy(e.target.value)}
              className="w-full rounded-lg border border-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              placeholder="Your name"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-500 py-2 text-white font-semibold shadow hover:from-green-700 hover:to-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Level 1 QC"}
          </button>
        </form>
      </div>
    </main>
  );
}
