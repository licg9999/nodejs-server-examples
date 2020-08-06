const { promisify } = require('util');
const nodemailer = require('nodemailer');
const { mailerOptions } = require('../config');

class MailService {
  mailer;

  async init() {
    this.mailer = nodemailer.createTransport(mailerOptions);
    await promisify(this.mailer.verify)();
  }

  async sendMail(params) {
    return await this.mailer.sendMail({
      from: mailerOptions.auth.user,
      ...params,
    });
  }
}

let service;
module.exports = async () => {
  if (!service) {
    service = new MailService();
    await service.init();
  }
  return service;
};
