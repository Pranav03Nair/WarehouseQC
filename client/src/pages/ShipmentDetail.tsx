import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

interface Level1Check {
  packagingOk: boolean;
  sealOk: boolean;
  unitCountOk: boolean;
  damageNotes?: string;
  photos: string[];
  status: string;
  doneBy: string;
  doneAt: string;
}

interface UnitCheck {
  id: number;
  condition: string;
  notes?: string;
  photo: string;
}

interface Shipment {
  id: number;
  supplierName: string;
  checkedTime: string;
  status: string;
  createdBy: string;
  level1Check?: Level1Check;
  units: UnitCheck[];
}

export default function ShipmentDetail() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/shipments/${shipmentId}`)
      .then((res) => setShipment(res.data))
      .finally(() => setLoading(false));
  }, [shipmentId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="p-8 bg-white/80 rounded-xl shadow text-blue-700 font-semibold text-lg">Loading...</div></div>;
  }

  if (!shipment) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="p-8 bg-white/80 rounded-xl shadow text-red-600 font-semibold text-lg">Failed to load shipment details.</div></div>;
  }

  const getStatusChip = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "level1_done":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "level2_done":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-2">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-1">Shipment #{shipment.id}</h1>
            <p className="text-gray-600 text-lg">
              From: <strong>{shipment.supplierName}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition text-base"
          >
             Back to Home
          </button>
        </header>

        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-blue-800">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Status:</strong> <span className={`ml-2 px-3 py-1 text-sm rounded-full border font-semibold shadow-sm ${getStatusChip(shipment.status)}`}>{shipment.status}</span></p>
            <p><strong>Received At:</strong> {new Date(shipment.checkedTime).toLocaleString()}</p>
            <p><strong>Created By:</strong> {shipment.createdBy}</p>
          </div>
        </div>

        {/* Level 1 QC */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-blue-800">Level 1 QC</h2>
          {shipment.level1Check ? (
            <>
              <ul className="space-y-2 text-base">
                <li>Packaging OK: {shipment.level1Check.packagingOk ? "✅" : "❌"}</li>
                <li>Seal OK: {shipment.level1Check.sealOk ? "✅" : "❌"}</li>
                <li>Unit Count OK: {shipment.level1Check.unitCountOk ? "✅" : "❌"}</li>
                {shipment.level1Check.damageNotes && (
                  <li><strong>Damage Notes:</strong> {shipment.level1Check.damageNotes}</li>
                )}
                <li><strong>Status:</strong> <span className="font-bold uppercase">{shipment.level1Check.status}</span></li>
                <li><strong>Done By:</strong> {shipment.level1Check.doneBy}</li>
                <li><strong>Done At:</strong> {new Date(shipment.level1Check.doneAt).toLocaleString()}</li>
              </ul>
              {shipment.level1Check.photos.length > 0 && (
                <div className="flex gap-4 flex-wrap mt-6">
                  {shipment.level1Check.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`level-1-photo-${idx}`}
                      className="h-32 w-32 object-cover border rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">Level 1 QC not completed yet.</p>
          )}

          {shipment.status === "level1_Done" && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(`/qc/level2/${shipment.id}`)}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-lg hover:bg-purple-700 transition text-lg"
              >
                Proceed to Level 2 QC
              </button>
            </div>
          )}
        </div>

        {/* Level 2 QC */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-blue-800">Level 2 QC - Unit Checks</h2>
          {shipment.units && shipment.units.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shipment.units.map((unit, index) => (
                <div key={unit.id} className="border p-4 rounded-xl bg-blue-50/40 shadow-sm flex flex-col gap-2">
                  <p className="font-bold mb-1 text-blue-900">Unit #{index + 1}</p>
                  <p><strong>Condition:</strong> {unit.condition}</p>
                  {unit.notes && <p><strong>Notes:</strong> {unit.notes}</p>}
                  <img
                    src={unit.photo}
                    alt={`unit-${unit.id}`}
                    className="h-28 w-full object-cover mt-2 border rounded-md"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Level 2 QC not completed yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
