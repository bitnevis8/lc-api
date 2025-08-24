const PricingCategory = require("./categoryModel");
const PricingDevice = require("./deviceModel");
const PricingService = require("./serviceModel");
const seedData = require("./seederData.json");

module.exports = async function seedPricing() {

  for (const c of seedData.categories) {
    const [createdCategory] = await PricingCategory.findOrCreate({
      where: { title: c.title },
      defaults: {
        slug: c.slug || null,
        description: c.description || null,
        imageUrl: c.imageUrl || null,
        order: c.order || null,
        isActive: c.isActive !== undefined ? c.isActive : true,
      }
    });
    if (Array.isArray(c.devices)) {
      for (const d of c.devices) {
        const [createdDevice] = await PricingDevice.findOrCreate({
          where: { title: d.title, categoryId: createdCategory.id },
          defaults: {
            description: d.description || null,
            price: d.price,
            imageUrl: d.imageUrl || null,
            order: d.order || null,
            isActive: d.isActive !== undefined ? d.isActive : true,
          }
        });
        if (Array.isArray(d.services)) {
          for (const s of d.services) {
            await PricingService.findOrCreate({
              where: { deviceId: createdDevice.id, title: s.title },
              defaults: {
                description: s.description || null,
                price: s.price,
                order: s.order || null,
                isActive: s.isActive !== undefined ? s.isActive : true,
              }
            });
          }
        } else if (d.price) {
          // اگر سرویس‌های جزئی تعریف نشده ولی قیمت کلی دارد، یک سرویس پیش‌فرض بساز
          await PricingService.create({
            deviceId: createdDevice.id,
            title: d.title,
            description: d.description || null,
            price: d.price,
            order: d.order || null,
            isActive: true,
          });
        }
      }
    }
  }
};


