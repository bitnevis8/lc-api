const Branch = require("./model");
const seedData = require("./seederData.json");

module.exports = async function seedBranches() {
  const count = await Branch.count();
  if (count > 0) return;
  await Branch.bulkCreate(seedData);
};


