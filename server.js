const express = require("express");
const axios = require("axios");
const {
  baseUrl,
  clientId,
  clientSecret,
  port,
  redirectUri,
} = require("./config");

const app = express();

const authUrl = `${baseUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

let accessToken;
let refreshToken;

app.get("/", (req, res) => {
  return res.send(
    `<h1>Hello! Click the link to get started.</h1><a href=${authUrl}>Start OAuth!</a>`
  );
});

app.get("/auth/cb", async (req, res) => {
  const code = req.query.code;

  console.log("**************");
  console.log("CODE:", code);
  console.log("**************");

  const authCodeUrl = `${baseUrl}/oauth/token?code=${code}&redirect_uri=${redirectUri}&grant_type=authorization_code&scope=API&client_id=${clientId}&client_secret=${clientSecret}`;

  const { access_token, refresh_token } = await tokenRequest(authCodeUrl);

  accessToken = access_token;
  refreshToken = refresh_token;

  return res.redirect("/auth/success");
});

app.get("/auth/refresh", async (req, res) => {
  const refreshUrl = `${baseUrl}/oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}`;

  const { access_token, refresh_token } = await tokenRequest(refreshUrl);

  accessToken = access_token;
  refreshToken = refresh_token;

  return res.redirect("/auth/success");
});

app.get("/auth/success", (req, res) => {
  console.log("**************");
  console.log("ACCESS TOKEN:", accessToken);
  console.log("REFRESH TOKEN:", refreshToken);
  console.log("**************");

  return res.send(`<h1>You did it!</h1>`);
});

app.get("/users", async (req, res) => {
  const users = await userRequest();

  return res
    .set("Content-Type", "application/json")
    .send(JSON.stringify(users, undefined, 2));
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

const tokenRequest = async (url) => {
  const { data } = await axios.post(url, {
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  return data;
};

const userRequest = async () => {
  const { data } = await axios.get(`${baseUrl}/api/v3/users`, {
    headers: { authorization: "Bearer " + accessToken },
  });

  return data;
};
