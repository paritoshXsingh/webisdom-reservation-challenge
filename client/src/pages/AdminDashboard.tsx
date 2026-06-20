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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Capacity Dashboard</h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
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

                  <td className="p-3">{slot.availableTickets}</td>

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
