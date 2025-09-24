/* Create a random 6 digit otp */
const generateRandomOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

module.exports = { generateRandomOTP };
