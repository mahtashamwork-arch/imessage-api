
const axios = require('axios');

exports.validateTokenExternally = async ( token)=>{
  try {
    const response = await axios.get(
      process.env.AUTH_APP_URL+'/api/auth/verify',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.user;
  } catch (error) {
    console.error('Error validating token:', error.message);
    return null;
  }
}
