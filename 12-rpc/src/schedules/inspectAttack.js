const { basename } = require('path');
const schedule = require('node-schedule');
const { sequelize, ScheduleLock, Sequelize } = require('../models');
const mailService = require('../services/mail');
const shopService = require('../services/shop');
const escapeHtmlInObject = require('../utils/escape-html-in-object');
const logger = require('../utils/logger');
const { Op } = Sequelize;

// 当前任务的锁名称
const LOCK_NAME = basename(__dirname);
// 锁的最长占用时间
const LOCK_TIMEOUT = 15 * 60 * 1000;
// 分布式任务并发数
const CONCURRENCY = 1;
// 报警邮件发送对象
const MAIL_RECEIVER = 'licg9999@126.com';

class InspectAttack {
  mailService;
  shopService;

  async init() {
    this.mailService = await mailService();
    this.shopService = await shopService();

    // 每到 15 分时巡检一次
    schedule.scheduleJob('*/15 * * * *', this.findAttackedShopInfoAndSendMail);
  }

  findAttackedShopInfoAndSendMail = async () => {
    // 上锁
    const lockUpT = await sequelize.transaction();
    try {
      const [lock] = await ScheduleLock.findOrCreate({
        where: { name: LOCK_NAME },
        defaults: { name: LOCK_NAME, counter: 0 },
        transaction: lockUpT,
      });

      if (lock.counter >= CONCURRENCY) {
        if (Date.now() - lock.updatedAt.valueOf() > LOCK_TIMEOUT) {
          lock.counter--;
          await lock.save({ transaction: lockUpT });
        }
        await lockUpT.commit();
        return;
      }

      lock.counter++;
      await lock.save({ transaction: lockUpT });
      await lockUpT.commit();
    } catch (err) {
      logger.error(err);
      await lockUpT.rollback();
      return;
    }

    try {
      // 寻找异常数据
      const shops = await this.shopService.find({
        pageSize: 100,
        where: {
          name: { [Op.or]: [{ [Op.like]: '<%' }, { [Op.like]: '%>' }] },
        },
      });

      // 发送报警邮件
      if (shops.length) {
        const subject = '安全警告，发现可疑店铺信息！';
        const html = `
  <div>以下是服务器巡检发现的疑似含有网络攻击的店铺信息：</div>
  <pre>
  ${shops
    .map((shop) => JSON.stringify(escapeHtmlInObject(shop), null, 2))
    .join('\n')}
  </pre>`;
        await this.mailService.sendMail({ to: MAIL_RECEIVER, subject, html });
      }
    } catch {}

    // 解锁
    const lockDownT = await sequelize.transaction();
    try {
      const lock = await ScheduleLock.findOne({
        where: { name: LOCK_NAME },
        transaction: lockDownT,
      });
      if (lock.counter > 0) {
        lock.counter--;
        await lock.save({ transaction: lockDownT });
      }
      await lockDownT.commit();
    } catch {
      await lockDownT.rollback();
    }
  };
}

module.exports = async () => {
  const s = new InspectAttack();
  await s.init();
};
