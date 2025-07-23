import { Link } from "react-router-dom";

export interface ShipmentCardProps {
  id: number;
  supplierName: string;
  status: string;
  checkedTime: string;
}

export default function ShipmentCard({
  id,
  supplierName,
  status,
  checkedTime,
}: ShipmentCardProps) {
  return (
    <Link
      to={`/shipment/${id}`}
      className="block rounded-2xl border border-blue-100 p-6 shadow-lg bg-white/70 backdrop-blur-md transition-transform duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl group"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-blue-900 group-hover:text-blue-700 transition-colors duration-150">{supplierName}</h3>
        <span
          className={`rounded-full px-3 py-0.5 text-xs font-semibold shadow-sm border ${
            status === "pending"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : status === "level1_done"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-green-100 text-green-800 border-green-200"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-1 text-sm text-gray-500">
        Received&nbsp;
        {new Date(checkedTime).toLocaleString()}
      </p>

      <div className="mt-6 flex gap-2">
        {status === "pending" && (
          <Link
            to={`/qc/level1/${id}`}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-blue-700 transition"
            onClick={(e) => e.stopPropagation()}
          >
            Start Level 1
          </Link>
        )}

        {status === "level1_done" && (
          <Link
            to={`/qc/level2/${id}`}
            className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
            onClick={(e) => e.stopPropagation()}
          >
            Start Level 2
          </Link>
        )}
      </div>
    </Link>
  );
}
