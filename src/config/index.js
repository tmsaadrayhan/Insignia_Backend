import dotenv from "dotenv";
import path from "path";
import crypto from 'crypto';
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

dotenv.config({ path: path.join(process.cwd(), ".env") });

// Defining the configuration object
const config = {
  env: process.env.NODE_ENV, // Environment mode (development, production, etc.)
  port: process.env.PORT, // Port number for the server

  database_url: process.env.DATABASE_URL, // URL for the database
  frontend_base_url:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_BASE_URL
      : process.env.FRONTEND_BASE_URL_DEV, // URL for the database
  admin_frontend_base_url:
    process.env.NODE_ENV === "production"
      ? process.env.ADMIN_FRONTEND_BASE_URL
      : process.env.ADMIN_FRONTEND_BASE_URL_DEV, // URL for the database
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_SECRET_EXPIRES_IN,
    email_expires_in: process.env.JWT_EMAIL_EXPIRES_IN,
    email_verification_secret: generateRandomString(),
    email_verification_expires_in: '1d',
  },

  refresh_token_name: process.env.REFRESH_TOKEN_NAME,
  refresh_token_domain: process.env.REFRESH_TOKEN_DOMAIN,

  support_mail_address: process.env.SUPPORT_MAIL_ADDRESS,
  nodemailer_pass: process.env.NODEMAILER_PASS,

  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,

  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,

  default_admin_pass: process.env.DEFAULT_ADMIN_PASS,
};

export default config;
