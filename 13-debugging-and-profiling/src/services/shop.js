const { Shop } = require('../models');

class ShopService {
  async init() {}

  async find({ id, pageIndex = 0, pageSize = 10, where, logging }) {
    if (id) {
      return [await Shop.findByPk(id, { logging })];
    }

    return await Shop.findAll({
      offset: pageIndex * pageSize,
      limit: pageSize,
      where,
      logging,
    });
  }

  async modify({ id, values, logging }) {
    const target = await Shop.findByPk(id);

    if (!target) {
      return null;
    }

    Object.assign(target, values);
    return await target.save({ logging });
  }

  async remove({ id, logging }) {
    const target = await Shop.findByPk(id);

    if (!target) {
      return false;
    }

    return target.destroy({ logging });
  }

  async create({ values, logging }) {
    return await Shop.create(values, { logging });
  }
}

// 单例模式
let service;
module.exports = async function () {
  if (!service) {
    service = new ShopService();
    await service.init();
  }
  return service;
};
