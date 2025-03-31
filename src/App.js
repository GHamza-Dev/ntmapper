import logo from "./logo.svg";
import "./App.css";
import {
  Scan,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Database,
  Cable,
} from "lucide-react";
import { useState } from "react";

function App() {
  const [devices, setDevices] = useState([
    {
      id: "SW001",
      name: "Cisco Switch 3750",
      location: "Server Room A",
      ports: [
        {
          id: "P1",
          status: "connected",
          connectedTo: "CAB001",
          type: "Ethernet",
        },
        {
          id: "P2",
          status: "connected",
          connectedTo: "CAB002",
          type: "Ethernet",
        },
        {
          id: "P3",
          status: "disconnected",
          connectedTo: null,
          type: "Ethernet",
        },
        {
          id: "P4",
          status: "disconnected",
          connectedTo: null,
          type: "Ethernet",
        },
      ],
    },
    {
      id: "RT002",
      name: "Juniper Router EX4300",
      location: "Server Room B",
      ports: [
        { id: "P1", status: "connected", connectedTo: "CAB003", type: "Fiber" },
        {
          id: "P2",
          status: "disconnected",
          connectedTo: null,
          type: "Ethernet",
        },
      ],
    },
  ]);

  const [cables, setCables] = useState([
    { id: "CAB001", type: "Cat6", length: "2m", color: "Blue" },
    { id: "CAB002", type: "Cat6a", length: "5m", color: "Yellow" },
    { id: "CAB003", type: "Fiber", length: "10m", color: "Orange" },
  ]);

  const [activeView, setActiveView] = useState("scan");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Function to simulate scanning a device
  const simulateScan = () => {
    setCameraActive(true);
    setTimeout(() => {
      setCameraActive(false);
      setSelectedDevice(devices[0]);
    }, 1500);
  };

  // Toggle port connection status (for demo purposes)
  const togglePortStatus = (deviceId, portId) => {
    setDevices(
      devices.map((device) => {
        if (device.id === deviceId) {
          const updatedPorts = device.ports.map((port) => {
            if (port.id === portId) {
              if (port.status === "connected") {
                return { ...port, status: "disconnected", connectedTo: null };
              } else {
                // Simulate connecting to a random cable
                const availableCables = cables.filter(
                  (cable) =>
                    !devices
                      .flatMap((d) => d.ports)
                      .some((p) => p.connectedTo === cable.id)
                );
                const randomCable =
                  availableCables.length > 0
                    ? availableCables[0]
                    : { id: `CAB${Math.floor(Math.random() * 1000)}` };
                return {
                  ...port,
                  status: "connected",
                  connectedTo: randomCable.id,
                };
              }
            }
            return port;
          });
          return { ...device, ports: updatedPorts };
        }
        return device;
      })
    );
  };

  // Render the camera view (simulated)
  const renderCameraView = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-lg relative overflow-hidden relative">
      {/* <div className="w-full h-full absolute inset-0 bg-gray-800 opacity-50 z-10">
        <img src="https://www.bioras.com/wp-content/uploads/2016/11/Netgear_swich-1.jpg" alt="Logo" className="w-full h-full" />
      </div> */}
      {cameraActive ? (
        <>
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <div className="z-10 text-white">Scanning QR code...</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-blue-500 animate-pulse"></div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center relative z-50">
          <div className="text-gray-400 mb-4">
            Point camera at device or cable QR code
          </div>
          <button
            onClick={simulateScan}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
          >
            <Scan className="mr-2" size={18} /> Start Scanning
          </button>
        </div>
      )}
    </div>
  );

  // Render device details
  const renderDeviceDetails = () => {
    if (!selectedDevice) return null;

    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{selectedDevice.name}</h2>
          <span className="px-2 py-1 bg-gray-200 rounded text-sm">
            {selectedDevice.id}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Location: {selectedDevice.location}
        </div>

        <h3 className="font-semibold mb-2">Ports:</h3>
        <div className="space-y-2">
          {selectedDevice.ports.map((port) => (
            <div
              key={port.id}
              className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
              onClick={() => togglePortStatus(selectedDevice.id, port.id)}
            >
              <div className="flex items-center">
                {port.status === "connected" ? (
                  <CheckCircle size={18} className="text-green-500 mr-2" />
                ) : (
                  <XCircle size={18} className="text-red-500 mr-2" />
                )}
                <span>
                  {port.id} ({port.type})
                </span>
              </div>

              <div>
                {port.status === "connected" ? (
                  <div className="flex items-center">
                    <Cable size={16} className="mr-1 text-blue-600" />
                    <span className="text-sm text-blue-600">
                      {port.connectedTo}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No cable</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the main app interface
  return (
    <div className="max-w-md mx-auto bg-gray-100 p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">NTMapper</h1>
        <div className="flex">
          <button
            className={`p-2 rounded-l ${
              activeView === "scan" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveView("scan")}
          >
            <Scan size={20} />
          </button>
          <button
            className={`p-2 ${
              activeView === "collect"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveView("collect")}
          >
            <Plus size={20} />
          </button>
          <button
            className={`p-2 rounded-r ${
              activeView === "update" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveView("update")}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {activeView === "scan" && (
        <div>
          {renderCameraView()}
          {renderDeviceDetails()}
        </div>
      )}

      {activeView === "collect" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Register New Device</h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Device ID
            </label>
            <input
              type="text"
              placeholder="Scan QR or enter ID"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Device Name
            </label>
            <input
              type="text"
              placeholder="Enter device name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Number of Ports
            </label>
            <input
              type="number"
              placeholder="Enter port count"
              className="w-full p-2 border rounded"
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center">
            <Database size={18} className="mr-2" /> Register Device
          </button>
        </div>
      )}

      {activeView === "update" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Update Port Status</h2>
          <div className="mb-4">
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center mb-4"
              onClick={simulateScan}
            >
              <Scan size={18} className="mr-2" /> Scan Device QR
            </button>

            <div className="p-3 bg-yellow-100 rounded-lg text-sm mb-4">
              Tip: Scan a device QR code, then tap on ports to update their
              connection status.
            </div>

            {devices.map((device) => (
              <div
                key={device.id}
                className="mb-4 p-3 border rounded-lg"
                onClick={() => setSelectedDevice(device)}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{device.name}</span>
                  <span className="text-sm text-gray-500">{device.id}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {device.ports.filter((p) => p.status === "connected").length}{" "}
                  of {device.ports.length} ports connected
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
