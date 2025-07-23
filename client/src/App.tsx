import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddShipment from "./pages/AddShipment";
import Level1Form from "./pages/Level1Form";
import Level2Form from "./pages/Level2Form";
import ShipmentDetail from "./pages/ShipmentDetail";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="min-h-screen flex flex-col justify-center">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-shipment" element={<AddShipment />} />
            <Route path="/qc/level1/:shipmentId" element={<Level1Form />} />
            <Route path="/qc/level2/:shipmentId" element={<Level2Form />} />
            <Route path="/shipment/:shipmentId" element={<ShipmentDetail />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
