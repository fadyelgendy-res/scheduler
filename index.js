const cors = require("cors");
const express = require("express");
const cron = require("node-schedule");
const axios = require("axios");
const predefined = require("./predefined");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

function objectToQueryString(obj) {
    const keys = Object.keys(obj);
    const keyValuePairs = keys.map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    });
    return keyValuePairs.join("&");
}

function v1_scheduleTask(taskData) {
    try {
        const task = cron.scheduleJob(taskData.cronExpression, () => {
            const headers = taskData.headers;
            const url = taskData.callbackUrl;

            if (taskData.method === "get") {
                const query = objectToQueryString(taskData.query);
                const response = axios.get(`${url}?${query}`, {headers});
            }

            if (taskData.method === "post") {
                const requestBody = taskData.body;
                const response = axios.post(url, requestBody, {headers});
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Registering predefined callbacks
for (const callback in predefined) {
    try {
        v1_scheduleTask(predefined[callback]);
    } catch (error) {
        console.log(`Failed to register job: ${callback}`);
    }
}

app.post("/register-job", (req, res) => {
    console.log(req.body);
    v1_scheduleTask(req.body);

    res.json({
        status_code: 200,
        status: true,
        message: "job Registered Successfully!",
    });
});

app.listen(PORT, function () {
    console.log(`Server Started on port ${5000}`);
});
