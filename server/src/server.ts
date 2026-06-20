import express from "express";
import cors from "cors";
import http from "http";
import { initSocket } from "./sockets/socket";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import siteRoutes from "./routes/siteRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import adminRoutes from "./routes/adminRoutes";

import "./workers/bookingWorker";

import { connectDB } from "./config/db";
import { env } from "./config/env";

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server running",
  });
});

const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);

  initSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();
