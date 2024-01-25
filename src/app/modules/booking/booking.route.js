import express from "express";
import auth from "../../middleware/auth.js";
import { ENUM_USER_ROLE } from "../../../enums/users.js";
import { BookingController } from "./booking.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import payment from "../../middleware/payment.js";
import paymentController from "./payment.controller.js";

const router = express.Router();

router.post(
  "/createBooking",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  payment.bkash_auth,
  paymentController.payment_create,
);

router.get(
  "/bkash/payment/callback",
  // auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  payment.bkash_auth,
  paymentController.call_back,
);

router.post(
  "/add",
  auth(ENUM_USER_ROLE.USER,ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookingController.addBooking
);

router.get(
  "/all",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookingController.getAllBookings
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookingController.getOneBooking
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookingController.deleteOneBooking
);

router.delete(
  "/delete-many",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookingController.deleteManyBooking
);

router.get(
  "/all/:userId",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookingController.getAllBookingsForUser
);

router.put(
  "/update-block-status/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookingController.updateBlockStatus
);

export const BookingRoutes = router;
