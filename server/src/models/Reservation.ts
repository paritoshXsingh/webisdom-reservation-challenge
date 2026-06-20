import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  quantity: number;
  status: "ACTIVE" | "CANCELLED";
}

const reservationSchema = new Schema<IReservation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    slotId: {
      type: Schema.Types.ObjectId,
      ref: "TimeSlot",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IReservation>("Reservation", reservationSchema);
