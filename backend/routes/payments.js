const express = require("express");
const router = express.Router();
const db = require("../db/knex");

router.get("/", async (req, res) => {
  try {
    const payments = await db("payments")
      .join("vehicles", "payments.vehicle_id", "vehicles.id")
      .select(
        "payments.*",
        "vehicles.vehicle_number",
        "vehicles.entry_time",
        "vehicles.exit_time"
      )
      .orderBy("payments.payment_time", "desc");

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;