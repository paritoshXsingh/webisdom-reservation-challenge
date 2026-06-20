import { useEffect, useState } from "react";
import api from "../api/axios";

interface Site {
  _id: string;
  name: string;
}

interface TimeSlot {
  _id: string;
  startTime: string;
  availableTickets: number;
}

const BookingPage = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const [selectedSite, setSelectedSite] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await api.get("/sites");
      setSites(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSlots = async (siteId: string) => {
    try {
      const res = await api.get(
        `/sites/${siteId}/slots`
      );

      setSlots(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSiteChange = (
    siteId: string
  ) => {
    setSelectedSite(siteId);
    setSelectedSlot("");
    fetchSlots(siteId);
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      setMessage("Please select a slot");
      setMessageType("error");
      return;
    }

    if (quantity <= 0) {
      setMessage(
        "Quantity must be greater than 0"
      );
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/reservations",
        {
          slotId: selectedSlot,
          quantity,
        }
      );

      setMessage(
        "Reservation Successful"
      );
      setMessageType("success");

      fetchSlots(selectedSite);
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Booking Failed"
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex justify-end mb-4">
          <button
            onClick={logout}
            className="border px-4 py-2 rounded hover:bg-slate-100"
          >
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">
          Book Tickets
        </h1>

        <select
          className="w-full border p-2 mb-4 rounded"
          value={selectedSite}
          onChange={(e) =>
            handleSiteChange(
              e.target.value
            )
          }
        >
          <option value="">
            Select Site
          </option>

          {sites.map((site) => (
            <option
              key={site._id}
              value={site._id}
            >
              {site.name}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2 mb-4 rounded"
          value={selectedSlot}
          onChange={(e) =>
            setSelectedSlot(
              e.target.value
            )
          }
        >
          <option value="">
            Select Slot
          </option>

          {slots.map((slot) => (
            <option
              key={slot._id}
              value={slot._id}
            >
              {slot.startTime} -{" "}
              {
                slot.availableTickets
              }{" "}
              tickets left
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Number(
                e.target.value
              )
            )
          }
          className="w-full border p-2 mb-4 rounded"
        />

        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {loading
            ? "Booking..."
            : "Book Ticket"}
        </button>

        {message && (
          <p
            className={`mt-4 text-sm ${
              messageType ===
              "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingPage;