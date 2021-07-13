const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  baseUrl: `https://kazoorr270.rr.cs-demo.non-prod.kazoohr.io`,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  port: 8080,
  redirectUri: `${process.env.HOST}/auth/cb`,
};
