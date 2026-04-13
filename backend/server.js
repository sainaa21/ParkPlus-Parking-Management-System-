const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db/knex");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboard");
const employeeRoutes = require("./routes/employees");
const reportsRoutes = require("./routes/reports");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);
app.use(express.json());

db.raw("SELECT 1+1 AS result")
  .then(() => console.log("DB connected ✅"))
  .catch((err) => console.log("DB error ❌", err));

app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/reports", reportsRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", authRoutes);
app.use("/api/slots", require("./routes/slots"));
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/payments", require("./routes/payments"));

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});