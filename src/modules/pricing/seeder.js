const PricingCategory = require("./categoryModel");
const PricingDevice = require("./deviceModel");
const seedData = require("./seederData.json");

module.exports = async function seedPricing() {
  const catCount = await PricingCategory.count();
  const devCount = await PricingDevice.count();
  if (catCount > 0 || devCount > 0) return;

  for (const c of seedData.categories) {
    const createdCategory = await PricingCategory.create({
      title: c.title,
      slug: c.slug || null,
      description: c.description || null,
      order: c.order || null,
      isActive: c.isActive !== undefined ? c.isActive : true,
    });
    if (Array.isArray(c.devices)) {
      for (const d of c.devices) {
        await PricingDevice.create({
          categoryId: createdCategory.id,
          title: d.title,
          description: d.description || null,
          price: d.price,
          imageUrl: d.imageUrl || null,
          order: d.order || null,
          isActive: d.isActive !== undefined ? d.isActive : true,
        });
      }
    }
  }
};


