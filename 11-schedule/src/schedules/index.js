const inspectAttackSchedule = require('./inspectAttack');

module.exports = async function initSchedules() {
  await inspectAttackSchedule();
};
