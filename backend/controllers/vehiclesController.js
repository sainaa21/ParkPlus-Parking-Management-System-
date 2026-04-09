const db = require("../db/knex");

exports.checkInVehicle = async (req, res) => {
  const { vehicle_number, driver_name, slot_id } = req.body;

  const trx = await db.transaction();

  try {
    const slot = await trx("parking_slots")
      .where({ id: slot_id, status: "available" })
      .forUpdate()
      .first();

    if (!slot) {
      await trx.rollback();
      return res.status(400).json({ message: "Selected slot not available" });
    }

    const [vehicle] = await trx("vehicles")
      .insert({
        vehicle_number,
        driver_name,
        slot_id: slot.id,
        entry_time: new Date(),
      })
      .returning("*");

    await trx("parking_slots")
      .where({ id: slot.id })
      .update({ status: "occupied" });

    await trx.commit();

    res.json({
      success: true,
      vehicle,
      slot: {
        ...slot,
        status: "occupied",
      },
    });
  } catch (err) {
    await trx.rollback();
    res.status(500).json({ error: err.message });
  }
};

exports.checkOutVehicle = async (req, res) => {
  const { vehicle_id } = req.body;

  const trx = await db.transaction();

  try {
    const vehicle = await trx("vehicles")
      .where({ id: vehicle_id })
      .first();

    if (!vehicle) {
      await trx.rollback();
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const exit_time = new Date();

    const duration = Math.ceil(
      (exit_time - new Date(vehicle.entry_time)) / (1000 * 60 * 60)
    );

    const rate = 20;
    const amount = duration * rate;

    await trx("payments").insert({
      vehicle_id,
      amount,
      duration,
      payment_time: exit_time,
    });

    await trx("vehicles")
      .where({ id: vehicle_id })
      .update({ exit_time });

    await trx("parking_slots")
      .where({ id: vehicle.slot_id })
      .update({ status: "available" });

    await trx.commit();

    res.json({ success: true, amount });
  } catch (err) {
    await trx.rollback();
    res.status(500).json({ error: err.message });
  }
};