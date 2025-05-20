const express = require("express");
const cookieParser = require('cookie-parser');
const {restrictToLoggedInUserOnly, checkAuth} = require('./middleware/auth')
const path = require('path');
const app = express();
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const PORT = 8001;
app.set("view engine", "ejs"); // setting up the ejs
app.set('views' , path.resolve("./views")); // btaya sari ejs views me hai

app.use(express.json());

app.use(express.urlencoded({extended: false})) // these are middlewares
app.use(cookieParser());

app.use("/", checkAuth ,staticRoute);
app.use("/url" , restrictToLoggedInUserOnly, urlRoute);
app.use('/user', userRoute)



connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongo DB connected")
);
app.get("/url/:shortId", async (req, res) => {
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
