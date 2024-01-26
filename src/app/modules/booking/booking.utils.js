import Booking from "./booking.model.js";

export const findLastBookingId = async () => {
    const lastBooking = await Booking.findOne({}).sort({ createdAt: -1 }).lean();
    return lastBooking?.bookingId
      ? lastBooking.bookingId.substring(4)
      : undefined;
  };
  
  export const generateBookingId = async () => {
    const currentId =
      (await findLastBookingId()) || (0).toString().padStart(5, "0");
  
    // increment by 1
    let incrementedId = (parseInt(currentId) + 1).toString().padStart(4, "0");
    incrementedId = `B-${new Date().getFullYear()}${incrementedId}`;
  
    return incrementedId;
  };