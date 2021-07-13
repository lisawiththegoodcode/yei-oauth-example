const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  port: 8080,
  redirectUri: `${process.env.HOST}/auth/cb`,
};
