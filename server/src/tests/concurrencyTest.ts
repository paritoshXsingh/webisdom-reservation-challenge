import axios from "axios";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzZiNzc3NzI4NDNiZjQzNzgyYThkNSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzgxOTg2NTEzLCJleHAiOjE3ODI1OTEzMTN9.7tY8WxDs8rRP5EgaMCQGo76bfbmC-WmkGB6l_VinLc8";

const SLOT_ID = "6a36b9984ed2ea7feac19922"; // capacity 50

const run = async () => {
  const requests = [];

  for (let i = 0; i < 100; i++) {
    requests.push(
      axios.post(
        "http://localhost:5000/api/reservations",
        {
          slotId: SLOT_ID,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      ),
    );
  }

  const results = await Promise.allSettled(requests);

  const success = results.filter((r) => r.status === "fulfilled").length;

  const failed = results.filter((r) => r.status === "rejected").length;

  console.log({
    success,
    failed,
  });
};

run();
