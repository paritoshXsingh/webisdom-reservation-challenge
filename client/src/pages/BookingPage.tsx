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

  const [selectedSite, setSelectedSite] =
    useState("");

  const [selectedSlot, setSelectedSlot] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    const res =
      await api.get("/sites");

    setSites(res.data.data);
  };

  const fetchSlots = async (
    siteId: string
  ) => {
    const res =
      await api.get(
        `/sites/${siteId}/slots`
      );

    setSlots(res.data.data);
  };

  const handleSiteChange = (
    siteId: string
  ) => {
    setSelectedSite(siteId);

    fetchSlots(siteId);
  };

  const handleBooking = async () => {
    try {
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

      fetchSlots(selectedSite);
    } catch (error: any) {
      setMessage(
        error.response?.data
          ?.message ||
          "Booking Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">
          Book Tickets
        </h1>

        <select
          className="w-full border p-2 mb-4"
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
          className="w-full border p-2 mb-4"
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
              {slot.startTime}
              {" - "}
              {
                slot.availableTickets
              }{" "}
              left
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
          className="w-full border p-2 mb-4"
        />

        <button
          onClick={handleBooking}
          className="w-full bg-black text-white p-2 rounded"
        >
          Book Ticket
        </button>

        {message && (
          <p className="mt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingPage;