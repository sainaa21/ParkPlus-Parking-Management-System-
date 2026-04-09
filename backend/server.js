const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db/knex");

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

app.use("/api/slots", require("./routes/slots"));
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/employees", require("./routes/employees"));

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});