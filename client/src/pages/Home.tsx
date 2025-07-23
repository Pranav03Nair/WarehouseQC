import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ShipmentCard from "../components/ShipmentCard";
import type { ShipmentCardProps } from "../components/ShipmentCard";

export default function Home() {
  const [shipments, setShipments] = useState<ShipmentCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/shipments")
      .then((res) => setShipments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md shadow-md border-b border-blue-100 px-4 py-4 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 drop-shadow-sm">Warehouse QC</h1>
        <Link
          to="/add-shipment"
          className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          + Add Shipment
        </Link>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-12">
        <section className="rounded-2xl bg-white/90 shadow-xl p-8 border border-gray-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <svg className="animate-spin h-10 w-10 text-blue-400 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              <p className="text-gray-500 text-xl font-medium">Loading shipments</p>
            </div>
          ) : shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <svg className="h-14 w-14 text-gray-300 mb-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              <p className="text-gray-400 text-xl font-medium">No shipments yet.</p>
              <Link to="/add-shipment" className="mt-6 rounded bg-blue-600 px-5 py-2 text-white font-semibold shadow hover:bg-blue-700 transition">Add your first shipment</Link>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {shipments.map((s) => (
                <ShipmentCard key={s.id} {...s} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
