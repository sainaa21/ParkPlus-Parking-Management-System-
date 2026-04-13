const express = require("express");
const router = express.Router();
const db = require("../db/knex"); 

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db("employees").where({ email }).first();

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;