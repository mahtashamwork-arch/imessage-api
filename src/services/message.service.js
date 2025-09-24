const sgMail = require('@sendgrid/mail');
const config = require('../config/config');
const twilio = require('twilio');
const client = twilio(config.twilio.twilioAccountSid, config.twilio.twilioAuthToken, {});
const logger = require('../config/logger');

sgMail.setApiKey(config.email.sendGridApiKey);


async function sendMessage(messageBody,number) {
  try {
    messageBody = 'Message From Medical-home: \n' + messageBody ;
    const message = await client.messages.create({
      body: messageBody,
      from: config.twilio.twilioPhoneNumber,
      to: number, 
    });

    }catch (error) {
      console.error('Error sending message:', error);
      logger.error('Error sending message:', error.message);
    }

}
async function sendEmail(message,email) {
    try {  
      const msg = {
        to: email,
        from: config.email.from,
        subject: `Message From Medical-home Provider`,
        text: message,
        html: `<p><strong>Message From Medical-home Provider</strong></p><p>${message || ''}</p>`,
      };
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending email:', error);
      logger.error('Error sending email:', error.message);
    }
  }
module.exports = { sendEmail, sendMessage };
