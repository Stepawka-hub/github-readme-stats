import "dotenv/config";
import statsCard from "../../api/index.js";
import repoCard from "../../api/pin.js";
import langCard from "../../api/top-langs.js";
import wakatimeCard from "../../api/wakatime.js";
import gistCard from "../../api/gist.js";
import express from "express";

const app = express();
// app.listen(process.env.port || 9000);

app.get("/", statsCard);
app.get("/pin", repoCard);
app.get("/top-langs", langCard);
app.get("/wakatime", wakatimeCard);
app.get("/gist", gistCard);

// Netlify Function handler
export const handler = async (event, context) => {
  try {
    // Create a new instance of the express app for each request.
    const app = express();

    app.get("/", statsCard);
    app.get("/pin", repoCard);
    app.get("/top-langs", langCard);
    app.get("/wakatime", wakatimeCard);
    app.get("/gist", gistCard);

    // Mock request and response objects
    const req = {
      path: event.path, // Pass the path from the event
      httpMethod: event.httpMethod,
      headers: event.headers,
      queryStringParameters: event.queryStringParameters,
      body: event.body,
    };

    const res = {
      statusCode: 200,
      headers: {},
      write: function (data) {
        this.body = data;
      },
      setHeader: function (name, value) {
        this.headers[name] = value;
      },
      end: function () {
        return {
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body,
        };
      },
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      send: function (body) {
        this.body = body;
        return this;
      },
      json: function (json) {
        this.setHeader("Content-Type", "application/json");
        this.body = JSON.stringify(json);
        return this;
      },
    };

    // Await the request
    return new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) {
          console.error("Express app error:", err);
          reject(err);
        } else {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: res.body,
          });
        }
      });
    });
  } catch (error) {
    console.error("Function execution error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
