const express = require("express");
const cors = require("cors");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes =require("./routes/dashboardRoutes");
const rfidRoutes = require("./routes/rfidRoutes");
const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use(  "/api/dashboard",  dashboardRoutes);
app.use("/api/rfid",rfidRoutes);

module.exports = app;