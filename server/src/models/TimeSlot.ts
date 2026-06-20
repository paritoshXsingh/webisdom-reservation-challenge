import mongoose, { Schema, Document } from "mongoose";

export interface ITimeSlot extends Document {
  siteId: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  capacity: number;
  availableTickets: number;
}

const timeSlotSchema = new Schema<ITimeSlot>(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    availableTickets: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITimeSlot>(
  "TimeSlot",
  timeSlotSchema
);