import { Schema, model } from "mongoose";

const BookingSchema = Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: [true, "User ID is required"],
    },
    blockStatus: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      required: [true, "User ID is missing!"],
    },
    // paymentMethod: {
    //   type: String,
    //   required: [true, "paymentMethod is missing!"],
    // },
    isPaid: {
      type: Boolean,
      default: false
    },
    // trxID: {
    //   type: String,
    //   required: [true, "Transaction ID is missing!"],
    // },
    // paymentID: {
    //   type: String,
    //   required: [true, "Payment ID is missing!"],
    // },
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is missing!"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is missing!"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is missing!"],
    },
    mobile: {
      type: String,
      trim: true,
      required: [true, "Mobile number is missing!"],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Address is missing!"],
    },
    area: {
      type: String,
      trim: true,
      required: [true, "Area is missing!"],
    },
    country: {
      type: String,
      trim: true,
      required: [true, "Country is missing!"],
    },
    journeyDate: {
      type: Date,
      required: [true, "Journey date is missing!"],
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Name is missing!"],
    },
    option: {
      type: {
        option: String,
        price: Number,
        _id: String,
      },
      required: [true, "Option details are missing!"],
    },
    photo: {
      type: String,
      trim: true,
      required: [true, "Photo URL is missing!"],
    },
    totalPassenger: {
      type: Number,
      required: [true, "Total passengers is missing!"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is missing!"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Booking = model("Booking", BookingSchema);

export default Booking;

