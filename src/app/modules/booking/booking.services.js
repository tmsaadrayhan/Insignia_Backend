import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError.js";
import Booking from "./booking.model.js";
import { bookingSearchableFields } from "./booking.constants.js";
import { PaginationHelpers } from "../../../helper/paginationHelper.js";

const addBooking = async (bookingData) => {
  try {
    const booking = await Booking.create(bookingData);
    return booking;
  } catch (error) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(statusCode, "Error creating booking");
  }
};

const getOneBooking = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
    }
    return booking;
  } catch (error) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(statusCode, "Error fetching booking");
  }
};

const deleteOneBooking = async (bookingId) => {
  try {
    const booking = await Booking.findByIdAndDelete(bookingId);
    return booking;
  } catch (error) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(statusCode, "Error deleting booking");
  }
};

// const deleteAllBookings = async (bookingIds) => {
//   try {
//     const result = await Booking.deleteMany({ _id: { $in: bookingIds } });
//     return result;
//   } catch (error) {
//     const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
//     throw new ApiError(statusCode, "Error deleting bookings");
//   }
// };

const deleteManyBooking = async (ids) => {
  try {
    console.log("Deleting bookings with IDs:", ids);
    const result = await Booking.deleteMany({ _id: { $in: ids } });
    console.log("Deletion result:", result);
    return result;
  } catch (error) {
    console.log("Error deleting bookings:", error);
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(statusCode, "Error deleting bookings in service");
  }
};



const getAllBookings = async (filters, paginationOptions) => {
  try {
    const { searchTerm, option, ...filtersData } = filters;
    const andCondition = [];

    if (searchTerm) {
      andCondition.push({
        $or: bookingSearchableFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
    
        if (option) {
          andCondition.push({
            'option.option': {
              $regex: option,
              $options: "i",
            },
          });
        }

    if (Object.keys(filtersData).length) {
      andCondition.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    const { page, limit, skip, sortBy, sortOrder } =
      PaginationHelpers.calculationPagination(paginationOptions);

    const sortConditions = {};

    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }

    const whereConditions =
      andCondition.length > 0 ? { $and: andCondition } : {};

    const result = await Booking.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(whereConditions);

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  } catch (error) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(statusCode, "Error fetching bookings");
  }
};

const getAllBookingsForUser = async (userId, filters, paginationOptions) => {
  try {
    const { searchTerm, ...filtersData } = filters;
    const andCondition = [
      {
        userId: userId,
      },
    ];

    if (searchTerm) {
      andCondition.push({
        $or: bookingSearchableFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }

    if (Object.keys(filtersData).length) {
      andCondition.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    const { page, limit, skip, sortBy, sortOrder } =
      PaginationHelpers.calculationPagination(paginationOptions);

    const sortConditions = {};

    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }

    const whereConditions =
      andCondition.length > 0 ? { $and: andCondition } : {};

    const result = await Booking.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(whereConditions);

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  } catch (error) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(statusCode, "Error fetching user bookings");
  }
};


const updateBlockStatus = async (id) => {
  const isExist = await Booking.findById(id);

  const result = await Booking.findByIdAndUpdate(
    { _id: id },
    { blockStatus: !isExist.blockStatus }
  );

  return result;
};

export const BookingService = {
  addBooking,
  getOneBooking,
  deleteOneBooking,
  deleteManyBooking,
  getAllBookings,
  getAllBookingsForUser,
  updateBlockStatus,
};
