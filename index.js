const cors = require("cors");
const express = require("express");
const app = express();
const cron = require("node-cron");
const axios = require("axios");

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test-cron", (req, res) => {
  console.log("Hit");
  console.log(req.headers, req.query);
});

app.post("/test-cron-post", (req, res) => {
  console.log("Hit post");
  console.log(req.headers, req.body);
});

function objectToQueryString(obj) {
  const keys = Object.keys(obj);
  const keyValuePairs = keys.map((key) => {
    return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
  });
  return keyValuePairs.join("&");
}

app.post("/register-job", (req, res) => {
  const body = req.body;

  const task = cron.schedule(body.cron_expression, () => {
    const method = body.method;
    const headers = body.headers;
    const url = body.callback_url;

    if (method == "get") {
      const query = objectToQueryString(body.query);
      const response = axios.get(`${url}?${query}`, { headers });
    }

    if (method == "post") {
      const requestBody = body.body;
      const response = axios.post(url, requestBody, { headers });
    }
  });

  task.start();

  res.json({
    status_code: 200,
    status: true,
    message: "job Registered Successfully!",
  });
});

app.listen(PORT, function () {
  console.log(`Server Started on port ${5000}`);
});
