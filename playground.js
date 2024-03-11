const axios = require("axios");

const apiKey = "ckapi1610";
const url = "https://ckapi-inky.vercel.app/";

axios
  .get(url, {
    headers: {
      "x-api-key": apiKey,
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
