const Appointment = require("./model");
const seedData = require("./seederData.json");

module.exports = async function seedAppointments() {
  try {
    const count = await Appointment.count();
    if (count > 0) return; // از تکرار جلوگیری شود
    await Appointment.bulkCreate(seedData.map(x => ({
      serviceTitle: x.serviceTitle,
      startAt: new Date(x.startAt),
      endAt: new Date(x.endAt),
      status: x.status,
      notes: x.notes || null
    })));
  } catch (e) {
    throw e;
  }
};


