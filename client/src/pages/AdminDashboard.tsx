import { useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../sockets/socket";

interface CapacityData {
  id: string;
  site: string;
  date: string;
  startTime: string;
  capacity: number;
  availableTickets: number;
  bookedTickets: number;
}

const AdminDashboard = () => {
  const [data, setData] = useState<CapacityData[]>([]);

  const fetchCapacity = async () => {
    try {
      const res = await api.get("/admin/capacity");

      setData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCapacity();

    socket.on("capacityUpdated", () => {
      fetchCapacity();
    });

    return () => {
      socket.off("capacityUpdated");
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Capacity Dashboard</h1>

          <div className="flex gap-2">
            <button
              onClick={fetchCapacity}
              className="border px-4 py-2 rounded bg-white"
            >
              Refresh
            </button>

            <button
              onClick={logout}
              className="border px-4 py-2 rounded bg-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {data.map((slot) => (
            <div key={slot.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg">{slot.site}</h2>

              <div className="mt-2 text-sm space-y-1">
                <p>
                  <strong>Date:</strong> {slot.date}
                </p>

                <p>
                  <strong>Time:</strong> {slot.startTime}
                </p>

                <p>
                  <strong>Capacity:</strong> {slot.capacity}
                </p>

                <p>
                  <strong>Available:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      slot.availableTickets === 0
                        ? "bg-red-500"
                        : slot.availableTickets < 10
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  >
                    {slot.availableTickets}
                  </span>
                </p>

                <p>
                  <strong>Booked:</strong> {slot.bookedTickets}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-3 text-left">Site</th>

                <th className="p-3 text-left">Date</th>

                <th className="p-3 text-left">Time</th>

                <th className="p-3 text-left">Capacity</th>

                <th className="p-3 text-left">Available</th>

                <th className="p-3 text-left">Booked</th>
              </tr>
            </thead>

            <tbody>
              {data.map((slot) => (
                <tr key={slot.id} className="border-b">
                  <td className="p-3">{slot.site}</td>

                  <td className="p-3">{slot.date}</td>

                  <td className="p-3">{slot.startTime}</td>

                  <td className="p-3">{slot.capacity}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        slot.availableTickets === 0
                          ? "bg-red-500"
                          : slot.availableTickets < 10
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    >
                      {slot.availableTickets}
                    </span>
                  </td>

                  <td className="p-3">{slot.bookedTickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
