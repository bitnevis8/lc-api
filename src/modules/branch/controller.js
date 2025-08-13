const BaseController = require("../../core/baseController");
const Branch = require("./model");
const Joi = require("joi");

class BranchController extends BaseController {
  constructor() {
    super(Branch);
  }

  async getAll(req, res) {
    try {
      const items = await Branch.findAll({ order: [["createdAt", "DESC"]] });
      return this.response(res, 200, true, "لیست شعب", items);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت شعب", null, error);
    }
  }

  async getOne(req, res) {
    try {
      const item = await Branch.findByPk(req.params.id);
      if (!item) return this.response(res, 404, false, "شعبه یافت نشد");
      return this.response(res, 200, true, "شعبه", item);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت شعبه", null, error);
    }
  }

  async create(req, res) {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        address: Joi.string().allow(null, ""),
        phone: Joi.string().allow(null, ""),
        mobile: Joi.string().allow(null, ""),
        managerPhone: Joi.string().allow(null, ""),
        latitude: Joi.number().allow(null),
        longitude: Joi.number().allow(null),
        openTime: Joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).allow(null, ""),
        closeTime: Joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).allow(null, ""),
        instagram: Joi.string().uri().allow(null, ""),
        telegram: Joi.string().uri().allow(null, ""),
        whatsapp: Joi.string().uri().allow(null, ""),
      });
      const { error, value } = schema.validate(req.body, { stripUnknown: true });
      if (error) return this.response(res, 400, false, error.details[0].message);

      const created = await Branch.create(value);
      return this.response(res, 201, true, "شعبه ایجاد شد", created);
    } catch (error) {
      return this.response(res, 500, false, "خطا در ایجاد شعبه", null, error);
    }
  }

  async update(req, res) {
    try {
      const item = await Branch.findByPk(req.params.id);
      if (!item) return this.response(res, 404, false, "شعبه یافت نشد");
      const schema = Joi.object({
        name: Joi.string().optional(),
        address: Joi.string().allow(null, "").optional(),
        phone: Joi.string().allow(null, "").optional(),
        mobile: Joi.string().allow(null, "").optional(),
        managerPhone: Joi.string().allow(null, "").optional(),
        latitude: Joi.number().allow(null).optional(),
        longitude: Joi.number().allow(null).optional(),
        openTime: Joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).allow(null, "").optional(),
        closeTime: Joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).allow(null, "").optional(),
        instagram: Joi.string().uri().allow(null, "").optional(),
        telegram: Joi.string().uri().allow(null, "").optional(),
        whatsapp: Joi.string().uri().allow(null, "").optional(),
        isActive: Joi.boolean().optional(),
      });
      const { error, value } = schema.validate(req.body, { stripUnknown: true });
      if (error) return this.response(res, 400, false, error.details[0].message);

      await item.update(value);
      return this.response(res, 200, true, "شعبه بروزرسانی شد", item);
    } catch (error) {
      return this.response(res, 500, false, "خطا در بروزرسانی شعبه", null, error);
    }
  }

  async delete(req, res) {
    try {
      const item = await Branch.findByPk(req.params.id);
      if (!item) return this.response(res, 404, false, "شعبه یافت نشد");
      await item.destroy();
      return this.response(res, 200, true, "شعبه حذف شد");
    } catch (error) {
      return this.response(res, 500, false, "خطا در حذف شعبه", null, error);
    }
  }
}

module.exports = new BranchController();


