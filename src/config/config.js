const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development').required(),
    PORT: Joi.number().default(3000),
    DB_NAME: Joi.string().required().description('PostgreSQL database name'),
    DB_USERNAME: Joi.string().required().description('PostgreSQL username'),
    DB_PASSWORD: Joi.string().required().description('PostgreSQL password'),
    DB_HOST: Joi.string().required().description('PostgreSQL host'),
    DB_PORT: Joi.number().default(5432).description('PostgreSQL port'),
    TWILIO_ACCOUNT_SID: Joi.string().required().description('Twilio account SID'),
    TWILIO_AUTH_TOKEN: Joi.string().required().description('Twilio auth token'),
    SEND_GRID_FROM_EMAIL: Joi.string().required().description("Sendgrid 'from' email required"),
    SENDGRID_API_KEY: Joi.string().required().description('Sendgrid api key required'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  sequelize: {
    database: envVars.DB_NAME,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    dialect: 'postgres',
  },
  twilio: {
    twilioAccountSid: envVars.TWILIO_ACCOUNT_SID,
    twilioAuthToken: envVars.TWILIO_AUTH_TOKEN,
    twilioCountryCode: envVars.TWILIO_COUNTRY_CODE,
    twilioWhatsappNumber: envVars.TWILIO_WHATSAPP_NUMBER,
    twilioPhoneNumber: envVars.TWILIO_PHONE_NUMBER,
  },
  email: {
    sendGridApiKey: envVars.SENDGRID_API_KEY,
    from: envVars.SEND_GRID_FROM_EMAIL,
    otpVerificationTemplateId: envVars.SEND_GRID_VERIFICATION_TEMPLATE,
  },
};

module.exports = config;
