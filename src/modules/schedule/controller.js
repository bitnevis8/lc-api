const BaseController = require("../../core/baseController");
const Appointment = require("./model");
const { Op } = require("sequelize");

class ScheduleController extends BaseController {
  constructor() {
    super(Appointment);
  }

  async getAll(req, res) {
    try {
      const { from, to, staffId, patientId, status } = req.query;
      const where = {};
      if (from || to) {
        where.startAt = {};
        if (from) where.startAt[Op.gte] = new Date(from);
        if (to) where.startAt[Op.lte] = new Date(to);
      }
      if (staffId) where.staffId = parseInt(staffId);
      if (patientId) where.patientId = parseInt(patientId);
      if (status) where.status = status;

      const data = await Appointment.findAll({ where, order: [["startAt", "ASC"]] });
      return this.response(res, 200, true, "لیست نوبت‌ها", data);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت نوبت‌ها", null, error);
    }
  }

  async getOne(req, res) {
    try {
      const item = await Appointment.findByPk(req.params.id);
      if (!item) return this.response(res, 404, false, "نوبت یافت نشد");
      return this.response(res, 200, true, "نوبت", item);
    } catch (error) {
      return this.response(res, 500, false, "خطا در دریافت نوبت", null, error);
    }
  }

  async create(req, res) {
    try {
      const { patientId, staffId, serviceTitle, startAt, endAt, notes } = req.body;
      if (!serviceTitle || !startAt || !endAt) {
        return this.response(res, 400, false, "serviceTitle, startAt, endAt الزامی است");
      }

      // جلوگیری از تداخل زمانی برای همان staff
      if (staffId) {
        const overlap = await Appointment.findOne({
          where: {
            staffId: parseInt(staffId),
            [Op.or]: [
              { startAt: { [Op.between]: [new Date(startAt), new Date(endAt)] } },
              { endAt: { [Op.between]: [new Date(startAt), new Date(endAt)] } },
              {
                startAt: { [Op.lte]: new Date(startAt) },
                endAt: { [Op.gte]: new Date(endAt) }
              }
            ]
          }
        });
        if (overlap) return this.response(res, 409, false, "تداخل زمانی برای اپراتور وجود دارد");
      }

      const created = await Appointment.create({
        patientId: patientId ? parseInt(patientId) : null,
        staffId: staffId ? parseInt(staffId) : null,
        serviceTitle,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        notes: notes || null
      });
      return this.response(res, 201, true, "نوبت ایجاد شد", created);
    } catch (error) {
      return this.response(res, 500, false, "خطا در ایجاد نوبت", null, error);
    }
  }

  async update(req, res) {
    try {
      const item = await Appointment.findByPk(req.params.id);
      if (!item) return this.response(res, 404, false, "نوبت یافت نشد");

      const payload = { ...req.body };
      if (payload.startAt) payload.startAt = new Date(payload.startAt);
      if (payload.endAt) payload.endAt = new Date(payload.endAt);

      // در صورت تغییر بازه، بررسی تداخل
      if (payload.staffId || payload.startAt || payload.endAt) {
        const staffId = payload.staffId ? parseInt(payload.staffId) : item.staffId;
        const startAt = payload.startAt ? payload.startAt : item.startAt;
        const endAt = payload.endAt ? payload.endAt : item.endAt;

        if (staffId) {
          const overlap = await Appointment.findOne({
            where: {
              id: { [Op.ne]: item.id },
              staffId,
              [Op.or]: [
                { startAt: { [Op.between]: [startAt, endAt] } },
                { endAt: { [Op.between]: [startAt, endAt] } },
                { startAt: { [Op.lte]: startAt }, endAt: { [Op.gte]: endAt } }
              ]
            }
          });
          if (overlap) return this.response(res, 409, false, "تداخل زمانی برای اپراتور وجود دارد");
        }
      }

      await item.update(payload);
      return this.response(res, 200, true, "نوبت بروزرسانی شد", item);
    } catch (error) {
      return this.response(res, 500, false, "خطا در بروزرسانی نوبت", null, error);
    }
  }

  async delete(req, res) {
    try {
      const item = await Appointment.findByPk(req.params.id);
      if (!item) return this.response(res, 404, false, "نوبت یافت نشد");
      await item.destroy();
      return this.response(res, 200, true, "نوبت حذف شد");
    } catch (error) {
      return this.response(res, 500, false, "خطا در حذف نوبت", null, error);
    }
  }
}

module.exports = new ScheduleController();


