const BaseController = require("../../core/baseController");
const PricingCategory = require("./categoryModel");
const PricingDevice = require("./deviceModel");
const PricingService = require("./serviceModel");
const Joi = require("joi");

class PricingController extends BaseController {
  constructor() {
    super(null);
  }

  // ===== Categories =====
  async getAllCategories(req, res) {
    try {
      const categories = await PricingCategory.findAll({ order: [["order", "ASC"], ["id", "ASC"]] });
      return this.response(res, 200, true, "لیست دسته‌ها", categories);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت دسته‌ها", null, error);
    }
  }

  async getOneCategory(req, res) {
    try {
      const category = await PricingCategory.findByPk(req.params.id);
      if (!category) return this.response(res, 404, false, "دسته یافت نشد");
      return this.response(res, 200, true, "دسته", category);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت دسته", null, error);
    }
  }

  async createCategory(req, res) {
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        slug: Joi.string().allow(null, ""),
        description: Joi.string().allow(null, ""),
        imageUrl: Joi.string().allow(null, ""),
        order: Joi.number().allow(null),
        isActive: Joi.boolean().optional(),
      });
      const { error, value } = schema.validate(req.body, { stripUnknown: true });
      if (error) return this.response(res, 400, false, error.details[0].message);
      const created = await PricingCategory.create(value);
      return this.response(res, 201, true, "دسته ایجاد شد", created);
    } catch (error) {
      return this.response(res, 500, false, "خطا در ایجاد دسته", null, error);
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await PricingCategory.findByPk(req.params.id);
      if (!category) return this.response(res, 404, false, "دسته یافت نشد");
      const schema = Joi.object({
        title: Joi.string().optional(),
        slug: Joi.string().allow(null, "").optional(),
        description: Joi.string().allow(null, "").optional(),
        imageUrl: Joi.string().allow(null, "").optional(),
        order: Joi.number().allow(null).optional(),
        isActive: Joi.boolean().optional(),
      });
      const { error, value } = schema.validate(req.body, { stripUnknown: true });
      if (error) return this.response(res, 400, false, error.details[0].message);
      await category.update(value);
      return this.response(res, 200, true, "دسته بروزرسانی شد", category);
    } catch (error) {
      return this.response(res, 500, false, "خطا در بروزرسانی دسته", null, error);
    }
  }

  async deleteCategory(req, res) {
    try {
      const category = await PricingCategory.findByPk(req.params.id);
      if (!category) return this.response(res, 404, false, "دسته یافت نشد");
      await category.destroy();
      return this.response(res, 200, true, "دسته حذف شد");
    } catch (error) {
      return this.response(res, 500, false, "خطا در حذف دسته", null, error);
    }
  }

  // ===== Devices =====
  async getAllDevices(req, res) {
    try {
      const { categoryId } = req.query;
      const where = {};
      if (categoryId) where.categoryId = parseInt(categoryId);
      const devices = await PricingDevice.findAll({ where, order: [["order", "ASC"], ["id", "ASC"]] });
      return this.response(res, 200, true, "لیست دستگاه‌ها", devices);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت دستگاه‌ها", null, error);
    }
  }

  async getOneDevice(req, res) {
    try {
      const device = await PricingDevice.findByPk(req.params.id);
      if (!device) return this.response(res, 404, false, "دستگاه یافت نشد");
      return this.response(res, 200, true, "دستگاه", device);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت دستگاه", null, error);
    }
  }

  async createDevice(req, res) {
    try {
      const schema = Joi.object({
        categoryId: Joi.number().required(),
        title: Joi.string().required(),
        description: Joi.string().allow(null, ""),
        price: Joi.number().precision(2).required(),
        imageUrl: Joi.string().allow(null, ""),
        order: Joi.number().allow(null),
        isActive: Joi.boolean().optional(),
      });
      const { error, value } = schema.validate(req.body, { stripUnknown: true });
      if (error) return this.response(res, 400, false, error.details[0].message);
      const created = await PricingDevice.create(value);
      return this.response(res, 201, true, "دستگاه ایجاد شد", created);
    } catch (error) {
      return this.response(res, 500, false, "خطا در ایجاد دستگاه", null, error);
    }
  }

  async updateDevice(req, res) {
    try {
      const device = await PricingDevice.findByPk(req.params.id);
      if (!device) return this.response(res, 404, false, "دستگاه یافت نشد");
      const schema = Joi.object({
        categoryId: Joi.number().optional(),
        title: Joi.string().optional(),
        description: Joi.string().allow(null, "").optional(),
        price: Joi.number().precision(2).optional(),
        imageUrl: Joi.string().allow(null, "").optional(),
        order: Joi.number().allow(null).optional(),
        isActive: Joi.boolean().optional(),
      });
      const { error, value } = schema.validate(req.body, { stripUnknown: true });
      if (error) return this.response(res, 400, false, error.details[0].message);
      await device.update(value);
      return this.response(res, 200, true, "دستگاه بروزرسانی شد", device);
    } catch (error) {
      return this.response(res, 500, false, "خطا در بروزرسانی دستگاه", null, error);
    }
  }

  async deleteDevice(req, res) {
    try {
      const device = await PricingDevice.findByPk(req.params.id);
      if (!device) return this.response(res, 404, false, "دستگاه یافت نشد");
      await device.destroy();
      return this.response(res, 200, true, "دستگاه حذف شد");
    } catch (error) {
      return this.response(res, 500, false, "خطا در حذف دستگاه", null, error);
    }
  }

  // ===== Services =====
  async getAllServices(req, res) {
    try {
      const { deviceId } = req.query;
      const where = {};
      if (deviceId) where.deviceId = parseInt(deviceId);
      const services = await PricingService.findAll({ where, order: [["order", "ASC"], ["id", "ASC"]] });
      return this.response(res, 200, true, "لیست سرویس‌ها", services);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت سرویس‌ها", null, error);
    }
  }

  async getOneService(req, res) {
    try {
      const service = await PricingService.findByPk(req.params.id);
      if (!service) return this.response(res, 404, false, "سرویس یافت نشد");
      return this.response(res, 200, true, "سرویس", service);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت سرویس", null, error);
    }
  }

  async createService(req, res) {
    try {
      const schema = Joi.object({
        deviceId: Joi.number().required(),
        title: Joi.string().required(),
        description: Joi.string().allow(null, ""),
        price: Joi.number().precision(2).required(),
        order: Joi.number().allow(null),
        isActive: Joi.boolean().optional(),
      });
      const { error, value } = schema.validate(req.body, { stripUnknown: true });
      if (error) return this.response(res, 400, false, error.details[0].message);
      const created = await PricingService.create(value);
      return this.response(res, 201, true, "سرویس ایجاد شد", created);
    } catch (error) {
      return this.response(res, 500, false, "خطا در ایجاد سرویس", null, error);
    }
  }

  async updateService(req, res) {
    try {
      const service = await PricingService.findByPk(req.params.id);
      if (!service) return this.response(res, 404, false, "سرویس یافت نشد");
      const schema = Joi.object({
        deviceId: Joi.number().optional(),
        title: Joi.string().optional(),
        description: Joi.string().allow(null, "").optional(),
        price: Joi.number().precision(2).optional(),
        order: Joi.number().allow(null).optional(),
        isActive: Joi.boolean().optional(),
      });
      const { error, value } = schema.validate(req.body, { stripUnknown: true });
      if (error) return this.response(res, 400, false, error.details[0].message);
      await service.update(value);
      return this.response(res, 200, true, "سرویس بروزرسانی شد", service);
    } catch (error) {
      return this.response(res, 500, false, "خطا در بروزرسانی سرویس", null, error);
    }
  }

  async deleteService(req, res) {
    try {
      const service = await PricingService.findByPk(req.params.id);
      if (!service) return this.response(res, 404, false, "سرویس یافت نشد");
      await service.destroy();
      return this.response(res, 200, true, "سرویس حذف شد");
    } catch (error) {
      return this.response(res, 500, false, "خطا در حذف سرویس", null, error);
    }
  }
}

module.exports = new PricingController();


