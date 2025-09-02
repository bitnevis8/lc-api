const User = require("./model");
const seederData = require("./seederData.json");

async function seedUsers() {
  try {
    console.log("🌱 Starting users seeding...");
    const createdUsers = [];
    
    for (const userData of seederData) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData
      });
      
      if (created) {
        console.log(`✅ Created user: ${user.firstName} ${user.lastName} (ID: ${user.id})`);
      } else {
        console.log(`ℹ️ User already exists: ${user.firstName} ${user.lastName} (ID: ${user.id})`);
      }
      
      createdUsers.push(user);
    }
    
    console.log(`✅ Users seeded successfully. Total users: ${createdUsers.length}`);
    return createdUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}

module.exports = seedUsers;
