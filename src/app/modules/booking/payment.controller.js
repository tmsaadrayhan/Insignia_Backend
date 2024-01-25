import axios from "axios";
import Booking from "./booking.model.js";
import globals from "node-global-storage";
import { v4 as uuidv4 } from "uuid";
import NodeLocalStorage from "node-localstorage";
class paymentController {
  constructor() {
    this.baseUrl = process.env.FRONTEND_BASE_URL;
    // this.localStorage = new NodeLocalStorage.LocalStorage('./scratch');
    this.localStorage = {};
  }

  bkash_headers = async () => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: globals.get("id_token"),
      "x-app-key": process.env.bkash_api_key,
    };
  };

  payment_create = async (req, res) => {
    const {
      userId,
      firstName,
      lastName,
      email,
      mobile,
      address,
      area,
      country,
      journeyDate,
      name,
      option = {},
      photo,
      totalPassenger,
      totalPrice,
    } = req.body;
    // this.localStorage.setItem('paymentData', JSON.stringify(req.body));
    this.localStorage['paymentData'] = JSON.stringify(req.body);
    globals.set("userId", userId);
    try {
      const { data } = await axios.post(
        process.env.bkash_create_payment_url,
        {
          amount: parseInt(totalPrice),
          mode: "0011",
          payerReference: " ",
          callbackURL:
            "https://insignia-backend-nine.vercel.app/api/v1/booking/bkash/payment/callback",
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
        },
        {
          headers: await this.bkash_headers(),
        }
      );

      return res.status(200).json({
        success: true,
        bkashURL: data.bkashURL,
        message: "Payment successfull.",
        statusMessage: data.statusMessage,
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };

  call_back = async (req, res) => {
    const { paymentID, status } = req.query;

    // const storedPaymentData = this.localStorage.getItem('paymentData');
    // const paymentData = storedPaymentData ? JSON.parse(storedPaymentData) : null;
    const storedPaymentData = this.localStorage['paymentData'];
    const paymentData = storedPaymentData ? JSON.parse(storedPaymentData) : null;

    if (!paymentData) {
      console.error("Stored payment data not found.");
      return res.status(500).json({ error: "Stored payment data not found." });
    }
   
    if (status === "cancel" || status === "failure") {
      return res.redirect(`${this.baseUrl}/booking-failed?message=${status}`);
    }
    if (status === "success") {
      try {
        const { data } = await axios.post(
          process.env.bkash_execute_payment_url,
          { paymentID },
          {
            headers: await this.bkash_headers(),
          }
        );
        if (data && data.statusCode === "0000") {
          //const userId = globals.get('userId')
          const bookingData = {
            userId: paymentData.userId,
            trxID: data.trxID,
            paymentID,
            paymentMethod: "BKASH",
            firstName: paymentData.firstName,
            lastName: paymentData.lastName,
            email: paymentData.email,
            mobile: paymentData.mobile,
            address: paymentData.address,
            area: paymentData.area,
            country: paymentData.country,
            journeyDate: paymentData.journeyDate,
            name: paymentData.name,
            option: paymentData.option
              ? {
                  option: paymentData.option.option,
                  price: parseInt(paymentData.option.price),
                  _id: paymentData.option._id,
                }
              : null,
            photo: paymentData.photo,
            totalPassenger: paymentData.totalPassenger,
            totalPrice: parseInt(data.amount),
          };

          await Booking.create(bookingData);

          return res.redirect(`${this.baseUrl}/booking-success`);
        } else {
          return res.redirect(
            `${this.baseUrl}/payment-failed?message=${data.statusMessage}`
          );
        }
      } catch (error) {
        console.error("Error in call_back:", error);
        console.log(error);
        return res.redirect(`${this.baseUrl}/booking-failed?message=${error.message}`);
      }
      
    }
    this.localStorage.removeItem('paymentData');
  };
}

export default new paymentController();
