const express = require("express");
const app = express();
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const PORT = 8001;
app.use(express.json());

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongo DB connected")
),
  app.use("/url", urlRoute);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log("Served started at port 8001"));
