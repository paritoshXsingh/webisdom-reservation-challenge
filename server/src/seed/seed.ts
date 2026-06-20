import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Site from "../models/Site";
import TimeSlot from "../models/TimeSlot";
import User from "../models/User";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Site.deleteMany({});
    await TimeSlot.deleteMany({});

    console.log("Old data removed");

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.insertMany([
      {
        name: "Admin User",
        email: "admin@test.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Test User",
        email: "user@test.com",
        password: hashedPassword,
        role: "user",
      },
    ]);

    console.log("Users seeded");

    const sites = await Site.insertMany([
      {
        name: "Red Fort",
        description: "Historic Mughal fort in Delhi",
      },
      {
        name: "Qutub Minar",
        description: "UNESCO World Heritage Site",
      },
      {
        name: "Taj Mahal",
        description: "Iconic monument in Agra",
      },
    ]);

    const slots = [];

    for (const site of sites) {
      slots.push(
        {
          siteId: site._id,
          date: "2026-06-25",
          startTime: "10:00",
          capacity: 100,
          availableTickets: 100,
        },
        {
          siteId: site._id,
          date: "2026-06-25",
          startTime: "12:00",
          capacity: 75,
          availableTickets: 75,
        },
        {
          siteId: site._id,
          date: "2026-06-25",
          startTime: "14:00",
          capacity: 50,
          availableTickets: 50,
        },
      );
    }

    await TimeSlot.insertMany(slots);

    console.log("Sites and slots seeded");
    console.log("Admin: admin@test.com / 123456");
    console.log("User : user@test.com / 123456");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
