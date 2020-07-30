const Yup = require('yup');

exports.createShopFormSchema = () =>
  Yup.object({
    name: Yup.string()
      .required('店铺名不能为空')
      .min(3, '店铺名至少 3 个字符')
      .max(120, '店铺名不可超过 120 字'),
  });
