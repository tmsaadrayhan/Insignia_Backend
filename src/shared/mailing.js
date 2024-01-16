import nodemailer from "nodemailer";
import config from "../config/index.js";
import ApiError from "../errors/ApiError.js";
import httpStatus from "http-status";

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    tls: {
        rejectUnauthorized: false,
    },
    auth: {
      user: config.support_mail_address,
      pass: config.nodemailer_pass,
    },
  });

  const mailOptions = {
    // from: "support@insignia.org",
    // to: email,
    // subject: "Email Verification",
    // text: `Click the following link to verify your email:="${config.frontend_base_url}/auth/verify-email?token=${verificationToken}`,
    // html: `<p>Click the following link to verify your email: <a href="="${config.frontend_base_url}/auth/verify-email?token=${verificationToken}">Verify Email</a></p>`,
    from: "support@insignia.org",
    to: email,
    subject: "Insignia Email Verification",
    html: `<div style="width: 100%; padding: 20px 10px; font-size: 18px; font-weight: 400">
        <div style="width: 100%">
        <h3>Hello, ${email}:</h3>

        <p style="width: 100%; margin: 30px 0px">
          Please click on the link below <span  style="font-weight: 900">within 24 hours</span> to verify your Email
        </p>

        <p style="width: 100%">
            <a
              target="_blank"
              href="${config.frontend_base_url}/verify-email?token=${verificationToken}"
              style="
                padding: 12px 8px;
                background-color: #348edb;
                color: #ffff;
                cursor: pointer;
                text-decoration: none;
              "
              >Verify Your Email</a
            >
        </p>

        <p style="width: 100%; margin: 30px 0px">
          Once you Verify your Email, you will be signed in and able to enter the member-only area you tried to access.
        </p>
        </div>
        
        <p>Happy travels,</p>

        <div style="margin: 30px 0px">
        <p>The Insignia Support Team</p>
        <a target="_blank" href=${config.frontend_base_url}>${config.frontend_base_url}</a>
        </div>
      </div>`,
  };

  // Send the email
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.error("Error sending verification email:", error);
  //   } else {
  //     console.log("Verification email sent:", info.response);
  //   }
  // });
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
};

export default sendVerificationEmail;
