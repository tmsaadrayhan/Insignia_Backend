import httpStatus from "http-status";
import pick from "../../../shared/pick.js";
import catchAsync from "../../../shared/catchAsync.js";
import sendResponse from "../../../shared/sendResponse.js";
import { BookingService } from "./booking.services.js";
import { bookingFilterableFields } from "./booking.constants.js";
import { paginationFields } from "../../../constants/pagination.js";

const addBooking = catchAsync(async (req, res) => {
    const bookingData = req.body;
  
    const result = await BookingService.addBooking(bookingData);
  
    return sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Booking added successfully",
      meta: null,
      data: result,
    });
  });
  
  const getOneBooking = catchAsync(async (req, res) => {
    const { id } = req.params;
  
    const result = await BookingService.getOneBooking(id);
  
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking retrieved successfully",
      meta: null,
      data: result,
    });
  });
  
  const deleteOneBooking = catchAsync(async (req, res) => {
    const { id } = req.params;
  
    const result = await BookingService.deleteOneBooking(id);
  
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking deleted successfully",
      meta: null,
      data: result,
    });
  });
  
  const deleteManyBooking = catchAsync(async (req, res) => {
    console.log("delete", req.query.ids);
    const deleteData = req.query.ids;
    const result = await BookingService.deleteManyBooking(deleteData);
  
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All bookings deleted successfully",
      meta: null,
      data: result,
    });
  });
  
  const getAllBookings = catchAsync(async (req, res) => {
    const filters = pick(req.query, bookingFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
  
    const { meta, data } = await BookingService.getAllBookings(
      filters,
      paginationOptions
    );
  
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bookings retrieved successfully",
      meta,
      data,
    });
  });


  const getAllBookingsForUser = catchAsync(async (req, res) => {
    const userId = req.params.userId;
    const filters = pick(req.query, bookingFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
  
    const { meta, data } = await BookingService.getAllBookingsForUser(
      userId,
      filters,
      paginationOptions
    );
  
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's bookings retrieved successfully",
      meta,
      data,
    });
  });

  const updateBlockStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BookingService.updateBlockStatus(id);
  
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Block status updated successfully",
      meta: null,
      data: result,
    });
  });

  export const BookingController = {
    addBooking,
    getOneBooking,
    deleteOneBooking,
    deleteManyBooking,
    getAllBookings,
    getAllBookingsForUser,
    updateBlockStatus,
  };
  

